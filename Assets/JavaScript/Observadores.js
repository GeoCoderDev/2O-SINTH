const seccion_sintetizador = document.getElementById("contenedor-sintetizador");
const seccion_efectos = document.getElementById("seccion-efectos");
const seccion_secuenciador_melodias = document.getElementById(
  "contenedor-secuenciador-melodias"
);
const seccion_secuenciador_de_ritmos = document.getElementById(
  "contenedor-secuenciador-ritmos"
);
const INDICADOR = document.getElementById("indicador");
const CANTIDAD_COMPASES_CONTENEDOR = document.getElementById(
  "cantidad-compases-contenedor"
);
const LETRAS_GUIA_CONTENEDOR = document.getElementById(
  "contenedor-letras-guia"
);
var seccion_en_vista;
let ultimaAnimacionParaCantidadCompasContenedor;
let ultimaAnimacionParaLetrasGuia;

function getUnidadVhEnPX() {
  return window.matchMedia("screen and (orientation:landscape)").matches
    ? window.innerHeight / 100
    : window.innerWidth / 100;
}

// Inicializando seccion_en_vista

if (window.scrollY >= 0 && window.scrollY < 80 * getUnidadVhEnPX()) {
  seccion_en_vista = 1;
} else if (
  window.scrollY >= 80 * getUnidadVhEnPX() &&
  window.scrollY < 72 * getUnidadVhEnPX() * 1.8
) {
  seccion_en_vista = 2;
} else if (
  window.scrollY >= 72 * getUnidadVhEnPX() * 1.8 &&
  window.scrollY < 93 * getUnidadVhEnPX() * 3
) {
  seccion_en_vista = 3;
} else {
  seccion_en_vista = 4;
}

// Para que se pueda hacer hacer click sobre el indicador

delegarEvento("mousedown", INDICADOR, () => {
  switch (seccion_en_vista) {
    case "1":
      window.scroll(0, 0);
      break;
    case "2":
      window.scroll(0, 98.8 * getUnidadVhEnPX());
      break;

    case "3":
      window.scroll(0, 98.75 * getUnidadVhEnPX() * 2);
      break;

    case "4":
      window.scroll(0, 98.7 * getUnidadVhEnPX() * 3);
      break;

    default:
      console.log("Error 40");
      break;
  }
});

const encontrando_secciones = (entradas, observador) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      seccion_en_vista = entrada.target.dataset.numero_seccion;
      INDICADOR.style.top = 32.5 + (seccion_en_vista - 1) * 12.9 + "vh";
      INDICADOR.style.marginBottom = 55 - (seccion_en_vista - 1) * 12.9 + "vh";

      console.log(seccion_en_vista);

      if (seccion_en_vista == 1) {
        if (ultimaAnimacionParaCantidadCompasContenedor) {
          if (
            ultimaAnimacionParaCantidadCompasContenedor.finalizar() === false
          ) {
            ultimaAnimacionParaLetrasGuia = new AnimacionAparicionYDesaparicion(
              LETRAS_GUIA_CONTENEDOR,
              0.5,
              "40%",
              true
            );
            ultimaAnimacionParaLetrasGuia.iniciar();
          }

          return;
        }

        ultimaAnimacionParaLetrasGuia = new AnimacionAparicionYDesaparicion(
          LETRAS_GUIA_CONTENEDOR,
          0.5,
          "40%",
          true
        );
        ultimaAnimacionParaLetrasGuia.iniciar();
      } else {
        if (ultimaAnimacionParaLetrasGuia) {
          ultimaAnimacionParaLetrasGuia.iniciar();
          ultimaAnimacionParaLetrasGuia.finished.then(() => {
            if (seccion_en_vista == 3) {
              ultimaAnimacionParaCantidadCompasContenedor =
                new AnimacionAparicionYDesaparicion(
                  CANTIDAD_COMPASES_CONTENEDOR,
                  0.5,
                  "30%",
                  true
                );
              ultimaAnimacionParaCantidadCompasContenedor.iniciar();
            }
          });
        }
      }

      if (seccion_en_vista == 3) {
        if (ultimaAnimacionParaLetrasGuia) {
          // SI YA HABIA FINALIZADO ANTES
          if (ultimaAnimacionParaLetrasGuia.finalizar() === false) {
            ultimaAnimacionParaCantidadCompasContenedor =
              new AnimacionAparicionYDesaparicion(
                CANTIDAD_COMPASES_CONTENEDOR,
                0.5,
                "30%",
                true
              );

            ultimaAnimacionParaCantidadCompasContenedor.iniciar();
          }

          return;
        }

        ultimaAnimacionParaCantidadCompasContenedor =
          new AnimacionAparicionYDesaparicion(
            CANTIDAD_COMPASES_CONTENEDOR,
            0.5,
            "30%",
            true
          );

        ultimaAnimacionParaCantidadCompasContenedor.iniciar();
      } else {
        if (ultimaAnimacionParaCantidadCompasContenedor) {
          ultimaAnimacionParaCantidadCompasContenedor.iniciar();

          ultimaAnimacionParaCantidadCompasContenedor.finished.then(() => {
            if (seccion_en_vista == 1) {
              ultimaAnimacionParaLetrasGuia =
                new AnimacionAparicionYDesaparicion(
                  LETRAS_GUIA_CONTENEDOR,
                  0.5,
                  "40%",
                  true
                );

              ultimaAnimacionParaLetrasGuia.iniciar();
            }
          });
        }
      }

      if (seccion_en_vista != 1 && seccion_en_vista != 3) {
        if (ultimaAnimacionParaLetrasGuia)
          if (ultimaAnimacionParaLetrasGuia.iniciar() === false)
            ultimaAnimacionParaLetrasGuia.finalizar(false);

        if (ultimaAnimacionParaCantidadCompasContenedor) {
          if (ultimaAnimacionParaCantidadCompasContenedor.iniciar() === false)
            ultimaAnimacionParaCantidadCompasContenedor.finalizar(false);
        }
      }
    }
  });
};

const Observador_de_Secciones = new IntersectionObserver(
  encontrando_secciones,
  {
    root: null,
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.97,
  }
);

Observador_de_Secciones.observe(seccion_sintetizador);
Observador_de_Secciones.observe(seccion_efectos);
Observador_de_Secciones.observe(seccion_secuenciador_melodias);
Observador_de_Secciones.observe(seccion_secuenciador_de_ritmos);

var iconos_de_barra_de_navegacion = document.getElementsByClassName(
  "icono-barra-navegacion"
);

function asignarEventosParaBotonesDeNavegacion() {
  // Seccion Efectos
  iconos_de_barra_de_navegacion[1].addEventListener("click", () => {
    window.scroll(0, 98.8 * getUnidadVhEnPX());
  });
  // Seccion Secuenciador de Melodias
  iconos_de_barra_de_navegacion[2].addEventListener("click", () => {
    window.scroll(0, 98.75 * getUnidadVhEnPX() * 2);
  });
  // Seccion Secuenciador de Ritmos
  iconos_de_barra_de_navegacion[3].addEventListener("click", () => {
    window.scroll(0, 98.7 * getUnidadVhEnPX() * 3);
  });
}

window.addEventListener("load", asignarEventosParaBotonesDeNavegacion);
window.addEventListener("resize", asignarEventosParaBotonesDeNavegacion);
