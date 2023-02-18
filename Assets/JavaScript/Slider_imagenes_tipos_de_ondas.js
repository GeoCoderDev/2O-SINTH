// =================================================================================================================
// PRIMER SLIDER DE IMAGENES DE ONDAS  (TIPO DE ONDA OSC 1)
// =================================================================================================================
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


// =================================================================================================================
// SEGUNDO SLIDER DE IMAGENES DE ONDAS (TIPO DE ONDA OSC 2)
// =================================================================================================================
const slider_oscilador_2 = document.querySelector("#slider_de_imagenes_ondas_2");
let imagenes_slider_oscilador_2 = document.querySelectorAll("#slider_de_imagenes_ondas_2 .imagen_slider");
let ultima_imagen_slider_osc_2 = imagenes_slider_oscilador_2[imagenes_slider_oscilador_2.length-1];

const boton_izquierdo_2 = document.getElementById("boton_slider_izquierda_2");
const boton_derecho_2 = document.getElementById("boton_slider_derecha_2");

slider_oscilador_2.insertAdjacentElement('afterbegin',ultima_imagen_slider_osc_2);
 
function Siguiente_onda_Osc_2(){

    let primera_imagen_slider_osc_2_temp = document.querySelectorAll("#slider_de_imagenes_ondas_2 .imagen_slider")[0];
    slider_oscilador_2.style.marginLeft = "-200%";
    slider_oscilador_2.style.transition = " all 0.4s";

    setTimeout(function(){
        slider_oscilador_2.style.transition = "none";
        slider_oscilador_2.insertAdjacentElement('beforeend',primera_imagen_slider_osc_2_temp);
        slider_oscilador_2.style.marginLeft = "-100%";
    },400)

}

function Anterior_Onda_Osc_2(){
    let ultima_imagen_slider_osc_2_temp = 
    document.querySelectorAll("#slider_de_imagenes_ondas_2 .imagen_slider")[document.querySelectorAll("#slider_de_imagenes_ondas_2 .imagen_slider").length-1];
    slider_oscilador_2.style.marginLeft = "0";
    slider_oscilador_2.style.transition = " all 0.4s";

    setTimeout(function(){
        slider_oscilador_2.style.transition = "none";
        slider_oscilador_2.insertAdjacentElement('afterbegin',ultima_imagen_slider_osc_2_temp);
        slider_oscilador_2.style.marginLeft = "-100%";
    },400)
}

boton_izquierdo_2.addEventListener('click',Anterior_Onda_Osc_2);
boton_derecho_2.addEventListener('click',Siguiente_onda_Osc_2);

