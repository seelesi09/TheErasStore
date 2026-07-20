import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Sajikan folder uploads secara statis agar bisa diakses browser
app.use('/uploads', express.static('uploads'));

// Buat folder uploads jika belum ada
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Konfigurasi Penyimpanan Multer (gambar produk)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Nama file unik: timestamp + angka acak + ekstensi asli
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Hanya diperbolehkan mengunggah file gambar!'));
    }
});

// Sajikan folder audio-albums secara statis
app.use('/audio-albums', express.static('audio-albums'));

// Buat folder audio-albums kalau belum ada
const audioDir = './audio-albums';
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir);
}

// Storage khusus audio album
const audioStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'audio-albums/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Multer instance khusus audio
const uploadAudio = multer({
    storage: audioStorage,
    limits: { fileSize: 15 * 1024 * 1024 }, // audio biasanya lebih besar dari gambar
    fileFilter: (req, file, cb) => {
        const filetypes = /mp3|wav|m4a|ogg/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        // Cek ekstensi saja (mimetype audio sering tidak konsisten antar browser)
        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Hanya diperbolehkan mengunggah file audio (mp3, wav, m4a, ogg)!'));
    }
});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false } // Aiven & banyak cloud MySQL wajib SSL
});

// Koneksi MySQL
db.connect((err) => {
    if (err) {
        console.log('Gagal koneksi database: ', err);
        process.exit(1);
    } else {
        console.log('Terhubung ke database');
    }
});

// ============================================================
// AUTH
// ============================================================

// Endpoint SignUp
app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    // jika username / password gak diisi 
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username dan Password tidak boleh kosong'
        });
    }
    // query sql 
    const checkUserQuery = 'SELECT * FROM login WHERE Username = ?';

    // cek username apakah sudah terdaftar 
    db.query(checkUserQuery, [username], (err, result) => {
        if (err) {
            console.error('Error saat cek username: ', err);
            return res.status(500).json({ error: 'Terjadi kesalahan sistem' });
        }
        // jika result lebih dr 0 berarti terdaftar, suruh pke yang lain 
        if (result.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username sudah terdaftar, gunakan username lain.'
            });
        }

        // kalo misal username ny gak ada yang pake lanjut ke password 
        // enkripsi pake bcript
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error('Error saat hash password: ', hashErr);
                return res.status(500).json({ error: 'Terjadi kesalahan sistem' });
            }

            // query post ke database (username sama password)
            const insertQuery = 'INSERT INTO login (Username, Password) VALUES (?, ?)';

            // post ke database / sign up 
            db.query(insertQuery, [username, hashedPassword], (insertErr, insertResult) => {
                if (insertErr) {
                    console.error('Error saat register:', insertErr);
                    return res.status(500).json({
                        error: 'Gagal menyimpan data pengguna'
                    });
                }
                res.status(201).json({
                    success: true,
                    message: 'Registrasi Berhasil, Silahkan Login'
                });
            });
        });
    });
});

// Endpoint Login
app.post('/api/login', (req, res) => {
    // variabel untuk simpan username, pw 
    const { username, password } = req.body;
    // query mencocokan username dari inputan pengguna ke database 
    const query = 'SELECT * FROM login WHERE Username = ?';

    // cek password bener apa enggak 
    db.query(query, [username], (err, result) => {
        if (err) {
            console.error('Login error:', err);
            return res.status(500).json({ error: err.message });
        }

        if (result.length > 0) {
            const user = result[0];
            bcrypt.compare(password, user.Password, (compareErr, isMatch) => {
                if (compareErr) {
                    console.error('Error saat verifikasi password: ', compareErr);
                    return res.status(500).json({
                        error: 'Terjadi kesalahan sistem'
                    });
                }
                // jika cocok maka login sukses 
                if (isMatch) {
                    res.json({
                        success: true,
                        message: 'Login Success',
                        user: user
                    });
                } else {
                    // jika gagal maka username / pw nya salah 
                    res.status(401).json({
                        success: false,
                        message: 'Wrong Username or Password'
                    });
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Wrong Username or Password'
            });
        }
    });
});

// ============================================================
// ALBUMS
// ============================================================

// Endpoint Get All Albums
app.get('/api/albums', (req, res) => {
    db.query('SELECT * FROM albums ORDER BY id ASC', (err, result) => {
        if (err) {
            console.error('Error fetching albums:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// Endpoint Add Album
app.post('/api/albums', uploadAudio.single('audio'), (req, res) => {
    const { name, bg_color, text_color, border_color } = req.body;

    if (!name || !bg_color || !text_color || !border_color || !req.file) {
        return res.status(400).json({ error: 'Semua field wajib diisi, termasuk file audio' });
    }

    const audio_url = `/audio-albums/${req.file.filename}`;

    const query = 'INSERT INTO albums (name, bg_color, text_color, border_color, audio_url) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [name, bg_color, text_color, border_color, audio_url], (err, result) => {
        if (err) {
            console.error('Error adding album:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Album berhasil ditambahkan', id: result.insertId });
    });
});

// Endpoint Hapus Album
app.delete('/api/albums/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM albums WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting album:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Album tidak ditemukan' });
        }

        res.json({ success: true, message: 'Album Berhasil Dihapus' });
    });
});

