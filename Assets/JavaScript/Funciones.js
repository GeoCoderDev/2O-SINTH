var medidasRelativas = [];
medidasRelativas[0] = window.innerWidth;
medidasRelativas[1] = window.innerHeight;

function actualizarMedidadRelativas() {
  medidasRelativas[0] = window.innerWidth;
  medidasRelativas[1] = window.innerHeight;
}

window.addEventListener("resize", actualizarMedidadRelativas);

/**
 *
 * @param {*} pixeles cantidad en pixeles
 * @param {'vw'|'vh'} medida medida relativa vw o vh
 * @returns devuelve la cantidad de pixeles ingresadas en vw o vh
 */
function pixelsToVWVH(pixeles, medida) {
  if (medida == "vw") {
    return [(pixeles * 100) / medidasRelativas[0]];
  } else {
    return [(pixeles * 100) / medidasRelativas[1]];
  }
}

/**
 *
 * @param {*} medida medida relativa vw o vh
 * @param {*} cantidad
 * @returns devuelve la cantidad de pixeles ingresadas en vw o vh
 */
function VWVHTopixels(medida, cantidad) {
  if (medida == "vw") {
    return [(cantidad * medidasRelativas[0]) / 100];
  } else {
    return [(cantidad * medidasRelativas[1]) / 100];
  }
}

function insertarReglasCSSAdicionales(reglasCSS) {
  let elementoStyle = document.createElement("style");
  elementoStyle.innerHTML = reglasCSS;
  document.head.appendChild(elementoStyle);
  return elementoStyle;
}

function eliminarReglasCSSAdicionales(elementoStyle) {
  document.head.removeChild(elementoStyle);
}

function distanciaRelativaEntreElementos(ancestroHTML, descendienteHTML) {
  let distanciaHorizontalPX = 0,
    distanciaVerticalPX = 0;

  let iteradorArbolHTML = descendienteHTML;

  while (iteradorArbolHTML && iteradorArbolHTML != ancestroHTML) {
    distanciaHorizontalPX += iteradorArbolHTML.offsetLeft;
    distanciaVerticalPX += iteradorArbolHTML.offsetTop;
    iteradorArbolHTML = iteradorArbolHTML.offsetParent;
  }

  return { distanciaHorizontalPX, distanciaVerticalPX };
}

