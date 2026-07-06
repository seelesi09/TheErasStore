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

// Konfigurasi Penyimpanan Multer
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

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce_mini'
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

// Endpoint SignUp
app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username dan Password tidak boleh kosong'
        });
    }

    const checkUserQuery = 'SELECT * FROM login WHERE Username = ?';

    db.query(checkUserQuery, [username], (err, result) => {
        if (err) {
            console.error('Error saat cek username: ', err);
            return res.status(500).json({ error: 'Terjadi kesalahan sistem' });
        }

        if (result.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username sudah terdaftar, gunakan username lain.'
            });
        }

        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error('Error saat hash password: ', hashErr);
                return res.status(500).json({ error: 'Terjadi kesalahan sistem' });
            }

            const insertQuery = 'INSERT INTO login (Username, Password) VALUES (?, ?)';

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
    const { username, password } = req.body;
    const query = 'SELECT * FROM login WHERE Username = ?';

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

                if (isMatch) {
                    res.json({
                        success: true,
                        message: 'Login Success',
                        user: user
                    });
                } else {
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

// Endpoint Get All Produk
app.get('/api/produk', (req, res) => {
    db.query('SELECT * FROM Produk', (err, result) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// Endpoint Add Produk
app.post('/api/produk', upload.array('image', 10), (req, res) => {
    const { Kodeproduk, Namaproduk, Kategori, Harga, Stok, Gambar } = req.body;

    if (!Kodeproduk || !Namaproduk || !Kategori || !Harga || !Stok || !Deskripsi) {
        return res.status(400).json({ error: 'Semua field (kecuali gambar) harus diisi' });
    }

    let pathGambar = null;
    if (req.files && req.files.length > 0) {
        pathGambar = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`).join(',');
    } else if (Gambar) {
        pathGambar = Gambar;
    }

    const query = 'INSERT INTO Produk (Kodeproduk, Namaproduk, Kategori, Harga, Stok, Gambar) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [Kodeproduk, Namaproduk, Kategori, Harga, Stok, pathGambar], (err, result) => {
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
    const query = 'DELETE FROM Produk WHERE ID = ?';

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

    const checkQuery = "SELECT Gambar FROM Produk WHERE ID = ?";

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

        const updateQuery = 'UPDATE Produk SET Kodeproduk = ?, Namaproduk = ?, Kategori = ?, Harga = ?, Stok = ?, Gambar = ?, Deskripsi = ? WHERE ID = ?';

        db.query(updateQuery, [Kodeproduk, Namaproduk, Kategori, Harga, Stok, pathGambar, Deskripsi, id], (updateErr, result) => {
            if (updateErr) {
                console.error('Error updating product:', updateErr.message);
                return res.status(500).json({ error: updateErr.message });
            }
            res.json({ success: true, message: "Produk Berhasil Diupdate!" });
        });
    });
});

app.post('/api/produk/decrease-stock', async (req, res) => {
    try {
        const productId = req.body.productId;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID diperlukan'
            });
        }

        await db.execute(
            'UPDATE produk SET Stok = Stok - 1 WHERE ID = ? AND Stok > 0',
            [productId]
        );

        const result = await db.execute(
            'SELECT Stok FROM produk WHERE ID = ?',
            [productId]
        );

        res.json({
            success: true,
            newStock: result
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});