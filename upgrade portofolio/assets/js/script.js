// assets/js/script.js

// Gunakan variabel global tunggal untuk menampung instans Typed
let typedInstance = null;

function setLanguage(lang) {
    // 1. Simpan bahasa pilihan pengguna
    localStorage.setItem('preferred_language', lang);
    document.documentElement.lang = lang;

    // 2. Ganti teks elemen data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // 3. Highlight tombol aktif
    const btnId = document.getElementById('btn-lang-id');
    const btnEn = document.getElementById('btn-lang-en');
    if (btnId && btnEn) {
        if (lang === 'id') {
            btnId.classList.add('active', 'btn-primary');
            btnId.classList.remove('btn-outline-primary');
            btnEn.classList.remove('active', 'btn-primary');
            btnEn.classList.add('btn-outline-primary');
        } else {
            btnEn.classList.add('active', 'btn-primary');
            btnEn.classList.remove('btn-outline-primary');
            btnId.classList.remove('active', 'btn-primary');
            btnId.classList.add('btn-outline-primary');
        }
    }

    // 4. FIX BUG DEFINITIF: GERAKAN CEPAT & DOUBLE CURSOR
    // DENGAN CARA RE-CREATING ELEMENT DOM
    const typedTarget = document.getElementById('typed-text');
    
    if (typedTarget) {
        // A. Pastikan instans Typed lama sudah benar-benar dihancurkan
        if (typedInstance) {
            typedInstance.destroy();
            typedInstance = null;
        }

        // B. Paksa hapus kursor Typed.js lama yang mungkin tertinggal di DOM
        document.querySelectorAll('.typed-cursor').forEach(cursor => cursor.remove());

        // C. STRATEGI UTAMA: Re-creating Element
        // Kita kloning elemen, hapus elemen asli, lalu pasang kembali elemen baru yang bersih.
        // Ini menghapus semua jejak animasi lama.
        const typedContainer = typedTarget.parentNode;
        
        // Buat elemen span baru yang sama persis
        const newTypedSpan = document.createElement('span');
        newTypedSpan.id = 'typed-text';
        newTypedSpan.className = typedTarget.className; // Pertahankan kelas CSS asli

        // Hapus elemen asli
        typedTarget.remove();
        
        // Tambahkan elemen baru ke parent
        typedContainer.appendChild(newTypedSpan);

        // D. Beri jeda kecil (sebagai praktik terbaik) untuk merender ulang DOM
        setTimeout(() => {
            // E. Inisialisasi Typed.js pada elemen BARU yang bersih
            typedInstance = new Typed('#typed-text', {
                strings: typedStrings[lang] || typedStrings['id'],
                typeSpeed: 60,       // Kecepatan natural
                backSpeed: 40,       
                backDelay: 2000,     
                loop: true,
                showCursor: true,    // Tampilkan 1 kursor tunggal
                cursorChar: '|'     // Pastikan karakter kursor tunggal
            });
        }, 50); // Jeda minimal 50ms setelah DOM dipasang kembali
    }
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferred_language') || 'id';
    setLanguage(savedLang);
});