function makeResizableByRight(
  elementoHTML,
  nombreClaseNueva,
  PIXELES_DE_SENSIBILIDAD,
  posicionamientoDelElemento = "absolute"
) {
  insertarReglasCSSAdicionales(`

        .${nombreClaseNueva}::after {
            content: "";
            position: absolute;
            top: 0;
            right: -${pixelsToVWVH(PIXELES_DE_SENSIBILIDAD, "vw")}vw;
            bottom: 0;
            width: ${pixelsToVWVH(PIXELES_DE_SENSIBILIDAD, "vw")}vw; 
            cursor: ew-resize;
        }

    `);

  const resizableDiv = elementoHTML;
  resizableDiv.classList.add(nombreClaseNueva);
  let isResizing = false;
  let lastX = 0;
  let originalWidth = 0;

  resizableDiv.style.position = posicionamientoDelElemento; // Asegurarse de que el elemento tenga posición relativa o absoluta

  resizableDiv.addEventListener("mousedown", (e) => {
    if (e.offsetX >= resizableDiv.offsetWidth - PIXELES_DE_SENSIBILIDAD) {
      // Solo en el borde derecho
      isResizing = true;
      lastX = e.clientX;
      originalWidth = resizableDiv.offsetWidth;
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;

    const deltaX = e.clientX - lastX;
    const newWidth = originalWidth + deltaX; // Cambiamos aquí para que el elemento se redimensione hacia la derecha
    resizableDiv.style.width = `${Math.max(newWidth, 0)}px`;
  });

  document.addEventListener("mouseup", () => {
    isResizing = false;
  });
}

function roundToDecimals(number, decimals) {
  const factor = 10 ** decimals;
  return Math.round(number * factor) / factor;
}

/**
 *
 * @param {String} mensaje
 * @param {Number} cantidadDeBotones
 * @param {string[]} textosBotones
 * @param {Function} callbacks
 * @param {string[]} coloresBotones
 * @param {String} bordeRedondeadoCaja
 * @param {boolean} cajaConSombraInset
 * @param {string} colorCajaMensaje
 * @param {string} tamañoLetra
 * @param {string} colorFondoRGBA
 * @param {string} colorLetra
 */

function desplegarMensajeEnTodaLaPantalla(
  mensaje,
  cantidadDeBotones,
  textosBotones,
  callbacks,
  coloresBotones,
  bordeRedondeadoCaja,
  cajaConSombraInset = false,
  colorCajaMensaje = "white",
  tamañoLetra = "0.9vw",
  colorFondoRGBA = "rgba(67, 67, 67,0.7)",
  colorLetra = "black"
) {
  let MensajeContenedor = document.createElement("div");
  MensajeContenedor.style.position = "fixed";
  MensajeContenedor.style.top = 0;
  MensajeContenedor.style.left = 0;
  MensajeContenedor.style.width = "100%";
  MensajeContenedor.style.height = "100vh";
  MensajeContenedor.style.backgroundColor = colorFondoRGBA;
  MensajeContenedor.style.display = "flex";
  MensajeContenedor.style.alignItems = "center";
  MensajeContenedor.style.justifyContent = "center";
  MensajeContenedor.style.zIndex = 101;

  let CajaDeMensaje = document.createElement("div");
  CajaDeMensaje.style.width = "30%";
  CajaDeMensaje.style.height = "30%";
  CajaDeMensaje.style.backgroundColor = colorCajaMensaje;
  CajaDeMensaje.style.display = "flex";
  CajaDeMensaje.style.flexDirection = "column";
  CajaDeMensaje.style.alignItems = "center";
  CajaDeMensaje.style.justifyContent = "center";
  CajaDeMensaje.style.padding = "0 2vw";
  if (bordeRedondeadoCaja)
    CajaDeMensaje.style.borderRadius = bordeRedondeadoCaja;
  if (cajaConSombraInset)
    CajaDeMensaje.style.boxShadow =
      "0 0 0.7vw 0.3vw inset rgba(20, 20, 20, 0.408)";

  let ContenedorDelMensaje = document.createElement("div");
  ContenedorDelMensaje.style.width = "100%";
  // ContenedorDelMensaje.style.height = "60%";
  ContenedorDelMensaje.style.fontFamily = "Verdana";
  ContenedorDelMensaje.style.fontStyle = "italic";
  ContenedorDelMensaje.style.fontSize = tamañoLetra;
  ContenedorDelMensaje.style.textAlign = "left";
  ContenedorDelMensaje.style.color = colorLetra;
  ContenedorDelMensaje.innerText = mensaje;
  ContenedorDelMensaje.style.margin = "1vw 0 1.5vw 0";

  let ContenedorDeBotones = document.createElement("div");
  ContenedorDeBotones.style.width = "100%";
  ContenedorDeBotones.style.height = "20%";
  ContenedorDeBotones.style.display = "flex";
  ContenedorDeBotones.style.alignItems = "center";
  ContenedorDeBotones.style.justifyContent = "space-evenly";
  let eventosClick = [];

  for (let i = 0; i < cantidadDeBotones; i++) {
    let boton = document.createElement("div");
    boton.innerText = textosBotones[i];
    boton.style.fontFamily = "Verdana";
    boton.style.fontSize = tamañoLetra;
    boton.style.fontStyle = "italic";
    boton.style.margin = "0 1vw";
    boton.style.cursor = "pointer";
    boton.style.height = "100%";
    boton.style.display = "flex";
    boton.style.flexDirection = "column";
    boton.style.alignItems = "center";
    boton.style.justifyContent = "center";

    boton.style.color = coloresBotones[i] ? coloresBotones[i] : "black";

    eventosClick[i] = delegarEvento("click", boton, () => {
      CONTENEDOR_TODO.removeChild(MensajeContenedor);
      eliminarEventoDelegado("click", eventosClick[i]);
      if (callbacks[i]) callbacks[i]();
    });

    ContenedorDeBotones.appendChild(boton);
  }

  CajaDeMensaje.appendChild(ContenedorDelMensaje);
  CajaDeMensaje.appendChild(ContenedorDeBotones);
  MensajeContenedor.appendChild(CajaDeMensaje);

  CONTENEDOR_TODO.insertAdjacentElement("beforeend", MensajeContenedor);
}

/**
 * 
 * @param {String} tipoDeCursor 
 * @returns 
 */
function cambiarCursorParaTodaLaPagina(tipoDeCursor = "pointer") {
  let volverAlCursorOriginal;

  let reglasDeCursor = insertarReglasCSSAdicionales(`
    
        *{
            cursor: ${tipoDeCursor} !important;
        }

    `);

  let promesa = new Promise((resolve, reject) => {
    volverAlCursorOriginal = resolve;
  });

  promesa.then((value) => {
    eliminarReglasCSSAdicionales(reglasDeCursor);
  });

  return { volverAlCursorOriginal };
}

/**
 *
 * @param {Number} n
 * @param {any} devolucion en este parametro debes ingresar el valor que quieres que se devuelva en caso si se trate de un -1
 * @returns {any | Number} retorna la devolucion que especifiques en el segundo parametro
 */
function esUnUnoNegativo(n, devolucion) {
  if (n == -1) return (devolucion===undefined)? undefined: devolucion;
  return n;
}

/**
 *
 * @param {Number} n
 * @returns devuelve true si el numero ingresado es cero, de lo contrario devuelve el mismo valor que se ingreso
 */
function esCero(n) {
  if (n == 0) return true;
  return n;
}

// AÑADIENDO UN METODO AL PROTOTIPO ARRAY

/**
 * Esta funcion elimina un valor especificado del array
 * @param {any} value
 * @returns {Boolean} devuelve true si se logro eliminar el elemento y false si no se elimino, lo que quiere decir que no existia dentro del array
 */
Array.prototype.remove = function (value) {
  let indiceValue = this.indexOf(value);

  if (indiceValue == -1) return false;

  this.splice(this.indexOf(value), 1);

  return true;
};




