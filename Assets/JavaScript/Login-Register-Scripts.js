// =======================================================================
// |                              LOGIN                                  |
// =======================================================================

const ERRORES = {
  incorrectNameOrPassword: "Username or password incorrect",
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

const LOGIN_FORM = document.getElementById("Login-Form");

LOGIN_FORM.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usernameOrEmail = LOGIN_FORM.Username_Or_Email.value;
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
      throw new Error(ERRORES.incorrectNameOrPassword);
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

    // Redirigiendo a 2O-SINTH
    const urlActual = new URL(window.location.href);
    window.location.href = `${urlActual.protocol}//${urlActual.host}/2O-SINTH`;
  } catch (err) {
    if (err.message === ERRORES.incorrectNameOrPassword) return console.error("INCORRECT");
    console.error(err);
  }
});
