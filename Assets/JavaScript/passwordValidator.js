function passwordValidate(password) {
  // Mínimo 8 caracteres, al menos una letra mayúscula, una letra minúscula, un número y un carácter especial
  const expresionRegular =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return expresionRegular.test(password);
}

// Explicación de la expresión regular:

// ^: Coincide con el inicio de la cadena.
// (?=.*[a-z]): Al menos una letra minúscula.
// (?=.*[A-Z]): Al menos una letra mayúscula.
// (?=.*\d): Al menos un número.
// (?=.*[@$!%*?&]): Al menos un carácter especial entre @$!%*?&.
// [A-Za-z\d@$!%*?&]{8,}: Entre 8 y cualquier número de caracteres de la lista especificada.
// $: Coincide con el final de la cadena.
