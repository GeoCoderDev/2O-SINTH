// ---------------------------------------------------------------
// |                   FUNCIONES DE APERTURA                     |
// ---------------------------------------------------------------

// PRESET
/**
 *
 * @param {Object} preset
 */
function openPreset(preset) {}
// MELODIA
/**
 *
 * @param {{object[], compasesUsados}} melodyData
 */
function openMelody({ melody, compasesUsados }) {
  if (melody.length === 0) return;

  setCantidadCompasesEnSecuenciadorMelodias(parseInt(compasesUsados));

  melody.forEach((dataNote) => {
    new NotaSecuenciadorDeMelodias(undefined, dataNote);
  });
}

//RITMO
/**
 *
 * @param {String} ritmo
 */
function openRhythm(ritmo) {
  if (ritmo === "") return;

  Array.from(ritmo).forEach((bit, index) => {
    if (bit == 0) return;
    Todos_los_cuadros_semicorchea_ritmos[index].classList.add(
      "Semicorchea-Ritmo-Activa"
    );
  });
}

// ---------------------------------------------------------------
// |                   LOCAL STORAGE(Default)                    |
// ---------------------------------------------------------------

function openLastData() {
  // OPENING THE PRESET

  // OPENING THE MELODY
  if (KEY_LAST_MELODY in localStorage) {
    let lastMelody = JSON.parse(localStorage.getItem(KEY_LAST_MELODY));

    openMelody(lastMelody);
  }

  // OPENING THE RHYTHM
  if (KEY_LAST_RHYTHM in localStorage) {
    let lastRhythm = JSON.parse(localStorage.getItem(KEY_LAST_RHYTHM));
    openRhythm(lastRhythm.rhythm);
  }
}

window.addEventListener("load", openLastData);