// ============================================================
// PRODUK
// (Catatan: nama tabel di database ternyata lowercase semua ->
// "produk", bukan "Produk". Semua query di bawah sudah disamakan
// ke lowercase supaya konsisten dan tidak error
// "Table ... doesn't exist" di MySQL Linux yang case-sensitive.
// Nama KOLOM tetap dibiarkan sesuai aslinya, misal Kodeproduk,
// Namaproduk, Harga, dst — yang diganti cuma nama TABEL-nya.)
// ============================================================

// Endpoint Get All Produk
app.get('/api/produk', (req, res) => {
    db.query('SELECT * FROM produk', (err, result) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// Endpoint Add Produk
app.post('/api/produk', upload.array('image', 10), (req, res) => {
    const { Kodeproduk, Namaproduk, Kategori, Harga, Stok, Gambar, Deskripsi } = req.body;

    if (!Kodeproduk || !Namaproduk || !Kategori || !Harga || !Stok || !Deskripsi) {
        return res.status(400).json({ error: 'Semua field (kecuali gambar) harus diisi' });
    }

    let pathGambar = null;
    if (req.files && req.files.length > 0) {
        pathGambar = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`).join(',');
    } else if (Gambar) {
        pathGambar = Gambar;
    }

    const query = 'INSERT INTO produk (Kodeproduk, Namaproduk, Kategori, Harga, Stok, Deskripsi, Gambar) VALUES (?, ?, ?, ?, ?, ?, ?)';

    db.query(query, [Kodeproduk, Namaproduk, Kategori, Harga, Stok, Deskripsi, pathGambar], (err, result) => {
        if (err) {
            console.error('Error adding product:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: "Produk Berhasil Ditambahkan", id: result.insertId });
    });
});

// Endpoint Hapus Produk
app.delete('/api/produk/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM produk WHERE ID = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Produk tidak ditemukan' });
        }

        res.json({ success: true, message: 'Produk Berhasil Dihapus' });
    });
});

// Endpoint Update Produk
app.put('/api/produk/:id', upload.array('image', 5), (req, res) => {
    const { id } = req.params;
    const { Kodeproduk, Namaproduk, Kategori, Harga, Stok, Gambar, Deskripsi } = req.body;

    const checkQuery = "SELECT Gambar FROM produk WHERE ID = ?";

    db.query(checkQuery, [id], (err, rows) => {
        if (err) {
            console.error('Error checking product:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Produk tidak ditemukan' });
        }

        let pathGambar = rows[0].Gambar;

        if (req.files && req.files.length > 0) {
            pathGambar = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`).join(',');
        }
        else if (Gambar) {
            pathGambar = Gambar;
        }

        const updateQuery = 'UPDATE produk SET Kodeproduk = ?, Namaproduk = ?, Kategori = ?, Harga = ?, Stok = ?, Gambar = ?, Deskripsi = ? WHERE ID = ?';

        db.query(updateQuery, [Kodeproduk, Namaproduk, Kategori, Harga, Stok, pathGambar, Deskripsi, id], (updateErr, result) => {
            if (updateErr) {
                console.error('Error updating product:', updateErr.message);
                return res.status(500).json({ error: updateErr.message });
            }
            res.json({ success: true, message: "Produk Berhasil Diupdate!" });
        });
    });
});

// ============================================================
// KERANJANG
// ============================================================

