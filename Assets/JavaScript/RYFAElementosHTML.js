// *********************************************************************
// RESTRICCIONES Y FUNCIONALIDADES ADICIONALES PARA LOS ELEMENTOS HTML * 
// *********************************************************************

window.addEventListener('load',()=>{

    let desactivarComportamientoClickConRodillo = (e)=>{
        // Verificar si el botón del medio del mouse (scroll wheel) fue presionado
        if (e.button === 1) {
            // Prevenir el comportamiento predeterminado de la acción de hacer clic con el botón central del mouse
            e.preventDefault();
        }
    }

    // EVENTO PARA LOS INPUT NUMBERS(ESTILO FL STUDIO)
    document.querySelectorAll('input[type="number"]').forEach((inputNumber)=>{

        // Evento para no dejar escribir 
        inputNumber.addEventListener('keydown', (e) => {
            e.preventDefault();
        });

        // Evento para poder manipular el valor del input con la rueda del mouse
        inputNumber.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY > 0) {
              inputNumber.stepDown();
            } else {
              inputNumber.stepUp();
            }
        });

        // Evento para poder hacer click con el rodillo del mouse y volver al valor inicial
        inputNumber.addEventListener('mousedown',(e)=>{
            window.addEventListener('mousedown', desactivarComportamientoClickConRodillo);
            if(e.button==1){
                inputNumber.value = inputNumber.defaultValue;
            }
        })

    })

    document.addEventListener('mouseup',()=>{
        window.removeEventListener('mousedown', desactivarComportamientoClickConRodillo);
    })

});


function desplegarMensajeDePausa(){
    
    desplegarMensajeEnTodaLaPantalla(
        "Para evitar el gasto innecesario de recursos, al salir de la pagina se pauso el secuenciador de melodias.\n\n¿Desea continuar reproduciendo la melodia?",
        2,
        ["SI","NO"],
        [
            ()=>{
                reproducirMelodia();
            },
            undefined
        ],
        ["blue","red"],
        "1vw",
        true,
        "rgb(235,235,235)"
    )
}


function revisarVisibilidad() {
    if (document.visibilityState === 'hidden') {      
        // Si se llego a pausar la melodia entonces desplegamos mensaje de pausa automatica
        if(!estaPausado){
            pausarMelodia();
            desplegarMensajeDePausa();
        }
    }
  }
  
//Evento de Visibilidad
document.addEventListener('visibilitychange', revisarVisibilidad);
  
//Ejecutando la funcion para determinar el estado inicial de visibilidad
revisarVisibilidad();