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

//FXs
/**
 *
 * @param {{amplificador: {A: number, D: number, S: number, R: number}, lfo: { tipoOnda: string, controlLFO: string, knobValues: number[] }, filtro: { tipoFiltro: string, knobValues: number[] }, distorsion: number[], reverberacion: number[], eco: number[], pan: number[], volumenMaster: number}} fx
 */
function openFXs({
  amplificador,
  lfo,
  filtro,
  distorsion,
  reverberacion,
  eco,
  pan,
  volumenMaster,
}) {
  // Seteando valores del amplificador
  ataqueSlider.value = amplificador.A;
  decaySlider.value = amplificador.D;
  sustainSlider.value = amplificador.S;
  releaseSlider.value = amplificador.R;

  //Seteando valores del LFO
  tipoOndaLFO.go(lfo.tipoOnda);
  CONTROL_A_CONTROLAR_LFO.value = lfo.controlLFO;
  LFOKnobsValues.setValues(lfo.knobValues);

  //Seteando valores del Filtro
  tipoDeFiltro.go(filtro.tipoFiltro);
  FiltroKnobsValues.setValues(filtro.knobValues);

  //Seteando valores de la distorsion
  barrasDistorsion.setValues(distorsion);

  //Seteando valor de la reverberacion
  knobsReverb.setValues(reverberacion);

  //Setenado valores del eco
  knobsEco.setValues(eco);

  //Seteando valor del pan
  panSintetizador.setValues(pan);

  //Seteando valor del volumen master
  VOLUMEN_SLIDER_MASTER.value = volumenMaster;
}

// MELODIA
/**
 *
 * @param {{melody: object[], compasesUsados: number, tempo: number}} melodyData
 */
function openMelody({ melody, compasesUsados, tempo }) {

  setCantidadCompasesEnSecuenciadorMelodias(parseInt(compasesUsados));
  
  TEMPO.value = (tempo==="")? TEMPO_AL_CARGAR_LA_PAGINA: tempo;
  TEMPO.dispatchEvent(new Event("change"));

  melody.forEach(
    (dataNote) => new NotaSecuenciadorDeMelodias(dataNote)
  );

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

  if (KEY_LAST_PRESET in localStorage) {
    let lastPreset = JSON.parse(localStorage.getItem(KEY_LAST_PRESET));
    openPreset(lastPreset);
  }

  // OPENING THE FXs
  if (KEY_LAST_FXs in localStorage) {
    let lastFXs = JSON.parse(localStorage.getItem(KEY_LAST_FXs));
    openFXs(lastFXs);
  }

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

document.addEventListener("DOMContentLoaded", openLastData);