function insertaDeslizadorDeImagenesEn(
    contenedorDeslizadorSuperior,
    valoresParaCadaImagen,
    titulosImagenes,
    rutaCarpetaContenedoraDeImagenesRelativaAlArchivoHTML,
    nombresDeImagenesIncluidoFormato,tituloDeslizadorDeImagenes,
    tamañoTituloDeslizadorDeImagenes,
    ORIENTACIONcolumnaOfila = "columna",
    tamanoFlechas = "3vw",
    grosorContornosFlecha = "0.2vw",
    colorDeControles = "rgb(160, 160, 160)"
){
    
    contenedorDeslizadorSuperior.style.display = "flex";
    contenedorDeslizadorSuperior.style.flexDirection = (ORIENTACIONcolumnaOfila=="columna")?"column":"row";
    contenedorDeslizadorSuperior.style.alignItems = "center";
    contenedorDeslizadorSuperior.style.justifyContent = "space-evenly";

    let cantidadDeImagenes = nombresDeImagenesIncluidoFormato.length;

    // AGREGANDO ESTILOS ADICIONALES DESDE JAVASCRIPT
    let estilosAdicionalesParaPseudoCLASES = document.createElement('style');
    estilosAdicionalesParaPseudoCLASES.innerHTML =
    `
        *{
            box-sizing: border-box;
        }

        #${contenedorDeslizadorSuperior.id} .boton-slider-imagenes{ 
            font-family: monospace;
            color: ${colorDeControles};
            font-size: ${tamanoFlechas};
            position: relative;
            width: 25%;
            height: 80%;
            border: ${grosorContornosFlecha} solid ${colorDeControles};
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content:space-around;
            animation: elevar_y_bajar 1s ease-in infinite;
            border-radius: 1vw;
        }

        .boton-slider-imagenes:hover{ 
            cursor: pointer;
            animation: none;
        }

        #${contenedorDeslizadorSuperior.id} .imagen-deslizador-imagenes{
            min-width: ${(100/cantidadDeImagenes)}%;
            min-height: 100%;
            object-fit: cover;
            background-position: center;
        }

        @keyframes elevar_y_bajar {
            0%{
                top:0;            
            }
    
            25%{
                top:-0.1vw;        
            }
    
            75%{
                top:0.1vw;
            }
    
            100%{
                top:0;
            }
        }
    `;

    window.document.head.appendChild(estilosAdicionalesParaPseudoCLASES);

    let tituloDeslizadorImagenes = document.createElement('div');
        tituloDeslizadorImagenes.innerText = tituloDeslizadorDeImagenes;
        tituloDeslizadorImagenes.style.fontSize = tamañoTituloDeslizadorDeImagenes;

    let contenedorTotalFlechasMasDeslizador = document.createElement('div');

        //MODIFICANDO EL ESTILO DE NUESTRO CONTENEDOR DEL DESLIZADOR DE IMAGENES
        contenedorTotalFlechasMasDeslizador.style.width = (ORIENTACIONcolumnaOfila=="columna")?"80%":"56%";
        contenedorTotalFlechasMasDeslizador.style.height = "90%";
        contenedorTotalFlechasMasDeslizador.style.display = "flex";
        contenedorTotalFlechasMasDeslizador.style.flexDirection = "row";
        contenedorTotalFlechasMasDeslizador.style.alignItems = "center";
        contenedorTotalFlechasMasDeslizador.style.justifyContent = "space-evenly"


            //CREANDO EL BOTON HACIA LA IZQUIERDA
            let boton_izquierda = document.createElement('div');
                boton_izquierda.classList.add('boton-slider-imagenes');
                boton_izquierda.innerText = '<';

            
            //CREANDO EL DESLIZADOR
            let contenedor_slider_imagenes = document.createElement('div'); 
                contenedor_slider_imagenes.style.width = "40%";
                contenedor_slider_imagenes.style.height = "100%";
                contenedor_slider_imagenes.style.overflow = "hidden";
                
                //CREANDO EL CONTENEDOR DE IMAGENES CON OVERFLOW HIDDEN
                let contenedorImagenes = document.createElement('div');
                    contenedorImagenes.style.width = 100 * cantidadDeImagenes + "%";
                    contenedorImagenes.style.height = "100%";
                    contenedorImagenes.style.display = "flex";
                    contenedorImagenes.style.flexDirection = "row";
                    contenedorImagenes.style.marginLeft = "-100%";

                    contenedor_slider_imagenes.appendChild(contenedorImagenes);

                    let imagenes = [];

                    for(let i=0;i<cantidadDeImagenes;i++){
                        imagenes[i] = document.createElement('div');
                        imagenes[i].classList.add('imagen-deslizador-imagenes');
                        imagenes[i].dataset.value = valoresParaCadaImagen[i];
                            let imagenFONDO = document.createElement('div');
                            imagenFONDO.style.width = "80%";
                            imagenFONDO.style.height = "100%";
                            imagenFONDO.style.margin = "auto";
                            imagenFONDO.title = titulosImagenes[i];
                            imagenFONDO.style.backgroundImage = 
                            `url('${rutaCarpetaContenedoraDeImagenesRelativaAlArchivoHTML}/${nombresDeImagenesIncluidoFormato[i]}')`;
                            imagenes[i].appendChild(imagenFONDO);
                        contenedorImagenes.appendChild(imagenes[i]);
                    }



            //CREANDO EL BOTON HACIA LA DERECHA
            let boton_derecha = document.createElement('div');
                boton_derecha.innerText = ">";
                boton_derecha.classList.add('boton-slider-imagenes');


        contenedorTotalFlechasMasDeslizador.appendChild(boton_izquierda);
        contenedorTotalFlechasMasDeslizador.appendChild(contenedor_slider_imagenes);
        contenedorTotalFlechasMasDeslizador.appendChild(boton_derecha);

    //AGREGANDO EVENTOS DE CLIC A BOTONES IZQUIERDO Y DERECHO

    contenedorImagenes.insertAdjacentElement('afterbegin',imagenes[imagenes.length-1]); //Colocando el ultimo elemento detras del primero 
                                                                                        //por si se pulsa el boton hacia la izquierda primero
    
    let valorSeleccionado;

    function anteriorImagen(){
        let ultimaImagenActual = document.querySelectorAll
        (`#${contenedorDeslizadorSuperior.id} .imagen-deslizador-imagenes`)
        [cantidadDeImagenes - 1];
        contenedorImagenes.style.transition = "all 0.4s";
        contenedorImagenes.style.marginLeft = "0";

        setTimeout(()=>{
            contenedorImagenes.style.transition = "none";
            contenedorImagenes.insertAdjacentElement('afterbegin',ultimaImagenActual);
            contenedorImagenes.style.marginLeft = "-100%";
            valorSeleccionado = document.querySelectorAll(`#${contenedorDeslizadorSuperior.id} .imagen-deslizador-imagenes`)[1].dataset.value;
        },400);

        

    }

    function siguienteImagen(){
        let primeraImagenActual = document.querySelectorAll
        (`#${contenedorDeslizadorSuperior.id} .imagen-deslizador-imagenes`)[0];
            
        contenedorImagenes.style.marginLeft = "-200%";
        contenedorImagenes.style.transition = "all 0.4s";

        setTimeout(()=>{
            contenedorImagenes.style.transition = "none";
            contenedorImagenes.insertAdjacentElement('beforeend',primeraImagenActual);
            contenedorImagenes.style.marginLeft = "-100%";
            valorSeleccionado = document.querySelectorAll(`#${contenedorDeslizadorSuperior.id} .imagen-deslizador-imagenes`)[1].dataset.value;
        },400)
    }


    if (ORIENTACIONcolumnaOfila=="columna"){
        contenedorDeslizadorSuperior.appendChild(contenedorTotalFlechasMasDeslizador);
        contenedorDeslizadorSuperior.appendChild(tituloDeslizadorImagenes);
    }else{
        contenedorDeslizadorSuperior.appendChild(tituloDeslizadorImagenes);
        contenedorDeslizadorSuperior.appendChild(contenedorTotalFlechasMasDeslizador);
    }

    valorSeleccionado = document.querySelectorAll(`#${contenedorDeslizadorSuperior.id} .imagen-deslizador-imagenes`)[1].dataset.value;


    boton_izquierda.addEventListener('click',anteriorImagen);
    boton_derecha.addEventListener('click',siguienteImagen);

    return {value:valorSeleccionado};

}

