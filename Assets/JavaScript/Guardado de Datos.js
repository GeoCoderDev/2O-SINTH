// ---------------------------------------------------------------
// |                   FUNCIONES DE OBTENCION                    |
// ---------------------------------------------------------------

// MELODIAS
function getCurrentMelody() {
  if(NOTAS_SECUENCIADOR_DE_MELODIAS.length===0) return [];
  return NOTAS_SECUENCIADOR_DE_MELODIAS.map((notaSecuenciadorMelodias) => {
    return notaSecuenciadorMelodias.getDataNote();
  });
}

function getCurrentRhythm() {
  return Array.from(Todos_los_cuadros_semicorchea_ritmos).map(
    (cuadroSemicorcheaRitmo) => {
      return cuadroSemicorcheaRitmo.classList.contains(
        "Semicorchea-Ritmo-Activa"
      )
        ? 1
        : 0;
    }
  ).join("");
}

function getCurrentPreset() {}

// ---------------------------------------------------------------
// |                   LOCAL STORAGE(DEFAULT)                    |
// ---------------------------------------------------------------
const KEY_LAST_PRESET = "lastPreset";
const KEY_LAST_MELODY = "lastMelody";
const KEY_LAST_RHYTHM = "lastRhythm";

// Guardando Melodia + Eventos
function setMelodyInLocalStorage() {
  const CURRENT_MELODY = { melody: getCurrentMelody() };
  localStorage.setItem("lastMelody", JSON.stringify(CURRENT_MELODY));
}

delegarEvento("mousemove", `.Cuadro-Semicorchea, .${Nombre_Clase_para_las_notas}`, setMelodyInLocalStorage);
delegarEvento("mouseup", `.Cuadro-Semicorchea, .${Nombre_Clase_para_las_notas}`, setMelodyInLocalStorage);


// Guardando ritmo + Eventos
function setRhythmInLocalStorage() {
    const CURRENT_RHYTHM = { rhythm: getCurrentRhythm() };
    localStorage.setItem(KEY_LAST_RHYTHM, JSON.stringify(CURRENT_RHYTHM));
}

delegarEvento("mousemove", `.Semicorchea-Ritmo`, setRhythmInLocalStorage);
delegarEvento("mouseup", ".Semicorchea-Ritmo", setRhythmInLocalStorage);