// Tambah ke keranjang
app.post('/api/keranjang', (req, res) => {
    const { User_ID, Produk_ID } = req.body;
    // query cek stok 
    const queryCheckStock = "SELECT Stok FROM produk WHERE ID = ?";
    db.query(queryCheckStock, [Produk_ID], (err, productResult) => {
        if (err) return res.status(500).json({ error: err.message });

        // jika gak ada hasilnya, berarti produknya gak ada 
        if (productResult.length === 0) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        // variabel stok dari hasil pencarian produk 
        const stokTersedia = productResult[0].Stok;

        // jika stoknya kurang daru atau sama dengan 0, tidak bisa di tambah ke keranjang 
        if (stokTersedia <= 0) {
            return res.status(400).json({ message: "Maaf, stok produk ini sudah habis!" });
        }

        // query ambil keranjang dari user id dan produk id 
        const quertCheck = "Select * from keranjang where User_ID = ? and Produk_ID = ?";
        db.query(quertCheck, [User_ID, Produk_ID], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            // jika ada produknya maka bisa di tambah
            if (result.length > 0) {
                const jumlahAkanDatang = result[0].Jumlah + 1;
                // jika nanti yang akan di add ke keranjang lebih banyak daripada stok, maka tidak bisa ditambah 
                if (jumlahAkanDatang > stokTersedia) {
                    return res.status(400).json({
                        message: `Gagal menambah! Stok tidak mencukupi. Hanya tersisa ${stokTersedia} pcs.`
                    });
                }

                // query add ke keranjang 
                const queryUpdate = 'update keranjang set Jumlah = Jumlah + 1 where User_ID = ? and Produk_ID = ?';
                // add ke keranjang 
                db.query(queryUpdate, [User_ID, Produk_ID], (err, updateResult) => {
                    if (err) return res.status(500).json({ error: err.message });
                    return res.json({ message: "Jumlah Produk Di Keranjang Berhasil Ditambah" });
                });
            } else {
                const queryInsert = 'Insert into keranjang (User_ID, Produk_ID, Jumlah) values (?, ?, 1)';
                db.query(queryInsert, [User_ID, Produk_ID], (err, insertResult) => {
                    if (err) return res.status(500).json({ error: err.message });
                    return res.status(201).json({ message: 'Produk berhasil dimasukkan ke keranjang' });
                });
            }
        });
    });
});

