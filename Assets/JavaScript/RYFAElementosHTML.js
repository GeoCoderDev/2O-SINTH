// *********************************************************************
// RESTRICCIONES Y FUNCIONALIDADES ADICIONALES PARA LOS ELEMENTOS HTML *
// *********************************************************************

window.addEventListener("load", () => {
  let desactivarComportamientoClickConRodillo = (e) => {
    // Verificar si el botón del medio del mouse (scroll wheel) fue presionado
    if (e.button === 1) {
      // Prevenir el comportamiento predeterminado de la acción de hacer clic con el botón central del mouse
      e.preventDefault();
    }
  };

  // EVENTO PARA LOS INPUT NUMBERS(ESTILO FL STUDIO) a excepcion del input number Cantidad de compases, selector util => input[type="number"]:not(#Cantidad-Compases)
  document.querySelectorAll('input[type="number"]').forEach((inputNumber) => {
    // Evento para no dejar escribir
    inputNumber.addEventListener("keydown", (e) => {
      e.preventDefault();
    });

    // Evento para poder manipular el valor del input con la rueda del mouse
    inputNumber.addEventListener("wheel", (e) => {
      if (e.target == CANTIDAD_COMPASES_HTML) return; //INPUT NUMBERs EXCEPCION
      if (e.target == TEMPO) return;
      e.preventDefault();
      if (e.deltaY > 0) {
        inputNumber.stepDown();
      } else {
        inputNumber.stepUp();
      }
    });

    // Evento para poder hacer click con el rodillo del mouse y volver al valor inicial
    inputNumber.addEventListener("mousedown", (e) => {
      window.addEventListener(
        "mousedown",
        desactivarComportamientoClickConRodillo
      );
      if (e.target == CANTIDAD_COMPASES_HTML) return; //INPUT NUMBERs EXCEPCION
      if (e.target == TEMPO) return;

      if (e.button == 1) {
        inputNumber.value = inputNumber.defaultValue;
      }
    });
  });

  document.addEventListener("mouseup", () => {
    window.removeEventListener(
      "mousedown",
      desactivarComportamientoClickConRodillo
    );
  });
});

let seDesplegoMensaje = false;

function desplegarMensajeDePausa() {
  desplegarMensajeEnTodaLaPantalla(
    "Para evitar el gasto innecesario de recursos, al salir de la pagina se pauso el secuenciador de melodias.\n\n¿Desea continuar reproduciendo la melodia?",
    2,
    ["SI", "NO"],
    [
      () => {
        reproducirMelodia();

        // ACTIVA ESTOS COMENTARIOS SI QUIERES QUE CADA VEZ QUE EL USUARIO
        // SALGA DE LA PAGINA LE APAREZCA EL MENSAJE, SI QUIERES QUE SOLO APAREZCA UNA VEZ
        // NO LOS DESCOMENTES

        // seDesplegoMensaje = false;
      },
      () => {
        // seDesplegoMensaje = false;
      },
    ],
    ["blue", "red"],
    "1vw",
    true,
    "rgb(235,235,235)"
  );
}

function revisarVisibilidad() {
  if (document.visibilityState === "hidden") {
    // Si se llego a pausar la melodia entonces desplegamos mensaje de pausa automatica
    if (!estaPausado && seEstaReproduciendo) {
      pausarMelodia();
      if (!seDesplegoMensaje) {
        desplegarMensajeDePausa();
        seDesplegoMensaje = true;
      }
    }
  }
}

//Evento de Visibilidad
document.addEventListener("visibilitychange", revisarVisibilidad);

//Ejecutando la funcion para determinar el estado inicial de visibilidad
revisarVisibilidad();

// EVENTO DE DOBLE TOQUE A LA TECLA ESPACIO
// Y EVENTO DE TECLA ESPACIO PARA PAUSAR Y REPRODUCIR

let spaceKeyPressCount = 0;
let lastKeyPressTime = 0;

window.addEventListener("keyup", (e) => {
  const currentTime = new Date().getTime();

  if (e.keyCode == 32) {
    e.preventDefault();

    if (currentTime - lastKeyPressTime < 300) {
      // Cambia este valor para ajustar el límite de tiempo
      spaceKeyPressCount += 1;

      if (spaceKeyPressCount === 2) {
        pararMelodia();
        spaceKeyPressCount = 0;
      }
    } else {
      spaceKeyPressCount = 1;

      if (!seEstaReproduciendo) {
        reproducirMelodia();
      } else {
        // PAUSAR
        pausarMelodia();
      }
      eliminarEstilosDeEliminacionDelBordeDerechoDelTranportBar();
    }

    lastKeyPressTime = currentTime;
  }
});





