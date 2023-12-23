// =======================================================================
// |                                                      |
// =======================================================================

// =======================================================================
// |                              LOGIN                                  |
// =======================================================================

const ERRORES = {
  incorrectNameOrPasswordOrEmail: "Username, password or emai incorrect",
  invalidPassword: "Invalid Password",
};

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

const LOGIN_FORM = document.forms.Login_Form;
const usernameOrEmailElement = LOGIN_FORM.Username_Or_Email;
const passwordElement = LOGIN_FORM.passwordLogin;
const credentialsIncorrectMessageElement = document.getElementById(
  "mensaje-credenciales-incorrectas"
);

usernameOrEmailElement.addEventListener("input", () => {
  credentialsIncorrectMessageElement.classList.remove("mostrar-block");
});

passwordElement.addEventListener("input", () => {
  credentialsIncorrectMessageElement.classList.remove("mostrar-block");
});

LOGIN_FORM.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (LOGIN_FORM.submit.classList.contains("loading")) return;

  LOGIN_FORM.submit.classList.add("loading");


  
  const usernameOrEmail = LOGIN_FORM.Username_Or_Email.value.trim();
  const password = LOGIN_FORM.passwordLogin.value;

  try {
    const datosUsuario = {
      [isEmail(usernameOrEmail) ? "Email" : "Name"]: usernameOrEmail,
      Password: password,
    };

    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(datosUsuario),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (loginResponse.status === 401) {
      throw new Error(ERRORES.incorrectNameOrPasswordOrEmail);
    } else if (!loginResponse.ok) {
      throw new Error("Error en la solicitud: " + loginResponse.statusText);
    }

    const { token } = await loginResponse.json();

    localStorage.setItem("userSessionToken", token);

    const meResponse = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        authorization: token,
      },
    });

    const userData = await meResponse.json();

    localStorage.setItem("authenticatedUserData", JSON.stringify(userData));

    // Eliminando valores ingresados
    usernameOrEmailElement.value = "";
    passwordElement.value = "";

    // Redirigiendo a 2O-SINTH
    const urlActual = new URL(window.location.href);
    window.location.href = `${urlActual.protocol}//${urlActual.host}/2O-SINTH`;
  } catch (err) {
    if (err.message === ERRORES.incorrectNameOrPasswordOrEmail)
      return credentialsIncorrectMessageElement.classList.toggle(
        "mostrar-block"
      );
    console.error(err);
  } finally {
    LOGIN_FORM.submit.classList.remove("loading");
  }
});

// =======================================================================
// |                            REGISTER                                 |
// =======================================================================

const REGISTER_FORM = document.forms.Register_Form;
const registerButton = REGISTER_FORM.submit;
const usernameElement = document.getElementById("Username");
const emailElement = document.getElementById("Email");



const NameLabel = document.querySelector(`label[for="Username"]`);
const EmailLabel = document.querySelector(`label[for="Email"]`);

const passwordMessage = document.getElementById("mensaje-contraseña");

const passwordRegisterElement = document.getElementById("passwordRegister");

passwordRegisterElement.addEventListener("input",()=>{
  
  if(passwordRegisterElement.value.trim()==="") return passwordMessage.style.display = "none";

  passwordMessage.style.display = "block";

  let result = passwordValidate(passwordRegisterElement.value);
  
  if(result === true){
    passwordMessage.classList.remove("invalid");
    passwordMessage.classList.add("valid");
    passwordMessage.innerText = "La cotraseña es valida, asegurate de recordarla";
  }else{
    passwordMessage.classList.remove("valid");
    passwordMessage.classList.add("invalid");
    passwordMessage.innerText = result;
  };

})

emailElement.addEventListener("blur",()=>{
  if(emailElement.value.trim()!==""){
    EmailLabel.classList.add("elevar");
  }else{
    EmailLabel.classList.remove("elevar");
  }
})

usernameElement.addEventListener("input",()=>{
  if(!NameLabel.classList.contains("enUso")) return;
  NameLabel.classList.remove("enUso");
  NameLabel.innerText = "Nombre de Usuario";
})

emailElement.addEventListener("input",()=>{
  if(!EmailLabel.classList.contains("enUso")) return;
  EmailLabel.classList.remove("enUso");
  EmailLabel.innerText = "Correo";
})

REGISTER_FORM.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (registerButton.classList.contains("loading")) return;
  
  if(REGISTER_FORM.Username.value.trim()===""){
    NameLabel.classList.add("enUso");
    return NameLabel.innerText = "Nombre de Usuario(No puede estar vacio)";
  }

  const Name = REGISTER_FORM.Username.value.trim();
  const Email = REGISTER_FORM.Email.value;
  const Password = REGISTER_FORM.password.value;

  registerButton.classList.add("loading");

  try {    
    const newUserData = { Name, Email, Password };
  
    const registerResponse = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(newUserData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    // CONFLICTO
    if (registerResponse.status === 409) {
      const responseError = await registerResponse.text();
      if(responseError==="NAME"){
        NameLabel.classList.add("enUso");
        return NameLabel.innerText = "Nombre de Usuario(Ya esta en uso)";
      }
      
      if(responseError==="EMAIL"){
        EmailLabel.classList.add("enUso");
        return EmailLabel.innerText = "Correo(Ya esta en uso)"
      }
    }
    
    EmailLabel.value = "";
    NameLabel.value = "";
    passwordElement.value = "";

    window.location.reload();

  } catch (error) {
    console.error(error);
  }finally{
    registerButton.classList.remove("loading");
  }

});

