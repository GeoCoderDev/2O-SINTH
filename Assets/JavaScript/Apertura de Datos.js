// ---------------------------------------------------------------
// |                   FUNCIONES DE APERTURA                     |
// ---------------------------------------------------------------

// PRESET
/**
 * @param {{ OSC1: {tipoOnda: string, cantidadVoces: number, desfinacion: number}, OSC2: {tipoOnda: string, cantidadVoces: number, desfinacion: number} }} preset
 */

function openPreset({ OSC1, OSC2 }) {
  if (!OSC1 || !OSC2) return;
  // Seteando tipos de onda
  tipoOndaOSC1.go(OSC1.tipoOnda);
  tipoOndaOSC2.go(OSC2.tipoOnda);

  // Seteando cantidad de voces
  CANTIDAD_VOCES_1_HTML.value = OSC1.cantidadVoces;
  CANTIDAD_VOCES_2_HTML.value = OSC2.cantidadVoces;

  // Seteando desafinacion
  DESAFINACION_1_HTML.value = OSC1.desfinacion;
  DESAFINACION_2_HTML.value = OSC2.desfinacion;
}
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


  if (KEY_LAST_PRESET in localStorage){
    let lastPreset = JSON.parse(localStorage.getItem(KEY_LAST_PRESET));
    openPreset(lastPreset);
  }

}

window.addEventListener("load", openLastData);
