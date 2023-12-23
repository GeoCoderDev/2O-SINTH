
const TIEMPO_MENSAJE_EXITOSO_MILISEGUNDOS = 1200;

const contenedorVentanaModal = document.getElementById(
  "cont-ventana-modal-guardar-abrir"
);
const botonGuardarAbrir = document.getElementById("boton-guardar-abrir");
const botonCerrarModal = document.getElementById("boton-cerrar-modal");
// const botonnActualizarModal = document.getElementById("boton-actualizar-modal");

delegarEvento("click", botonGuardarAbrir, () => {
  contenedorVentanaModal.style.display = "flex";
});

delegarEvento("click", botonCerrarModal, () => {
  contenedorVentanaModal.style.display = "none";
});

// delegarEvento("click",botonnActualizarModal,()=>{console.log("j")});

// =======================================================================
// |                   FORMULARIO DE GUARDADO DE DATOS                   |
// =======================================================================
const SAVE_FORM = document.forms.Save_Form;
const nombreElement = SAVE_FORM.Name;
const mensajeBajoNombre = document.getElementById("mensaje-bajo-nombre");
const tipoAlmacenamiento = SAVE_FORM.Tipo_Almacenamiento;
const tipoDeDato = SAVE_FORM.Tipo_Dato;
const submitButtonSaveForm = SAVE_FORM.Submit_Button;

delegarEvento("input", nombreElement, () => {
  mensajeBajoNombre.classList.remove("mostrar-block");
});

SAVE_FORM.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (submitButtonSaveForm.classList.contains("loading")) return;

  if (nombreElement.value.trim() === "") {
    mensajeBajoNombre.classList.add("mostrar-block");
    return (mensajeBajoNombre.innerText = "El Nombre no puede estar vacio");
  }

  submitButtonSaveForm.classList.add("loading");

  try {

    mensajeBajoNombre.classList.remove("mostrar-block");

    let datoAGuardar;

    if (tipoAlmacenamiento.value === "localstorage") {
      let prefijo;

      if (tipoDeDato.value === "preset") {
        datoAGuardar = getCurrentPreset();
        prefijo = "P";
      } else if (tipoDeDato.value === "fxs") {
        datoAGuardar = getCurrentFXs();
        prefijo = "E";
      } else if (tipoDeDato.value === "melody") {
        datoAGuardar = getCurrentMelody();
        prefijo = "M";
      } else if (tipoDeDato.value === "rhythm") {
        datoAGuardar = getCurrentRhythm();
        prefijo = "R";
      } else {
        alert("Error al guardar el Dato: Tipo de Dato Incorrecto");
      }

      const nombre = prefijo + "-" + nombreElement.value.trim();

      if (localStorage.getItem(nombre)) {
        mensajeBajoNombre.classList.add("mostrar-block");
        return (mensajeBajoNombre.innerText = "¡El nombre ya esta en uso!");
      }

      localStorage.setItem(nombre, JSON.stringify(datoAGuardar));

      await actualizarDatosApertura();
      await actualizarDatosEliminacion();

      nombreElement.value = "";

      document
        .querySelector(`#${SAVE_FORM.id} .mensaje-exito`)
        .classList.add("mostrar-block");

      setTimeout(() => {
        document
          .querySelector(`#${SAVE_FORM.id} .mensaje-exito`)
          .classList.remove("mostrar-block");
      }, TIEMPO_MENSAJE_EXITOSO_MILISEGUNDOS);

    } else if (tipoAlmacenamiento.value === "account") {
      let URL_PET = API_URL + "/api";
      let tipoDato;
      if (tipoDeDato.value === "preset") {
        URL_PET += "/presets";
        datoAGuardar = getCurrentPreset();
        tipoDato = "Preset";
      } else if (tipoDeDato.value === "fxs") {
        URL_PET += "/effects";
        datoAGuardar = getCurrentFXs();
        tipoDato = "Effect";
      } else if (tipoDeDato.value === "melody") {
        URL_PET += "/melodies";
        datoAGuardar = getCurrentMelody();
        tipoDato = "Melody";
      } else if (tipoDeDato.value === "rhythm") {
        URL_PET += "/rhythms";
        tipoDato = "Rhythm";
        datoAGuardar = getCurrentRhythm();
      } else {
        throw alert("Error al guardar el Dato: Tipo de Dato Incorrecto");
      }

      let response = await fetch(URL_PET, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("userSessionToken"),
        },
        body: JSON.stringify({
          Name: nombreElement.value.trim(),
          [tipoDato]: datoAGuardar,
        }),
      });

      if (response.status === 409) {
        mensajeBajoNombre.classList.add("mostrar-block");
        throw mensajeBajoNombre.innerText = "¡El nombre ya esta en uso!";
      }

      nombreElement.value = "";

      await actualizarDatosApertura();
      await actualizarDatosEliminacion();

      document
        .querySelector(`#${SAVE_FORM.id} .mensaje-exito`)
        .classList.add("mostrar-block");

      setTimeout(() => {
        document
          .querySelector(`#${SAVE_FORM.id} .mensaje-exito`)
          .classList.remove("mostrar-block");
      }, TIEMPO_MENSAJE_EXITOSO_MILISEGUNDOS);
    }
  } catch (err) {
    console.log(err);
  } finally {
    submitButtonSaveForm.classList.remove("loading");
  }
});

