// ---------------------------------------------------------------
// |                   FUNCIONES DE OBTENCION                    |
// ---------------------------------------------------------------

// PRESET
function getCurrentPreset() {
  const OSC1 = {
    tipoOnda: tipoOndaOSC1.obtenerValor(),
    cantidadVoces: CANTIDAD_VOCES_1_HTML.value,
    desfinacion: DESAFINACION_1_HTML.value,
  };

  const OSC2 = {
    tipoOnda: tipoOndaOSC2.obtenerValor(),
    cantidadVoces: CANTIDAD_VOCES_2_HTML.value,
    desfinacion: DESAFINACION_2_HTML.value,
  };

  return { OSC1, OSC2 };
}

// FXs

function getCurrentFXs() {
  return {
    amplificador: {
      A: getADSRvalues("A"),
      D: getADSRvalues("D"),
      S: getADSRvalues("S"),
      R: getADSRvalues("R"),
    },
    lfo: {
      tipoOnda: tipoOndaLFO.obtenerValor(),
      controlLFO: CONTROL_A_CONTROLAR_LFO.value,
      knobValues: LFOKnobsValues.value,
    },
    filtro: {
      tipoFiltro: tipoDeFiltro.obtenerValor(),
      knobValues: FiltroKnobsValues.value,
    },
    distorsion: barrasDistorsion.value,
    reverberacion: knobsReverb.value,
    eco: knobsEco.value,
    pan: panSintetizador.value,
    volumenMaster: VOLUMEN_SLIDER_MASTER.value,
  };
}

// MELODIAS
function getCurrentMelody() {
  if (NOTAS_SECUENCIADOR_DE_MELODIAS.length === 0) return [];
  return NOTAS_SECUENCIADOR_DE_MELODIAS.map((notaSecuenciadorMelodias) => {
    return notaSecuenciadorMelodias.getDataNote();
  });
}

function getCurrentRhythm() {
  if (document.querySelectorAll(".Semicorchea-Ritmo-Activa").length === 0)
    return "";
  return Array.from(Todos_los_cuadros_semicorchea_ritmos)
    .map((cuadroSemicorcheaRitmo) => {
      return cuadroSemicorcheaRitmo.classList.contains(
        "Semicorchea-Ritmo-Activa"
      )
        ? 1
        : 0;
    })
    .join("");
}

// ---------------------------------------------------------------
// |                   LOCAL STORAGE(DEFAULT)                    |
// ---------------------------------------------------------------
const KEY_LAST_PRESET = "lastPreset";
const KEY_LAST_FXs = "lastFXs";
const KEY_LAST_MELODY = "lastMelody";
const KEY_LAST_RHYTHM = "lastRhythm";

// Guardando Preset + Eventos
function setPresetInLocalStorage() {
  const CURRENT_PRESET = getCurrentPreset();
  localStorage.setItem(KEY_LAST_PRESET, JSON.stringify(CURRENT_PRESET));
}

delegarEvento(
  "change",
  "#Cont-tipos-onda-OSC1, #Cont-tipos-onda-OSC2,#Cantidad_voces_osc_1, #Cantidad_voces_osc_2, #Cantidad_desafinacion_osc_1, #Cantidad_desafinacion_osc_2",
  setPresetInLocalStorage
);

// Guardando FXs + Eventos
function setFXsInLocalStorage() {
  const CURRENT_Fxs = getCurrentFXs();
  localStorage.setItem(KEY_LAST_FXs, JSON.stringify(CURRENT_Fxs));
}

delegarEvento(
  "change",
  `#seccion-efectos .${CLASE_CONTENEDOR_KNOBS}, #seccion-efectos .${CLASE_CONTENEDOR_BARRAS}, #seccion-efectos .${CLASE_CONTENEDOR_SLIDER_IMAGENES}, input[type="range"]`,
  setFXsInLocalStorage
);

// Guardando Melodia + Eventos
function setMelodyInLocalStorage() {
  const CURRENT_MELODY = {
    melody: getCurrentMelody(),
    compasesUsados: CANTIDAD_COMPASES_HTML.value,
  };
  localStorage.setItem("lastMelody", JSON.stringify(CURRENT_MELODY));
}

delegarEvento(
  "mousemove",
  `.Cuadro-Semicorchea, .${Nombre_Clase_para_las_notas}`,
  setMelodyInLocalStorage
);
delegarEvento(
  "mouseup",
  `.Cuadro-Semicorchea, .${Nombre_Clase_para_las_notas}`,
  setMelodyInLocalStorage
);

// Guardando ritmo + Eventos
function setRhythmInLocalStorage() {
  const CURRENT_RHYTHM = { rhythm: getCurrentRhythm() };
  localStorage.setItem(KEY_LAST_RHYTHM, JSON.stringify(CURRENT_RHYTHM));
}

delegarEvento("mousemove", `.Semicorchea-Ritmo`, setRhythmInLocalStorage);
delegarEvento("mouseup", ".Semicorchea-Ritmo", setRhythmInLocalStorage);
