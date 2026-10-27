document.addEventListener("DOMContentLoaded", function() {
    // Menangkap elemen
    const btnOpen = document.getElementById("btn-open");
    const bodyPage = document.getElementById("body-page");
    const heroPage = document.getElementById("hero-page");
    const bgMusic = document.getElementById("bg-music");
    const mainNavbar = document.getElementById("main-navbar");
    const btnMusic = document.getElementById("btn-music");

    let isMusicPlaying = false;

    // 1. Logika saat tombol Open Invitation ditekan
    btnOpen.addEventListener("click", function() {
        
        // Memastikan scroll benar-benar terbuka (Double Protection)
        document.documentElement.classList.remove("lock-scroll");
        document.body.classList.remove("lock-scroll");
        
        // Hapus gaya inline jika sebelumnya sempat kita tambahkan
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";

        // Memunculkan Navbar
        mainNavbar.classList.remove("d-none");

        // Memutar lagu
        if(bgMusic) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                btnMusic.innerHTML = "🎵 Music: ON";
            }).catch(error => {
                console.log("Autoplay dicegah browser:", error);
            });
        }

        // Scroll mulus ke Hero Page
        heroPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // 2. Logika Toggle Musik di Navbar
    btnMusic.addEventListener("click", function() {
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            btnMusic.innerHTML = "🎵 Music: OFF";
            // Ubah gaya tombol saat mati agar tidak terlalu menyala
            btnMusic.style.color = "#aaaaaa";
            btnMusic.style.borderColor = "#aaaaaa";
        } else {
            bgMusic.play();
            isMusicPlaying = true;
            btnMusic.innerHTML = "🎵 Music: ON";
            // Kembalikan ke warna emas saat hidup
            btnMusic.style.color = "#d4af37";
            btnMusic.style.borderColor = "#d4af37";
        }
    });

    // --- LOGIKA COUNTDOWN TIMER ---

    // Tentukan tanggal pernikahan (Format: Bulan Tanggal, Tahun Jam:Menit:Detik)
    // Silakan ganti sesuai kebutuhanmu!
    const weddingDate = new Date("Oct 31, 2026 08:00:00").getTime();

    // Update timer setiap 1 detik (1000 milidetik)
    const countdownFunction = setInterval(function() {

        // Ambil waktu hari ini
        const now = new Date().getTime();
        
        // Hitung jarak waktu dari sekarang ke hari pernikahan
        const distance = weddingDate - now;
        
        // Kalkulasi waktu untuk hari, jam, menit, dan detik
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Kirim hasil kalkulasi ke elemen HTML
        // (Menggunakan padStart agar angka di bawah 10 tetap ada '0' di depannya, misal '05')
        document.getElementById("days").innerHTML = days.toString().padStart(2, '0');
        document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0');
        
        // Jika waktu hitung mundur selesai
        if (distance < 0) {
            clearInterval(countdownFunction);
            document.getElementById("days").innerHTML = "00";
            document.getElementById("hours").innerHTML = "00";
            document.getElementById("minutes").innerHTML = "00";
            document.getElementById("seconds").innerHTML = "00";
        }
    }, 1000);
});

// --- LOGIKA FORM RSVP (LocalStorage) ---

document.addEventListener("DOMContentLoaded", function() {
    
    // --- VARIABEL GLOBAL UNTUK WISHES ---
    let displayedWishes = 0;
    const wishesPerLoad = 4; // Maksimal 4 wish per klik

    // --- FUNGSI RENDER WISHES ---
    function renderWishes(reset = false) {
        const container = document.getElementById("wishes-container");
        const totalElem = document.getElementById("total-wishes");
        const showingText = document.getElementById("showing-text");
        const btnLoadMore = document.getElementById("btn-load-more");

        if (!container) return;

        // Ambil data dari LocalStorage
        const rsvpList = JSON.parse(localStorage.getItem("wedding_rsvp_list")) || [];
        // Balik array agar ucapan terbaru berada di posisi pertama
        const reversedList = [...rsvpList].reverse();

        if (reset) {
            container.innerHTML = "";
            displayedWishes = 0;
        }

        const totalWishes = reversedList.length;
        totalElem.innerText = totalWishes;

        if (totalWishes === 0) {
            container.innerHTML = "<p class='text-center event-text'>Belum ada ucapan. Jadilah yang pertama memberikan doa!</p>";
            showingText.innerText = "Showing 0 of 0 wishes";
            btnLoadMore.classList.add("d-none");
            return;
        }

        // Potong array sebanyak 6 buah
        const nextBatch = reversedList.slice(displayedWishes, displayedWishes + wishesPerLoad);
        
        nextBatch.forEach(guest => {
            // Avatar berupa ikon hati (♡) jika Hadir, dan ikon bunga (❀) jika Tidak Hadir
            const iconStr = guest.attendance === "Hadir" ? "♡" : "❀"; 

            const wishHTML = `
                <div class="wish-card">
                    <div class="wish-heart-icon">♡</div>
                    <div class="wish-header">
                        <div class="wish-avatar">${iconStr}</div>
                        <div>
                            <p class="wish-name">${guest.name}</p>
                            <!-- Hanya menampilkan status, tanpa jumlah tamu -->
                            <p class="wish-status">${guest.attendance}</p>
                        </div>
                    </div>
                    <p class="wish-message">${guest.wish}</p>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", wishHTML);
        });

        // Update indikator teks
        displayedWishes += nextBatch.length;
        showingText.innerText = `Showing ${displayedWishes} of ${totalWishes} wishes`;

        // Sembunyikan tombol Load More jika semua ucapan sudah ditampilkan
        if (displayedWishes >= totalWishes) {
            btnLoadMore.classList.add("d-none");
        } else {
            btnLoadMore.classList.remove("d-none");
        }
    }

    // --- EVENT LISTENER LOAD MORE ---
    const btnLoadMore = document.getElementById("btn-load-more");
    if (btnLoadMore) {
        btnLoadMore.addEventListener("click", () => renderWishes(false));
    }

    // --- PANGGIL PERTAMA KALI SAAT WEB DIBUKA ---
    renderWishes(true);


    // --- UPDATE LOGIKA FORM RSVP (Di Script-mu yang sebelumnya) ---
    const rsvpForm = document.getElementById("rsvp-form");
    const successMsg = document.getElementById("rsvp-success-msg");

    if (rsvpForm) {
        rsvpForm.addEventListener("submit", function(e) {
            e.preventDefault(); 
            
            const name = document.getElementById("guest-name").value;
            const wish = document.getElementById("guest-wish").value;
            const attendance = document.querySelector('input[name="attendance"]:checked').value;

            const guestData = { name, attendance, wish };

            let rsvpList = JSON.parse(localStorage.getItem("wedding_rsvp_list")) || [];
            rsvpList.push(guestData); // Data baru ditaruh di akhir array

            localStorage.setItem("wedding_rsvp_list", JSON.stringify(rsvpList));

            successMsg.classList.remove("d-none");
            rsvpForm.reset();

            // Sembunyikan notifikasi setelah 3 detik
            setTimeout(() => { successMsg.classList.add("d-none"); }, 3000);
            
            // TRIGGGER RENDER WISHES AGAR LANGSUNG MUNCUL DI BAWAH (Real-time effect)
            renderWishes(true);
        });
    }
});