// =======================================================================
// |                  FORMULARIO DE APERTURA DE DATOS                    |
// =======================================================================

const OPEN_FORM = document.forms.Open_Form;

const tipoDeDatoOpenForm = OPEN_FORM.Tipo_Dato;
const tipoAlmacenamientoOpenForm = OPEN_FORM.Tipo_Almacenamiento;
const nombreDelDatoOpenForm = OPEN_FORM.Nombre_Dato;
const loaderNombresYValores = document.getElementById(
  "cont-nombres-valores-apertura"
);

function limpiarSelectOpenForm() {
  Array.from(nombreDelDatoOpenForm.children).forEach((option) => {
    option.remove();
  });
}

let signalAbortController;

async function actualizarDatosApertura() {
  try {
    loaderNombresYValores.classList.add("loading");
    nombreDelDatoOpenForm.disabled = true;

    limpiarSelectOpenForm();

    if (signalAbortController) signalAbortController.abort();

    if (tipoDeDatoOpenForm.value === "") throw undefined;

    if (tipoAlmacenamientoOpenForm.value === "localstorage") {
      if (tipoDeDatoOpenForm.value === "preset") {
        prefijo = "P";
      } else if (tipoDeDatoOpenForm.value === "fxs") {
        prefijo = "E";
      } else if (tipoDeDatoOpenForm.value === "melody") {
        prefijo = "M";
      } else if (tipoDeDatoOpenForm.value === "rhythm") {
        prefijo = "R";
      }

      // Utiliza entries() para obtener un iterador de pares clave-valor
      let localStorageEntries = Object.entries(localStorage);

      // Itera sobre los pares clave-valor utilizando un bucle for...of
      for (let [key, value] of localStorageEntries) {
        // Si no coincide con un formato palabra-palabra
        if (!/\b\w+-\w+\b/.test(key)) continue;
        // Realiza las operaciones que necesites con la clave y el valor
        const [keyPrefijo, Nombre] = key.split("-");

        if (keyPrefijo !== prefijo) continue;

        let optionElement = document.createElement("option");
        optionElement.innerText = Nombre;
        optionElement.value = value;

        nombreDelDatoOpenForm.appendChild(optionElement);
      }
    } else if (tipoAlmacenamientoOpenForm.value === "account") {
      signalAbortController = new AbortController();

      let URL_PET = API_URL + "/api";
      let tipoDeDato;
      if (tipoDeDatoOpenForm.value === "preset") {
        URL_PET += "/presets";
        tipoDeDato = "Preset";
      } else if (tipoDeDatoOpenForm.value === "fxs") {
        URL_PET += "/effects";
        tipoDeDato = "Effect";
      } else if (tipoDeDatoOpenForm.value === "melody") {
        URL_PET += "/melodies";
        tipoDeDato = "Melody";
      } else if (tipoDeDatoOpenForm.value === "rhythm") {
        URL_PET += "/rhythms";
        tipoDeDato = "Rhythm";
      }

      let response = await fetch(URL_PET, {
        method: "GET",
        signal: signalAbortController.signal,
        headers: {
          authorization: localStorage.getItem("userSessionToken"),
        },
      });

      if (!response.ok) throw new Error("Ocurrio un error en la peticion");
      let datos = await response.json();
      datos.forEach((dato) => {
        let optionElement = document.createElement("option");
        optionElement.innerText = dato.Name;
        optionElement.value =
          tipoDeDato === "Rhythm"
            ? dato[tipoDeDato]
            : JSON.stringify(dato[tipoDeDato]);
        nombreDelDatoOpenForm.appendChild(optionElement);
      });
    }
  } catch (err) {
    if (err) console.log(err);
  } finally {
    loaderNombresYValores.classList.remove("loading");
    nombreDelDatoOpenForm.disabled = false;
    if (nombreDelDatoOpenForm.length === 0) {
      console.log(tipoDeDatoOpenForm.value);
      let optionVacia = document.createElement("option");
      optionVacia.value = "";
      optionVacia.innerText =
        tipoDeDatoOpenForm.value === ""
          ? `-- Selecciona --`
          : `-- No hay ${
              tipoDeDatoOpenForm.options[tipoDeDatoOpenForm.selectedIndex].text
            } --`;
      nombreDelDatoOpenForm.appendChild(optionVacia);
    }
  }
}

