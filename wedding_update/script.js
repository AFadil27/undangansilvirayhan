/* =========================================================
   WEDDING INVITATION JAVASCRIPT
   ========================================================= */

/*
  ============================
  1. KONFIGURASI
  ============================
*/

const CONFIG = {
  // Ganti dengan tanggal & jam pernikahan.
  // Format: YYYY-MM-DDTHH:mm:ss
  weddingDate: "2026-11-15T11:00:00+07:00",

  /*
    Setelah Google Apps Script selesai dibuat,
    tempel URL Web App di bawah ini.

    Contoh:
    googleScriptUrl: "https://script.google.com/macros/s/XXXXXXXX/exec"
  */
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbwVbn72R1ylxTGSnOcrbmpTxTQs8xEdJUj9Ny4F2kFYsMFRzd6aRsyHoopw-ZZedj9N/exec",

  /*
    Nama tamu dapat diberikan lewat URL:
    index.html?to=Bapak%20Budi

    Contoh:
    https://domainkamu.com/?to=Bapak%20Budi
  */
};


/*
  ============================
  2. ELEMENT
  ============================
*/

const opening = document.getElementById("opening");
const mainContent = document.getElementById("mainContent");
const bottomNav = document.getElementById("bottomNav");
const musicButton = document.getElementById("musicButton");
const music = document.getElementById("weddingMusic");
const openInvitationButton = document.getElementById("openInvitation");

const guestNameElement = document.getElementById("guestName");

const rsvpForm = document.getElementById("rsvpForm");
const rsvpStatus = document.getElementById("rsvpStatus");
const submitRsvp = document.getElementById("submitRsvp");
const attendance = document.getElementById("attendance");
const guestCountWrap = document.getElementById("guestCountWrap");



/*
  ============================
  3. NAMA TAMU DARI URL
  ============================
*/

const params = new URLSearchParams(window.location.search);
const guestName = params.get("to");

if (guestName) {
  guestNameElement.textContent = guestName;
  document.getElementById("name").value = guestName;
}


/*
  ============================
  5. OPEN INVITATION
  ============================
*/

openInvitationButton.addEventListener("click", async () => {
  opening.style.opacity = "0";
  opening.style.transition = "opacity 0.8s ease";

  setTimeout(() => {
    opening.classList.add("hidden");
    mainContent.classList.remove("hidden");
    bottomNav.classList.remove("hidden");
    musicButton.classList.remove("hidden");

    document.body.classList.remove("is-locked");

    document.getElementById("home").scrollIntoView({
      behavior: "instant",
      block: "start"
    });
  }, 800);

  // Tampilkan tombol musik
  musicButton.classList.remove("hidden");

  // Coba putar musik
  try {
    await music.play();
  } catch (error) {
    console.log("Musik belum dapat diputar:", error);
  }

  // Perbarui tampilan tombol musik
  updateMusicButton();

  // Aktifkan animasi halaman undangan
  document.body.classList.add("invitation-open");
});
/*
  ============================
  COUNTDOWN REAL-TIME
  ============================
*/

// TANGGAL DAN JAM PERNIKAHAN
// Format: YYYY-MM-DDTHH:mm:ss+07:00
const weddingDate = new Date(CONFIG.weddingDate).getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  // Kalau waktu pernikahan sudah lewat
  if (distance <= 0) {
    daysElement.textContent = "0";
    hoursElement.textContent = "0";
    minutesElement.textContent = "0";
    secondsElement.textContent = "0";
    return;
  }

  // Hitung waktu yang tersisa
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) /
    (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) /
    (1000 * 60)
  );

  const seconds = Math.floor(
    (distance % (1000 * 60)) /
    1000
  );

  // Tampilkan
  daysElement.textContent = days;
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
}

// Jalankan langsung
updateCountdown();

// Update setiap 1 detik
setInterval(updateCountdown, 1000);

