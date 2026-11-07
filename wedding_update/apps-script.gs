/*
  ============================================================
  GOOGLE APPS SCRIPT
  RSVP WEDDING INVITATION
  ============================================================

  CARA PAKAI:
  1. Buat Google Sheets baru.
  2. Buat sheet bernama: RSVP
  3. Header baris pertama:
     Timestamp | Nama | Ucapan | Kehadiran | Jumlah Tamu
  4. Extensions > Apps Script.
  5. Hapus kode bawaan.
  6. Paste kode ini.
  7. Save.
  8. Deploy > New deployment.
  9. Pilih Web app.
  10. Execute as: Me.
  11. Who has access: Anyone.
  12. Deploy.
  13. Copy Web app URL.
  14. Masukkan URL tersebut ke CONFIG.googleScriptUrl
      di script.js.
*/

const SHEET_NAME = "RSVP";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error("Sheet 'RSVP' tidak ditemukan.");
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.message || "",
      data.attendance || "",
      data.guestCount || "0"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: "RSVP berhasil disimpan."
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput("Wedding RSVP API is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}
