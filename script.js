// ======= timer (sama seperti sebelumnya) =======
let waktu = 60;
let intervalId = setInterval(() => {
    if (waktu > 0) {
        waktu--;
        document.getElementById("timer").innerText = waktu;
    } else {
        clearInterval(intervalId);
        alert("Waktu habis!");
    }
}, 1000);

// ======= inisialisasi skor =======
let skorBenar = 0;
let skorSalah = 0;
updateSkorDisplay();

// ======= fungsi buat angka random dan update tampilan =======
function nextPair() {
    let a, b, digitSatuan;
    do {
        a = Math.floor(Math.random() * 9) + 1; // 1..9
        b = Math.floor(Math.random() * 9) + 1; // 1..9
        digitSatuan = (a + b) % 10;
        // ulangi jika digit satuan 0 (karena tidak ada tombol 0)
    } while (digitSatuan === 0);

    document.getElementById("atas").innerText = a;
    document.getElementById("bawah").innerText = b;

    // simpan hasil yang diharapkan (digit satuan) ke atribut data supaya aman
    const soalEl = document.getElementById("angka");
    if (soalEl) {
        soalEl.setAttribute("data-hasil", String(digitSatuan));
    }
}

// panggil pertama kali
nextPair();

// ======= fungsi jawab yang disesuaikan untuk digit satuan =======
function jawab(angkaKlik) {
    // baca hasil yang diharapkan dari data attribute
    const soalEl = document.getElementById("angka");
    const hasilBenarText = soalEl ? soalEl.getAttribute("data-hasil") : null;
    const hasilBenar = hasilBenarText !== null ? Number(hasilBenarText) : NaN;

    // debug (hapus komentar jika perlu)
    // console.log("DEBUG - hasilBenar (digit satuan):", hasilBenar, "angkaKlik:", angkaKlik);

    if (isNaN(hasilBenar)) {
        alert("Terjadi kesalahan membaca soal. Muat ulang halaman.");
        return;
    }

    if (Number(angkaKlik) === hasilBenar) {
        skorBenar++;
        // bisa tambahkan efek visual green flash dll.
    } else {
        skorSalah++;
        // efek visual merah bisa ditambah
    }

    updateSkorDisplay();
    nextPair(); // ganti pasangan angka untuk soal berikutnya
}

// ======= fungsi update tampilan skor =======
function updateSkorDisplay() {
    let skorEl = document.getElementById("skor");
    if (!skorEl) {
        skorEl = document.createElement("div");
        skorEl.id = "skor";
        skorEl.style.marginTop = "12px";
        skorEl.style.fontSize = "18px";
        document.body.insertBefore(skorEl, document.getElementById("tombol"));
    }
    skorEl.innerText = `Benar: ${skorBenar}  |  Salah: ${skorSalah}`;
}
