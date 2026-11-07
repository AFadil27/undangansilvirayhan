
/* =========================================================
   WEDDING INVITATION JAVASCRIPT
   Silvi & Rayhan
   ========================================================= */


/*
  ============================
  1. KONFIGURASI
  ============================
*/

const CONFIG = {
  weddingDate: "2026-11-15T11:00:00+07:00",

  googleScriptUrl:
    "https://script.google.com/macros/s/AKfycbwVbn72R1ylxTGSnOcrbmpTxTQs8xEdJUj9Ny4F2kFYsMFRzd6aRsyHoopw-ZZedj9N/exec",
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
  if (guestNameElement) {
    guestNameElement.textContent = guestName;
  }

  const nameInput = document.getElementById("name");

  if (nameInput) {
    nameInput.value = guestName;
  }
}


/*
  ============================
  4. MUSIC ON / OFF
  ============================
*/

function updateMusicButton() {
  if (!music || !musicButton) {
    return;
  }

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


// Event tombol musik
if (musicButton && music) {
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

  music.addEventListener("play", updateMusicButton);
  music.addEventListener("pause", updateMusicButton);
}


/*
  ============================
  5. OPEN INVITATION
  ============================
*/

if (openInvitationButton) {
  openInvitationButton.addEventListener("click", async () => {
    // Hilangkan layar pembuka
    if (opening) {
      opening.classList.add("is-open");
      opening.style.display = "none";
    }

    // Tampilkan konten undangan
    if (mainContent) {
      mainContent.classList.remove("hidden");
      mainContent.style.display = "block";
    }

    // Tampilkan navigasi bawah
    if (bottomNav) {
      bottomNav.classList.remove("hidden");
      bottomNav.style.display = "grid";
    }

    // Tampilkan tombol musik
    if (musicButton) {
      musicButton.classList.remove("hidden");
    }

    // Coba putar musik saat tombol dibuka
    if (music) {
      try {
        await music.play();
      } catch (error) {
        console.log("Musik belum dapat diputar:", error);
      }
    }

    // Perbarui status tombol musik
    updateMusicButton();

    // Aktifkan tampilan undangan
    document.body.classList.add("invitation-open");
    document.body.classList.remove("is-locked");
  });
}


/*
  ============================
  6. COUNTDOWN REAL-TIME
  ============================
*/

const weddingDate = new Date(CONFIG.weddingDate).getTime();

function updateCountdown() {
  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  // Pastikan elemen countdown tersedia
  if (
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    return;
  }

  const now = new Date().getTime();
  const distance = weddingDate - now;

  // Jika waktu pernikahan sudah lewat
  if (distance <= 0) {
    daysElement.textContent = "0";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";
    return;
  }

  const days = Math.floor(
    distance / (1000 * 60 * 60 * 24)
  );

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

  daysElement.textContent = days;
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
}


// Jalankan countdown
updateCountdown();

setInterval(updateCountdown, 1000);


/*
  ============================
  7. RSVP - JUMLAH TAMU
  ============================
*/

function updateGuestCountVisibility() {
  if (!attendance || !guestCountWrap) {
    return;
  }

  if (attendance.value === "Hadir") {
    guestCountWrap.style.display = "block";
  } else {
    guestCountWrap.style.display = "none";
  }
}

if (attendance) {
  attendance.addEventListener(
    "change",
    updateGuestCountVisibility
  );

  updateGuestCountVisibility();
}


/*
  ============================
  8. RSVP -> GOOGLE SHEETS
  ============================
*/

function showRsvpStatus(message, type) {
  if (!rsvpStatus) {
    return;
  }

  rsvpStatus.textContent = message;
  rsvpStatus.className = `rsvp-status ${type}`;
}


if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const messageInput = document.getElementById("message");
    const guestCountInput = document.getElementById("guestCount");

    const name = nameInput
      ? nameInput.value.trim()
      : "";

    const message = messageInput
      ? messageInput.value.trim()
      : "";

    const attendanceValue = attendance
      ? attendance.value
      : "";

    const guestCount =
      attendanceValue === "Hadir" && guestCountInput
        ? guestCountInput.value
        : "0";

    if (!name || !attendanceValue) {
      showRsvpStatus(
        "Nama dan kehadiran wajib diisi.",
        "error"
      );
      return;
    }

    if (!CONFIG.googleScriptUrl) {
      showRsvpStatus(
        "Koneksi Google Sheets belum dipasang.",
        "error"
      );
      return;
    }

    if (submitRsvp) {
      submitRsvp.disabled = true;
      submitRsvp.textContent = "Mengirim...";
    }

    const payload = {
      name,
      message,
      attendance: attendanceValue,
      guestCount,
    };

    try {
      await fetch(CONFIG.googleScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
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
      if (submitRsvp) {
        submitRsvp.disabled = false;
        submitRsvp.textContent = "Kirim Konfirmasi";
      }
    }
  });
}


/*
  ============================
  9. COPY NOMOR REKENING
  ============================
*/

document.querySelectorAll(".copy-account").forEach((button) => {
  button.addEventListener("click", async () => {
    const account = button.dataset.account;

    if (!account) {
      return;
    }

    try {
      await navigator.clipboard.writeText(account);

      const originalText = button.textContent;

      button.textContent = "Berhasil Disalin";

      setTimeout(() => {
        button.textContent = originalText;
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

if ("IntersectionObserver" in window) {
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
      threshold: 0.35,
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}


/*
  ============================
  11. NAVIGASI BAWAH
  ============================
*/

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = document.querySelector(
      item.getAttribute("href")
    );

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});