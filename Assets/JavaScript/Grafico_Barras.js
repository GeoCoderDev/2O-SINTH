

function calcularValorBarra(e,barraPosYBaja,altoBarra,limiteInferior,limiteSuperior,enPorcentajes){
        let diferenciaPosicionesY = barraPosYBaja - e.clientY;
        let valorCalculado;

        if(diferenciaPosicionesY<0){
            valorCalculado = (enPorcentajes)?0:limiteInferior;
        }else{
            if((diferenciaPosicionesY>altoBarra)){
                valorCalculado = (enPorcentajes)?100:limiteSuperior;
            }else{
                valorCalculado = 
                (enPorcentajes)?(diferenciaPosicionesY/(altoBarra))*100:(diferenciaPosicionesY/(altoBarra))*(limiteSuperior-limiteInferior);
            }
        }

        return valorCalculado;
}


function insertarGraficoDeBarrasInteractiva
(
    contenedor,
    cantidadDeBarras,
    valorLimiteInferiorBarras,
    valorLimiteSuperiorBarras,
    colorContornos,
    colorFondo
){

    insertarReglasCSSAdicionales(
    `
        #${contenedor.id} .barra-valor-Grafica-barras{

        }    

        #${contenedor.id} .barra-valor-Grafica-barras:hover{
            cursor: pointer;
        } 

    `);


    contenedor.style.display = "flex";
    contenedor.style.flexDirection = "row";
    contenedor.style.alignItems = "center";
    contenedor.style.justifyContent = "none";
    contenedor.style.border = `0.15vw solid ${colorContornos}`;
    contenedor.style.borderRadius = "0.5vw";

    let anchoContenedor = contenedor.getBoundingClientRect().right - contenedor.getBoundingClientRect().left; 
    let matrizValores = [];
    let mascarasDeArrastre = [];
    let funcionesParaCambiarValorDeUnaSolaBarra = [];


    for(let i=0;i<cantidadDeBarras;i++){

        matrizValores[i] = 0;

        let barraContenedora = document.createElement("div");
        barraContenedora.style.width = pixelsToVWVH(anchoContenedor/cantidadDeBarras,"vw") + "vw";
        barraContenedora.style.height = "100%";
        barraContenedora.style.borderRight = (i==cantidadDeBarras-1)?"none":`0.2vw solid ${colorContornos}`;
        barraContenedora.style.backgroundImage = `linear-gradient(to top,${colorFondo} 0%,${colorFondo} 50%,transparent 50%)`;
        barraContenedora.classList.add('barra-valor-Grafica-barras');

        contenedor.appendChild(barraContenedora);

        let altoBarra = barraContenedora.getBoundingClientRect().bottom - barraContenedora.getBoundingClientRect().top; 

        barraContenedora.addEventListener('mousedown',function(){

            //DEFINIENDO LAS MASCARA DE PARA ARRASTRAR LIBREMENTE POR 
            //TODA LA PANTALLA PARA CADA BARRA
            mascarasDeArrastre[i] = document.createElement('div');
            mascarasDeArrastre[i].style.position = 'fixed';
            mascarasDeArrastre[i].style.top = '0';
            mascarasDeArrastre[i].style.left = '0';
            mascarasDeArrastre[i].style.width = "100vw";
            mascarasDeArrastre[i].style.height = "100vh";
            mascarasDeArrastre[i].style.zIndex = "101";

            funcionesParaCambiarValorDeUnaSolaBarra[i] = function(e){
                let valorEnPorcentaje = 
                calcularValorBarra(e,barraContenedora.getBoundingClientRect().bottom,altoBarra,valorLimiteInferiorBarras,valorLimiteSuperiorBarras,true);

                let valorCalculado = 
                calcularValorBarra(e,barraContenedora.getBoundingClientRect().bottom,altoBarra,valorLimiteInferiorBarras,valorLimiteSuperiorBarras);

                barraContenedora.style.backgroundImage = 
                `linear-gradient(to top,${colorFondo} 0%,${colorFondo} ${valorEnPorcentaje}%,transparent ${valorEnPorcentaje}%)`;
                matrizValores[i] = valorCalculado;
            }
            //Insertando Mascara de Arrastre Invisible en el contenedor de knobs
            contenedor.appendChild(mascarasDeArrastre[i]);

            mascarasDeArrastre[i].addEventListener('mousemove',funcionesParaCambiarValorDeUnaSolaBarra[i]);

            mascarasDeArrastre[i].addEventListener('mouseup',function(){
                contenedor.removeChild(mascarasDeArrastre[i]);
            })

        });

    }
    

    return matrizValores;

}