// endpoint get keranjang user
app.get('/api/keranjang/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `
    select k.ID as Keranjang_ID, k.Jumlah, p.Namaproduk, p.Harga, p.Gambar, p.Stok
    from keranjang k
    join produk p on k.Produk_ID = p.ID
    where k.User_ID = ?
    `
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// delete keranjang 
app.delete('/api/keranjang/:id', (req, res) => {
    const keranjangId = req.params.id;
    const query = 'Delete from keranjang where id = ?';

    db.query(query, [keranjangId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Produk berhasil dihapus dari keranjang' });
    });
});

// Update Keranjang 
app.put('/api/keranjang/:id', (req, res) => {
    const { id } = req.params;
    const { Jumlah } = req.body;

    if (!Jumlah || Jumlah < 1) {
        return res.status(400).json({ message: 'Jumlah Minimal Adalah 1' });
    }

    const queryGetProduct = "SELECT k.Produk_ID, p.Stok FROM keranjang k JOIN produk p ON k.Produk_ID = p.ID WHERE k.ID = ?";
    db.query(queryGetProduct, [id], (err, productResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (productResult.length === 0) return res.status(404).json({ message: "Data keranjang tidak ditemukan" });

        const stokTersedia = productResult[0].Stok;

        if (Jumlah > stokTersedia) {
            return res.status(400).json({
                message: `Gagal mengubah jumlah. Stok tidak mencukupi, hanya tersisa ${stokTersedia} pcs.`
            });
        }

        const queryUpdate = 'update keranjang set Jumlah = ? where ID = ?';
        db.query(queryUpdate, [Jumlah, id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ message: "Jumlah Berhasil Diperbarui" });
        });
    });
});

// ============================================================
// CHECKOUT & ORDER
// ============================================================

// checkout 
app.post('/api/checkout', async (req, res) => {
    const { User_ID, Total_Harga } = req.body;

    if (!User_ID || !Total_Harga) {
        return res.status(400).json({ message: "data tidak lengkap" });
    }

    try {
        const queryGetCart = `
            SELECT k.Produk_ID, k.Jumlah, p.Harga, p.Stok
            FROM keranjang k 
            JOIN produk p ON k.Produk_ID = p.ID
            WHERE k.User_ID = ?
        `;
        const [cartItems] = await db.promise().query(queryGetCart, [User_ID]);

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Keranjang Kosong!" });
        }

        for (const item of cartItems) {
            if (item.Stok < item.Jumlah) {
                return res.status(400).json({
                    message: `Gagal Checkout! Stok tidak mencukupi.`
                });
            }
        }

        const queryInsertOrder = "INSERT INTO orders (User_ID, Total_Harga, Status) VALUES (?, ?, 'Pending')";
        const [orderResult] = await db.promise().query(queryInsertOrder, [User_ID, Total_Harga]);
        const newOrderId = orderResult.insertId;

        const orderItemsData = cartItems.map(item => [
            newOrderId,
            item.Produk_ID,
            item.Jumlah,
            item.Harga
        ]);
        const queryInsertItems = 'INSERT INTO order_items (Order_ID, Produk_ID, Jumlah, Harga_Beli) VALUES ?';
        await db.promise().query(queryInsertItems, [orderItemsData]);

        for (const item of cartItems) {
            const queryUpdateStock = "UPDATE produk SET Stok = Stok - ? WHERE ID = ?";
            await db.promise().query(queryUpdateStock, [item.Jumlah, item.Produk_ID]);
            console.log(`[SUKSES MEMOTONG STOK] Produk ID ${item.Produk_ID} berkurang sebanyak ${item.Jumlah}`);
        }

        const queryEmptyCart = "DELETE FROM keranjang WHERE User_ID = ?";
        await db.promise().query(queryEmptyCart, [User_ID]);

        return res.json({ message: "Checkout Berhasil", Order_ID: newOrderId });

    } catch (err) {
        console.error("Terjadi kesalahan saat checkout:", err.message);
        return res.status(500).json({ error: "Proses checkout gagal: " + err.message });
    }
});

// Endpoint get history order
app.get('/api/orders/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `
        SELECT 
            o.ID AS Order_ID, o.Total_Harga, o.Tanggal_Order, o.Status,
            oi.Jumlah, oi.Harga_Beli,
            p.Namaproduk, p.Gambar
        FROM orders o
        JOIN order_items oi ON o.ID = oi.Order_ID
        JOIN produk p ON oi.Produk_ID = p.ID
        WHERE o.User_ID = ?
        ORDER BY o.Tanggal_Order DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const formattedOrders = results.reduce((acc, current) => {
            const foundOrder = acc.find(item => item.Order_ID === current.Order_ID);
            const itemDetails = {
                Namaproduk: current.Namaproduk,
                Gambar: current.Gambar,
                Jumlah: current.Jumlah,
                Harga_Beli: current.Harga_Beli
            };

            if (foundOrder) {
                foundOrder.Items.push(itemDetails);
            } else {
                acc.push({
                    Order_ID: current.Order_ID,
                    Total_Harga: current.Total_Harga,
                    Tanggal_Order: current.Tanggal_Order,
                    Status: current.Status,
                    Items: [itemDetails]
                });
            }
            return acc;
        }, []);

        return res.json(formattedOrders);
    });
});

// Endpoint Konfirmasi Pembayaran
app.post('/api/payment/confirm', upload.single('image'), (req, res) => {
    const { Order_ID } = req.body;

    if (!Order_ID || !req.file) {
        return res.status(400).json({ message: "Order ID dan foto bukti transfer wajib diisi/diunggah!" });
    }

    const pathBukti = `http://localhost:5000/uploads/${req.file.filename}`;

    const queryUpdateOrder = "UPDATE orders SET Status = 'Success', Bukti_Bayar = ? WHERE ID = ?";

    db.query(queryUpdateOrder, [pathBukti, Order_ID], (err, result) => {
        if (err) {
            console.error("Error saat konfirmasi pembayaran:", err.message);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Order ID tidak ditemukan" });
        }

        return res.json({
            success: true,
            message: "Payment Has Been Confirmed, Status updated to Success!",
            bukti_url: pathBukti
        });
    });
});

// endpoint get semua order (khusus admin)
app.get('/api/admin/orders', (req, res) => {
    const query = `
    SELECT 
    o.ID AS Order_ID,          
    o.Total_Harga, 
    o.Tanggal_Order, 
    o.Status, 
    o.Bukti_Bayar,
    l.Username AS Nama_Customer 
FROM orders o
JOIN login l ON o.User_ID = l.ID
ORDER BY o.Tanggal_Order DESC;
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching admin orders: ', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
