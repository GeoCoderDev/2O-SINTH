// ========================================================================
// |          FUNCIONALIDADES NECESARIAS PARA EL FORMULARIO DOBLE         |
// ========================================================================

const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");

registerLink.addEventListener("click", () => {
  wrapper.classList.add("register-mode");
});

loginLink.addEventListener("click", () => {
  wrapper.classList.remove("register-mode");
});

// =======================================================================
// |                              LOGIN                                  |
// =======================================================================

const LOGIN_FORM = document.getElementById("Login-Form");

LOGIN_FORM.addEventListener("submit", (e) => {
  e.preventDefault();


  // Obtiene la URL actual
  let urlActual = new URL(window.location.href);

  // Obtiene la URL base (eliminando la ruta y el nombre del archivo)
  let urlBase = urlActual.protocol + "//" + urlActual.host;

  // Redirige a la URL base
  window.location.href = urlBase;

});