/*
  ============================
  6. MUSIC ON / OFF
  ============================
*/

function updateMusicButton() {
  if (music.paused) {
    musicButton.textContent = "♪";
    musicButton.classList.remove("is-playing");
    musicButton.setAttribute("aria-label", "Putar musik");
    musicButton.setAttribute("title", "Putar musik");
    musicButton.setAttribute("aria-pressed", "false");
  } else {
    musicButton.textContent = "♫";
    musicButton.classList.add("is-playing");
    musicButton.setAttribute("aria-label", "Matikan musik");
    musicButton.setAttribute("title", "Matikan musik");
    musicButton.setAttribute("aria-pressed", "true");
  }
}

// Tombol ON / OFF
musicButton.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
    } catch (error) {
      console.error("Musik gagal diputar:", error);
    }
  } else {
    music.pause();
  }

  updateMusicButton();
});

// Perbarui tampilan jika status audio berubah
music.addEventListener("play", updateMusicButton);
music.addEventListener("pause", updateMusicButton);


/*
  ============================
  7. RSVP - JUMLAH TAMU
  ============================
*/

function updateGuestCountVisibility() {
  if (attendance.value === "Hadir") {
    guestCountWrap.style.display = "block";
  } else {
    guestCountWrap.style.display = "none";
  }
}

attendance.addEventListener("change", updateGuestCountVisibility);
updateGuestCountVisibility();


/*
  ============================
  8. RSVP -> GOOGLE SHEETS
  ============================
*/

rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();
  const attendanceValue = attendance.value;
  const guestCount =
    attendanceValue === "Hadir"
      ? document.getElementById("guestCount").value
      : "0";

  if (!name || !attendanceValue) {
    showRsvpStatus("Nama dan kehadiran wajib diisi.", "error");
    return;
  }

  // Jika URL Apps Script belum diisi.
  if (!CONFIG.googleScriptUrl) {
    showRsvpStatus(
      "Form sudah siap, tetapi koneksi Google Sheets belum dipasang. Isi googleScriptUrl di script.js.",
      "error"
    );
    return;
  }

  submitRsvp.disabled = true;
  submitRsvp.textContent = "Mengirim...";

  const payload = {
    name,
    message,
    attendance: attendanceValue,
    guestCount
  };

  try {
    await fetch(CONFIG.googleScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    showRsvpStatus(
      "Terima kasih. Konfirmasi kehadiran Anda telah diterima.",
      "success"
    );

    rsvpForm.reset();
    updateGuestCountVisibility();
  } catch (error) {
    console.error(error);
    showRsvpStatus(
      "Terjadi masalah saat mengirim. Silakan coba lagi.",
      "error"
    );
  } finally {
    submitRsvp.disabled = false;
    submitRsvp.textContent = "Kirim Konfirmasi";
  }
});

function showRsvpStatus(message, type) {
  rsvpStatus.textContent = message;
  rsvpStatus.className = `rsvp-status ${type}`;
}


/*
  ============================
  9. COPY NOMOR REKENING
  ============================
*/

document.querySelectorAll(".copy-account").forEach((button) => {
  button.addEventListener("click", async () => {
    const account = button.dataset.account;

    try {
      await navigator.clipboard.writeText(account);
      const original = button.textContent;
      button.textContent = "Berhasil Disalin";

      setTimeout(() => {
        button.textContent = original;
      }, 1800);
    } catch (error) {
      alert("Nomor rekening: " + account);
    }
  });
});


/*
  ============================
  10. ACTIVE BOTTOM NAV
  ============================
*/

const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-item");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((item) => {
          item.classList.toggle(
            "active",
            item.dataset.section === entry.target.id
          );
        });
      }
    });
  },
  {
    root: null,
    threshold: 0.35
  }
);

sections.forEach((section) => observer.observe(section));


/*
  ============================
  11. CLOSEST NAV ITEM
  ============================
*/

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = document.querySelector(item.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});
