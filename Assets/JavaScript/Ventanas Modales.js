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

  if (nombreElement.value.trim() === "") {
    mensajeBajoNombre.classList.add("mostrar-block");
    return (mensajeBajoNombre.innerText = "El Nombre no puede estar vacio");
  }

  submitButtonSaveForm.classList.add("loading");

  try {
    let datoAGuardar;

    if (tipoAlmacenamiento.value === "localstorage") {
    
      let prefijo;

      if (tipoDeDato.value === "preset") {
        datoAGuardar = getCurrentPreset();
        prefijo = "P";
      } else if (tipoDeDato.value === "fxs") {
        datoAGuardar = getCurrentFXs();
        prefijo = "F";
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

      if(localStorage.getItem(nombre)){
        mensajeBajoNombre.classList.add("mostrar-block");
        return mensajeBajoNombre.innerText = "¡El nombre ya esta en uso!";
      }

      localStorage.setItem(
        nombre,
        JSON.stringify(datoAGuardar)
      );

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
        alert("Error al guardar el Dato: Tipo de Dato Incorrecto");
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
        mensajeBajoNombre.innerText = "¡El nombre ya esta en uso!";
      }
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

// =======================================================================
// |                 FORMULARIO DE ELIMINACION DE DATOS                  |
// =======================================================================

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
