
// Explicación de la expresión regular:

// ^: Coincide con el inicio de la cadena.
// (?=.*[a-z]): Al menos una letra minúscula.
// (?=.*[A-Z]): Al menos una letra mayúscula.
// (?=.*\d): Al menos un número.
// (?=.*[@$!%*?&]): Al menos un carácter especial entre @$!%*?&.
// [A-Za-z\d@$!%*?&]{8,}: Entre 8 y cualquier número de caracteres de la lista especificada.
// $: Coincide con el final de la cadena.

function passwordValidate(password) {
  // Mínimo 8 caracteres, al menos una letra mayúscula, una letra minúscula, un número y un carácter especial
  const expresionRegular =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }

  if (!expresionRegular.test(password)) {
    let errores = [];
    if (!/(?=.*[a-z])/.test(password)) {
      errores.push("una letra minúscula");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errores.push("una letra mayúscula");
    }
    if (!/(?=.*\d)/.test(password)) {
      errores.push("un número");
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errores.push("un carácter especial (@$!%*?&)");
    }

    return `La contraseña debe contener almenos: ${errores.join(", ")}.`;
  }

  return true;
}

