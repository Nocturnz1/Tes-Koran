// ======= Inisialisasi skor =======
let skorBenar = 0;
let skorSalah = 0;
let intervalId;
let riwayatBenar = [];
let riwayatSalah = [];
let waktu = 360;

// ======= Fungsi buat angka random dan update tampilan =======
function nextPair() {
    let a, b, digitSatuan;
    do {
        a = Math.floor(Math.random() * 9) + 1;
        b = Math.floor(Math.random() * 9) + 1;
        digitSatuan = (a + b) % 10;
    } while (digitSatuan === 0);

    document.getElementById("atas").innerText = a;
    document.getElementById("bawah").innerText = b;

    const soalEl = document.getElementById("angka");
    soalEl.setAttribute("data-hasil", String(digitSatuan));
}

// ======= Fungsi update tampilan skor =======
function updateSkorDisplay() {
    const skorEl = document.getElementById("skor");
    skorEl.innerText = `Benar: ${skorBenar}  |  Salah: ${skorSalah}`;
}

// ======= Fungsi saat klik jawaban =======
function jawab(angkaKlik) {
    if (document.getElementById("test-screen").style.display === "none") return;

    const soalEl = document.getElementById("angka");
    const hasilBenar = Number(soalEl.getAttribute("data-hasil"));

    if (angkaKlik === hasilBenar) skorBenar++;
    else skorSalah++;

    // Simpan riwayat skor untuk grafik garis
    riwayatBenar.push(skorBenar);
    riwayatSalah.push(skorSalah);

    updateSkorDisplay();
    nextPair();
}

// ======= Tombol start =======
document.getElementById("start-btn").addEventListener("click", startTest);

function startTest() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("test-screen").style.display = "block";

    skorBenar = 0;
    skorSalah = 0;
    riwayatBenar = [];
    riwayatSalah = [];
    waktu = 60;
    updateSkorDisplay();

    nextPair();
    document.getElementById("timer").innerText = waktu;

    intervalId = setInterval(() => {
        if (waktu > 0) {
            waktu--;
            document.getElementById("timer").innerText = waktu;
        } else {
            clearInterval(intervalId);
            selesaiTes();
        }
    }, 1000);
}

// ======= Selesai tes =======
function selesaiTes() {
    document.getElementById("test-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "block";

    // Grafik tetap untuk riwayat jawaban
    const ctx = document.getElementById('grafik').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: riwayatBenar.length}, (_, i) => i+1),
            datasets: [
                {
                    label: 'Benar',
                    data: riwayatBenar,
                    borderColor: '#4CAF50',
                    fill: false,
                    tension: 0.2
                }
            ]
        },
        options: { responsive: true }
    });

    // Hitung skor berdasarkan jawaban benar dan waktu yang digunakan
    const waktuDipakai = 360 - waktu; // detik yang dipakai
    const totalJawaban = riwayatBenar.length; // total soal dijawab
    const jawabanBenar = skorBenar;

    // Skor dasar = persentase jawaban benar
    const skorPersentase = totalJawaban ? (jawabanBenar / totalJawaban) * 100 : 0;

    // Faktor waktu: semakin cepat selesai → skor tambah, misal skala 0–30
    const faktorWaktu = Math.max(0, (60 - waktuDipakai) / 60) * 30;

    // Skor akhir = skor jawaban + faktor waktu
    const skorAkhir = skorPersentase * 0.7 + faktorWaktu;

    // Tentukan kategori
    let kategori = '';
    if (skorAkhir >= 80) kategori = 'Bagus Sekali';
    else if (skorAkhir >= 50) kategori = 'Bagus';
    else kategori = 'Kurang';

    document.getElementById('kesimpulan').innerText =
        `Skor akhir: ${Math.round(skorAkhir)}% (${kategori}) - Jawaban benar: ${jawabanBenar}, Waktu dipakai: ${Math.round(waktuDipakai)} detik`;
}



