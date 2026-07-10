import React from 'react';

function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-[#b2b2b2] border-t border-[#545454]/30 font-sans mt-auto">
      <div className="max-w-[1600px] mx-auto px-6 py-12 md:px-12 lg:px-24">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-wider text-white font-folklore">
              The Eras Store
            </h2>
            <p className="text-sm text-[#838383] max-w-sm leading-relaxed">
              Find your best Era's. A collection of exclusive physical releases, outfits, and merchandise inspired by the greatest eras of your favorite music.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white font-folklore">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#catalogue" className="hover:text-white transition-colors duration-200">Product Catalogue</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors duration-200">About Us</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors duration-200">Contact Support</a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white font-folklore">
              Connect With Us
            </h3>
            <p className="text-sm text-[#838383]">
              Email: support@theerasstore.com
            </p>
            <div className="flex gap-4 text-sm pt-2">
              <a href="#" className="hover:text-white transition-colors duration-200">Instagram</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Twitter</a>
              <a href="#" className="hover:text-white transition-colors duration-200">TikTok</a>
            </div>
          </div>

        </div>

        <div className="border-t border-[#545454]/20 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#838383]">
          <p>© {new Date().getFullYear()} The Eras Store. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;