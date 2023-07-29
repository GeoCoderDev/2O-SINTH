

function insertaDeslizadorDeImagenesEn(
    contenedorDeslizadorSuperior,
    valoresParaCadaImagen,
    titulosImagenes,
    rutaCarpetaContenedoraDeImagenesRelativaAlArchivoHTML,
    nombresDeImagenesIncluidoFormato,tituloDeslizadorDeImagenes,
    tamañoTituloDeslizadorDeImagenes,
    flechasIDs,
    ORIENTACIONcolumnaOfila = "columna",
    tamanoFlechas = "3vw",
    grosorContornosFlecha = "0.2vw",
    colorDeControles = "rgb(160, 160, 160)",    
){

    let datosDeslizadorImagenes = {};

    contenedorDeslizadorSuperior.style.display = "flex";
    contenedorDeslizadorSuperior.style.flexDirection = (ORIENTACIONcolumnaOfila=="columna")?"column":"row";
    contenedorDeslizadorSuperior.style.alignItems = "center";
    contenedorDeslizadorSuperior.style.justifyContent = "space-evenly";

    let cantidadDeImagenes = nombresDeImagenesIncluidoFormato.length;

    // AGREGANDO ESTILOS ADICIONALES DESDE JAVASCRIPT
    insertarReglasCSSAdicionales(
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

        #${contenedorDeslizadorSuperior.id} .boton-slider-imagenes:hover{ 
            animation: none;
            cursor: pointer;
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
    `);

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
                boton_izquierda.id = flechasIDs[0];
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
                boton_derecha.id = flechasIDs[1];
                boton_derecha.innerText = ">";
                boton_derecha.classList.add('boton-slider-imagenes');


        contenedorTotalFlechasMasDeslizador.appendChild(boton_izquierda);
        contenedorTotalFlechasMasDeslizador.appendChild(contenedor_slider_imagenes);
        contenedorTotalFlechasMasDeslizador.appendChild(boton_derecha);

    //AGREGANDO EVENTOS DE CLIC A BOTONES IZQUIERDO Y DERECHO

    contenedorImagenes.insertAdjacentElement('afterbegin',imagenes[imagenes.length-1]); //Colocando el ultimo elemento detras del primero 
                                                                                        //por si se pulsa el boton hacia la izquierda primero

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

        },400)
    }

    delegarEvento('click',boton_izquierda,anteriorImagen);
    delegarEvento('click',boton_derecha,siguienteImagen);


    datosDeslizadorImagenes.obtenerValor = function(){
        return document.querySelectorAll(`#${contenedorDeslizadorSuperior.id} .imagen-deslizador-imagenes`)[1].dataset.value;
    }

    if (ORIENTACIONcolumnaOfila=="columna"){
        contenedorDeslizadorSuperior.appendChild(contenedorTotalFlechasMasDeslizador);
        contenedorDeslizadorSuperior.appendChild(tituloDeslizadorImagenes);
    }else{
        contenedorDeslizadorSuperior.appendChild(tituloDeslizadorImagenes);
        contenedorDeslizadorSuperior.appendChild(contenedorTotalFlechasMasDeslizador);
    }



    datosDeslizadorImagenes.go = function(valorDeImagen){
        let todasLasImagenes = document.querySelectorAll(`#${contenedorDeslizadorSuperior.id} .imagen-deslizador-imagenes`);
        let posicionImagenEncontrada;
        let diferenciaParaSerSeleccionado;

        //Encontrando Posicion de nuestra imagen en funcion de su valor 
        for(let i=0;i<todasLasImagenes.length;i++){
            if(todasLasImagenes[i].dataset.value==valorDeImagen)
                posicionImagenEncontrada=i;
        }

        //Obteniendo la diferencia con respecto a 1 que es la posicion de la imagen seleccionada
        //en nuestros deslizadores de imagenes
        diferenciaParaSerSeleccionado = 1 - posicionImagenEncontrada;

        if(diferenciaParaSerSeleccionado<0){
            for(let i=1;i<=Math.abs(diferenciaParaSerSeleccionado);++i){
                let primeraImagenActual = document.querySelectorAll
                (`#${contenedorDeslizadorSuperior.id} .imagen-deslizador-imagenes`)[0];                            
                contenedorImagenes.style.marginLeft = "-200%";
                contenedorImagenes.style.transition = "none";
                contenedorImagenes.insertAdjacentElement('beforeend',primeraImagenActual);
                contenedorImagenes.style.marginLeft = "-100%";

            }
        }else if(diferenciaParaSerSeleccionado>0){
            for(let i=1;i<=Math.abs(diferenciaParaSerSeleccionado);i++){

                let ultimaImagenActual = document.querySelectorAll
                (`#${contenedorDeslizadorSuperior.id} .imagen-deslizador-imagenes`)
                [cantidadDeImagenes - 1];
                contenedorImagenes.style.marginLeft = "0";
                contenedorImagenes.style.transition = "none";
                contenedorImagenes.insertAdjacentElement('afterbegin',ultimaImagenActual);
                contenedorImagenes.style.marginLeft = "-100%";
            
            }
        };
    }

    datosDeslizadorImagenes.obtenerIDs = flechasIDs;

    return datosDeslizadorImagenes;

}

