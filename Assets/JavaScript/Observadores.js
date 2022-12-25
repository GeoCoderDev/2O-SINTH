const seccion_sintetizador = document.getElementById('contenedor-sintetizador');
const seccion_efectos = document.getElementById('contenedor-efectos'); 
const seccion_secuenciador_melodias = document.getElementById('contenedor-secuenciador-melodias');
const seccion_secuenciador_de_ritmos = document.getElementById('contenedor-secuenciador-ritmos');
var seccion_en_vista;



const encontrando_secciones = (entradas, observador) => {
    
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting){
            seccion_en_vista = entrada.target.dataset.numero_seccion;
            var indicador = document.getElementById('indicador');
            indicador.style.top = (32.5 + ((seccion_en_vista-1)*12.9)) + "vh";
            indicador.style.marginBottom = (55 - ((seccion_en_vista-1)*12.9)) + "vh";
        }
    });    
};



const Observador_de_Secciones = new IntersectionObserver(encontrando_secciones,{
    root: null,
    rootMargin: '0px 0px 0px 0px',
    threshold: 1.0    
});

Observador_de_Secciones.observe(seccion_sintetizador);
Observador_de_Secciones.observe(seccion_efectos);
Observador_de_Secciones.observe(seccion_secuenciador_melodias);
Observador_de_Secciones.observe(seccion_secuenciador_de_ritmos);


var iconos_de_barra_de_navegacion = document.getElementsByClassName('icono-barra-navegacion');


// alert(seccion_efectos.getBoundingClientRect().bottom);

// iconos_de_barra_de_navegacion[1].addEventListener('click',()=>{
//     window.scroll(0,seccion_efectos.getBoundingClientRect().top)
// });

var g6 = document.getElementById('C6');
g6.innerText = screen.height;