delegarEvento("change", tipoDeDatoOpenForm, actualizarDatosApertura);
delegarEvento(
  "change",
  `#apertura-de-datos input[type="radio"]`,
  actualizarDatosApertura
);

async function abrirDatos(e) {
  e.preventDefault();

  try {
    if (tipoDeDatoOpenForm.value === "preset") {
      openPreset(JSON.parse(nombreDelDatoOpenForm.value));
    } else if (tipoDeDatoOpenForm.value === "fxs") {
      openFXs(JSON.parse(nombreDelDatoOpenForm.value));
    } else if (tipoDeDatoOpenForm.value === "melody") {
      openMelody(JSON.parse(nombreDelDatoOpenForm.value));
    } else if (tipoDeDatoOpenForm.value === "rhythm") {
      openRhythm(nombreDelDatoOpenForm.value);
    } else {
      throw alert("Tipo de Dato no válido");
    }

    document
    .querySelector(`#${OPEN_FORM.id} .mensaje-exito`)
    .classList.add("mostrar-block");

    setTimeout(() => {
      document
        .querySelector(`#${OPEN_FORM.id} .mensaje-exito`)
        .classList.remove("mostrar-block");
    }, TIEMPO_MENSAJE_EXITOSO_MILISEGUNDOS);

  } catch (err) {
    console.log(err);
  }
}

OPEN_FORM.addEventListener("submit", abrirDatos);

// =======================================================================
// |                 FORMULARIO DE ELIMINACION DE DATOS                  |
// =======================================================================

const DELETE_FORM = document.forms.Delete_Form;

const tipoDeDatoDeleteForm = DELETE_FORM.Tipo_Dato;
const tipoAlmacenamientoDeleteForm = DELETE_FORM.Tipo_Almacenamiento;
const nombreDelDatoDeleteForm = DELETE_FORM.Nombre_Dato;
const loaderNombresYValoresDeleteForm = document.getElementById(
  "cont-nombres-valores-eliminacion"
);
const submitButtonDeleteForm = DELETE_FORM.Submit_Button;

function limpiarSelectDeleteForm() {
  Array.from(nombreDelDatoDeleteForm.children).forEach((option) => {
    option.remove();
  });
}

let signalAbortControllerEliminacion;

async function actualizarDatosEliminacion() {
  try {
    loaderNombresYValoresDeleteForm.classList.add("loading");
    nombreDelDatoDeleteForm.disabled = true;

    limpiarSelectDeleteForm();

    if (signalAbortController) signalAbortController.abort();

    if (tipoDeDatoDeleteForm.value === "") return;

    if (tipoAlmacenamientoDeleteForm.value === "localstorage") {
      let prefijo;

      if (tipoDeDatoDeleteForm.value === "preset") {
        prefijo = "P";
      } else if (tipoDeDatoDeleteForm.value === "fxs") {
        prefijo = "E";
      } else if (tipoDeDatoDeleteForm.value === "melody") {
        prefijo = "M";
      } else if (tipoDeDatoDeleteForm.value === "rhythm") {
        prefijo = "R";
      } else {
        return alert("Tipo de dato invalido");
      }

      // Utiliza entries() para obtener un iterador de pares clave-valor
      let localStorageEntries = Object.entries(localStorage);

      // Itera sobre los pares clave-valor utilizando un bucle for...of
      for (let [key, value] of localStorageEntries) {
        // Si no coincide con un formato palabra-palabra
        if (!/\b\w+-\w+\b/.test(key)) continue;
        // Realiza las operaciones que necesites con la clave y el valor
        const [keyPrefijo, Nombre] = key.split("-");

        if (keyPrefijo !== prefijo) continue;

        let optionElement = document.createElement("option");
        optionElement.innerText = Nombre;
        optionElement.value = Nombre;

        nombreDelDatoDeleteForm.appendChild(optionElement);
      }
    } else if (tipoAlmacenamientoDeleteForm.value === "account") {
      signalAbortController = new AbortController();

      let URL_PET = API_URL + "/api";

      if (tipoDeDatoDeleteForm.value === "preset") {
        URL_PET += "/presets";
      } else if (tipoDeDatoDeleteForm.value === "fxs") {
        URL_PET += "/effects";
      } else if (tipoDeDatoDeleteForm.value === "melody") {
        URL_PET += "/melodies";
      } else if (tipoDeDatoDeleteForm.value === "rhythm") {
        URL_PET += "/rhythms";
      }

      let response = await fetch(URL_PET, {
        method: "GET",
        signal: signalAbortController.signal,
        headers: {
          authorization: localStorage.getItem("userSessionToken"),
        },
      });

      if (!response.ok) throw new Error("Ocurrio un error en la peticion");
      let datos = await response.json();
      datos.forEach(({ Name }) => {
        let optionElement = document.createElement("option");
        optionElement.innerText = Name;
        optionElement.value = Name;
        nombreDelDatoDeleteForm.appendChild(optionElement);
      });
    }
  } catch (err) {
    console.log(err);
  } finally {
    loaderNombresYValoresDeleteForm.classList.remove("loading");
    nombreDelDatoDeleteForm.disabled = false;
    if (nombreDelDatoDeleteForm.length === 0) {
      let optionVacia = document.createElement("option");
      optionVacia.value = "";
      optionVacia.innerText =
        tipoDeDatoDeleteForm.value === ""
          ? `-- Selecciona --`
          : `-- No hay ${
              tipoDeDatoDeleteForm.options[tipoDeDatoDeleteForm.selectedIndex]
                .text
            } --`;
      nombreDelDatoDeleteForm.appendChild(optionVacia);
    }
  }
}

