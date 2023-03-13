
//FUNCION PARA CALCULAR EL VALOR DE UNA BARRA 
//MEDIANTE UN EVENTO MOUSEMOVE
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

//FUNCION PARA OBTENER EL VALOR DE UNA BARRA A PARTIR
//DE LA PROPIEDAD CSS backgroundImage MEDIANTE EXPRESIONES 
//REGULARES
function obtenerValorBarra(barra,limiteInferior,limiteSuperior){
    let valorBackgroundImage = barra.style.backgroundImage;
    let coincidencia;
    let i = 0;                                          
    for (let iterador of valorBackgroundImage.matchAll(/\d\d\d?.\d+%|\d.\d+%|\d\d%/g)){
        if(i==0){
            coincidencia = iterador[0];
        }
        i++;
    }

    return (parseFloat(coincidencia.match(/\d\d\d?.\d+|\d.\d+|\d\d/)[0])/100)*(limiteSuperior-limiteInferior);
}

//FUNCION PARA GUARDAR UN VALOR EN UNA BARRA
//MEDIANTE SU PROPIEDAD BACKGROUND IMAGE
function setValueBarra(barra,valor,limiteInferior,limiteSuperior,colorFondo){
    let porcentajeApintar =
    ((valor/(limiteSuperior-limiteInferior))*100) + 0.01;

    barra.style.backgroundImage = "none";

    barra.style.backgroundImage = `linear-gradient(to top,${colorFondo} 0%,${colorFondo} ${porcentajeApintar}%,transparent ${porcentajeApintar}%)`;

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

    //MODIFICANDO ALGUNAS PROPIEDADES CSS DE NUESTRO CONTENEDOR
    contenedor.style.display = "flex";
    contenedor.style.flexDirection = "row";
    contenedor.style.alignItems = "center";
    contenedor.style.justifyContent = "none";
    contenedor.style.border = `0.15vw solid ${colorContornos}`;
    contenedor.style.borderRadius = "0.5vw";

    let anchoContenedor = contenedor.getBoundingClientRect().right - contenedor.getBoundingClientRect().left; 
    let mascarasDeArrastre = [];
    let funcionesParaCambiarValorDeUnaSolaBarra = [];
    let barrasContenedoras = []
    let matrizValores = [];

    for(let i=0;i<cantidadDeBarras;i++){

        //Creacion de una barra contenedora
        barrasContenedoras[i] = document.createElement("div");
        barrasContenedoras[i].style.width = pixelsToVWVH(anchoContenedor/cantidadDeBarras,"vw") + "vw";
        barrasContenedoras[i].style.height = "100%";
        barrasContenedoras[i].style.borderRight = (i==cantidadDeBarras-1)?"none":`0.2vw solid ${colorContornos}`;

        //Colocando valores por defecto en funcion a f(x)=x
        let alturaDefecto = (100/(cantidadDeBarras-1))*i;
        alturaDefecto = ((alturaDefecto + "").length < 2)?alturaDefecto + 0.01: alturaDefecto;
        barrasContenedoras[i].style.backgroundImage = 
        `linear-gradient(to top,${colorFondo} 0%,${colorFondo} ${parseFloat(alturaDefecto.toFixed(2))}%,transparent ${parseFloat(alturaDefecto.toFixed(2))}%)`;

        //===============================================================================================================================
        barrasContenedoras[i].classList.add('barra-valor-Grafica-barras');

        contenedor.appendChild(barrasContenedoras[i]);

        matrizValores[i] = obtenerValorBarra(barrasContenedoras[i],valorLimiteInferiorBarras,valorLimiteSuperiorBarras);

        barrasContenedoras[i].addEventListener('mousedown',function(){

            let altoBarra = barrasContenedoras[i].getBoundingClientRect().bottom - barrasContenedoras[i].getBoundingClientRect().top; 

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
                calcularValorBarra(e,barrasContenedoras[i].getBoundingClientRect().bottom,altoBarra,valorLimiteInferiorBarras,valorLimiteSuperiorBarras,true);

                barrasContenedoras[i].style.backgroundImage = 
                `linear-gradient(to top,${colorFondo} 0%,${colorFondo} ${valorEnPorcentaje}%,transparent ${valorEnPorcentaje}%)`;

                matrizValores[i] = (valorEnPorcentaje/100)*(valorLimiteSuperiorBarras-valorLimiteInferiorBarras);

            }
            //Insertando Mascara de Arrastre Invisible en el contenedor de knobs
            contenedor.appendChild(mascarasDeArrastre[i]);

            mascarasDeArrastre[i].addEventListener('mousemove',funcionesParaCambiarValorDeUnaSolaBarra[i]);

            mascarasDeArrastre[i].addEventListener('mouseup',function(){
                contenedor.removeChild(mascarasDeArrastre[i]);
            })

        });

    }

    function guardarValoresEnBarras(valores){
        for(let i=0;i<cantidadDeBarras;i++){
            valores[i] = (valores[i]>valorLimiteSuperiorBarras)?valorLimiteSuperiorBarras:valores[i];
            valores[i] = (valores[i]<valorLimiteInferiorBarras)?valorLimiteInferiorBarras:valores[i];
            setValueBarra(barrasContenedoras[i],parseFloat(valores[i].toFixed(2)),valorLimiteInferiorBarras,valorLimiteSuperiorBarras,colorFondo)
            matrizValores[i] = parseFloat(valores[i].toFixed(2));
        }
    }

    return {
        value: matrizValores,
        setValues: guardarValoresEnBarras
    };

}

