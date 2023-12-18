function isEmail(text){
    // Expresión regular para validar una dirección de correo electrónico
    const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Retorna true si el texto cumple con el formato de correo electrónico, de lo contrario, retorna false
    return expresionRegular.test(text);
}