delegarEvento("change", tipoDeDatoDeleteForm, actualizarDatosEliminacion);
delegarEvento(
  "change",
  `#eliminacion-de-datos input[type="radio"]`,
  actualizarDatosEliminacion
);

DELETE_FORM.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (submitButtonDeleteForm.classList.contains("loading")) return;

  submitButtonDeleteForm.classList.add("loading");

  try {
    if (tipoAlmacenamientoDeleteForm.value === "localstorage") {
      let prefijo;

      if (tipoDeDatoDeleteForm.value === "preset") {
        prefijo = "P";
      } else if (tipoDeDatoDeleteForm.value === "fxs") {
        prefijo = "E";
      } else if (tipoDeDatoDeleteForm.value === "melody") {
        prefijo = "M";
      } else if (tipoDeDatoDeleteForm.value === "rhythm") {
        prefijo = "R";
      } else {
        alert("Error al guardar el Dato: Tipo de Dato Incorrecto");
      }

      const nombre = prefijo + "-" + nombreDelDatoDeleteForm.value;

      localStorage.removeItem(nombre);

      document
        .querySelector(`#${DELETE_FORM.id} .mensaje-exito`)
        .classList.add("mostrar-block");

      setTimeout(() => {
        document
          .querySelector(`#${DELETE_FORM.id} .mensaje-exito`)
          .classList.remove("mostrar-block");
      }, TIEMPO_MENSAJE_EXITOSO_MILISEGUNDOS);

      await actualizarDatosApertura();
      await actualizarDatosEliminacion();
    } else if (tipoAlmacenamientoDeleteForm.value === "account") {
      let URL_PET = API_URL + "/api";

      let tipoDato;

      if (tipoDeDatoDeleteForm.value === "preset") {
        URL_PET += "/presets";
        tipoDato = "Preset";
      } else if (tipoDeDatoDeleteForm.value === "fxs") {
        URL_PET += "/effects";
        tipoDato = "Effect";
      } else if (tipoDeDatoDeleteForm.value === "melody") {
        URL_PET += "/melodies";
        tipoDato = "Melody";
      } else if (tipoDeDatoDeleteForm.value === "rhythm") {
        URL_PET += "/rhythms";
        tipoDato = "Rhythm";
      } else {
        throw alert("Error al guardar el Dato: Tipo de Dato Incorrecto");
      }

      let response = await fetch(
        `${URL_PET}/${nombreDelDatoDeleteForm.value}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("userSessionToken"),
          },
        }
      );

      if (!response.ok) {
        throw alert(`No se puedo eliminar el ${tipoDato}`);
      }

      document
        .querySelector(`#${DELETE_FORM.id} .mensaje-exito`)
        .classList.add("mostrar-block");

      setTimeout(() => {
        document
          .querySelector(`#${DELETE_FORM.id} .mensaje-exito`)
          .classList.remove("mostrar-block");
      }, TIEMPO_MENSAJE_EXITOSO_MILISEGUNDOS);

      await actualizarDatosApertura();
      await actualizarDatosEliminacion();
    }
  } catch (err) {
    console.log(err);
  } finally {
    submitButtonDeleteForm.classList.remove("loading");
  }
});

// =======================================================================
// |                         INICIO DE SESION?                           |
// =======================================================================

if (!Se_Inicio_Sesion) {
  document
    .querySelectorAll(`.opcion-cuenta input[type="radio"]`)
    .forEach((inputRadio) => {
      inputRadio.disabled = true;
      inputRadio.parentNode.style.color = "#aaa";
    });
  document
    .querySelectorAll(`#ventana-modal-guardar-abrir form li label span`)
    .forEach((span) => {
      span.style.display = "inline";
    });
}
