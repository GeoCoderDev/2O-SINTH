const slider_oscilador_1 = document.querySelector("#slider_de_imagenes_ondas_1");
let imagenes_slider_oscilador_1 = document.querySelectorAll("#slider_de_imagenes_ondas_1 .imagen_slider");
let ultima_imagen_slider_osc_1 = imagenes_slider_oscilador_1[imagenes_slider_oscilador_1.length-1];

const boton_izquierdo_1 = document.getElementById("boton_slider_izquierda_1");
const boton_derecho_1 = document.getElementById("boton_slider_derecha_1");

slider_oscilador_1.insertAdjacentElement('afterbegin',ultima_imagen_slider_osc_1);
 
function Siguiente_onda_Osc_1(){

    let primera_imagen_slider_osc_1_temp = document.querySelectorAll("#slider_de_imagenes_ondas_1 .imagen_slider")[0];
    slider_oscilador_1.style.marginLeft = "-200%";
    slider_oscilador_1.style.transition = " all 0.4s";

    setTimeout(function(){
        slider_oscilador_1.style.transition = "none";
        slider_oscilador_1.insertAdjacentElement('beforeend',primera_imagen_slider_osc_1_temp);
        slider_oscilador_1.style.marginLeft = "-100%";
    },400)

}

function Anterior_Onda_Osc_1(){
    let ultima_imagen_slider_osc_1_temp = 
    document.querySelectorAll("#slider_de_imagenes_ondas_1 .imagen_slider")[document.querySelectorAll("#slider_de_imagenes_ondas_1 .imagen_slider").length-1];
    slider_oscilador_1.style.marginLeft = "0";
    slider_oscilador_1.style.transition = " all 0.4s";

    setTimeout(function(){
        slider_oscilador_1.style.transition = "none";
        slider_oscilador_1.insertAdjacentElement('afterbegin',ultima_imagen_slider_osc_1_temp);
        slider_oscilador_1.style.marginLeft = "-100%";
    },400)
}

boton_izquierdo_1.addEventListener('click',Anterior_Onda_Osc_1);
boton_derecho_1.addEventListener('click',Siguiente_onda_Osc_1);

