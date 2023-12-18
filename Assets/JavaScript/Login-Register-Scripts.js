
// ========================================================================
// |          FUNCIONALIDADES NECESARIAS PARA EL FORMULARIO DOBLE         |
// ========================================================================

const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link")
const registerLink = document.querySelector(".register-link");

registerLink.addEventListener("click",()=>{
    wrapper.classList.add("register-mode");
})

loginLink.addEventListener("click",()=>{
    wrapper.classList.remove("register-mode");
})


// =======================================================================
// |                              LOGIN                                  |
// =======================================================================

const LOGIN_FORM = document.getElementById("Login-Form");

LOGIN_FORM.addEventListener("submit", (e)=>{
    
    e.preventDefault();

    // Redirigiendo a 2O-SINTH
    let urlActual = new URL(window.location.href);

    window.location.href = `${urlActual.protocol}://${urlActual.host}/2O-SINTH`;

})

