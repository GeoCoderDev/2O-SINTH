function calcularGrados(e,ObjetoX,ObjetoY,ancho_O_altoKnob){
    const OriginX = ObjetoX + (ancho_O_altoKnob/2);
    const OriginY = ObjetoY + (ancho_O_altoKnob/2);    
    const PosXMouse = e.clientX;
    const PosYMouse = e.clientY;
    const PosXMouseWithKnobAsReference = PosXMouse - OriginX;
    const PosYMouseWithKnobAsReference = OriginY - PosYMouse;

    let grados;

    if(PosXMouseWithKnobAsReference>=0 && PosYMouseWithKnobAsReference>=0){
        grados = (Math.atan(PosYMouseWithKnobAsReference/PosXMouseWithKnobAsReference) * 180)/Math.PI;
    }else if(PosXMouseWithKnobAsReference<0 && PosYMouseWithKnobAsReference>=0){
        grados = ((Math.atan(Math.abs(PosXMouseWithKnobAsReference/PosYMouseWithKnobAsReference)) * 180)/Math.PI) + 90;
    }else if(PosXMouseWithKnobAsReference<0 && PosYMouseWithKnobAsReference<0){
        grados = ((Math.atan(Math.abs(PosYMouseWithKnobAsReference/PosXMouseWithKnobAsReference)) * 180)/Math.PI) + 180;
    }else{
        grados = ((Math.atan(Math.abs(PosXMouseWithKnobAsReference/PosYMouseWithKnobAsReference)) * 180)/Math.PI) + 270;
    }

    

    if(grados>225 && grados<315 && PosXMouseWithKnobAsReference<0){
        grados = -135;
    }else if(grados>225 && grados<315 && PosXMouseWithKnobAsReference>0){
        grados = 135;
    }else{
        if(grados>=90 && grados<=225){
            grados = 90 - grados;
        }else if(grados<90 && grados>=0){
            grados = 90 - grados;
        }else if(grados<360 && grados>=315){
            grados = (360 - grados) + 90;
        }        
    }

    return grados;

}


function gradosCSSaValorKnob(gradosCSS,limiteInferior,limiteSuperior){
    return ((((gradosCSS+135)*(limiteSuperior-limiteInferior))/270)+limiteInferior);
}

function ValorKnobAGradosCSS(valorKnob,limiteInferior,limiteSuperior){
    return ((((valorKnob-limiteInferior)*270)/(limiteSuperior-limiteInferior))-135);
}

function insertaKnobsEn
(
    contenedorDeKnobs,
    tamanoDeKnobs,
    tamanoTextos,
    cantidadKnobs,
    cantidadKnobsPorFila,
    textoKnobs,
    idKnobs,
    limitesInferiores,
    limitesSuperiores,
    valoresPorDefecto,
    colorControles = "#999999",
    callBacks
){
    contenedorDeKnobs.style.display = "flex";
    contenedorDeKnobs.style.flexWrap = "wrap";
    contenedorDeKnobs.style.alignItems = "center"
    contenedorDeKnobs.style.justifyContent = "space-evenly";

    let textosKnobs =  [];
    let contenedoresKnobs = [];
    let Knobs = [];
    let indicadores_knobs = [];
    let anchoContenedoresDeKnobs = ((100/cantidadKnobsPorFila)-1) + "%";
    let altoContenedoresDeKnobs = ((100/(Math.ceil(cantidadKnobs/cantidadKnobsPorFila)))-1) + "%";
    let datosGeometricosKnob = [];
    let funcionesRotate = [];
    let mascarasDeArrastre = [];
    let knobsValues = [];
    let eventosMouseDownIDs = [];
    let eventosMouseUpIDs = [];

    for(let i = 0; i < cantidadKnobs; i++){

        //CREACION DE LOS CONTENEDORES DE KNOBS

        contenedoresKnobs[i] = document.createElement('div');
        contenedoresKnobs[i].style.minWidth = anchoContenedoresDeKnobs;
        contenedoresKnobs[i].style.minHeight = altoContenedoresDeKnobs;
        // contenedoresKnobs[i].style.border = "1px solid black";
        contenedoresKnobs[i].style.display = "flex";
        contenedoresKnobs[i].style.flexDirection = "column";
        contenedoresKnobs[i].style.alignItems = "center";
        contenedoresKnobs[i].style.justifyContent = "space-evenly";

            //CREACION DE LOS KNOBS
            Knobs[i] = document.createElement('div');
            // Knobs[i].id = idKnobs[i];
            Knobs[i].style.display = "flex";
            Knobs[i].style.alignItems = "start";            
            Knobs[i].style.justifyContent = "space-evenly";            
            Knobs[i].style.height = tamanoDeKnobs;
            Knobs[i].style.width = tamanoDeKnobs;
            Knobs[i].style.borderRadius = "50%";
            Knobs[i].style.backgroundColor = "azure";                
            Knobs[i].style.boxShadow =`0vw 0vw 0.3vw 0.1vw, 
                                       0vw 0vw 0.2vw 0.2vw inset`; 
            Knobs[i].style.transform = 'rotate(-135deg)';

            //Inicializando matriz de valores de los knobs con 0

            knobsValues[i] = 0;

                //CREACION DE UN INDICADOR
                indicadores_knobs[i] = document.createElement('div');
                indicadores_knobs[i].style.position = "relative"
                indicadores_knobs[i].style.display = "block";
                indicadores_knobs[i].style.top = "6%"
                indicadores_knobs[i].style.height = "40%";
                indicadores_knobs[i].style.width = "10%";       
                indicadores_knobs[i].borderRadius = "50%";                                         
                indicadores_knobs[i].style.backgroundColor = colorControles;                                       

            //CREACION DE LOS TEXTOS DE LOS KNOBS
            textosKnobs[i] = document.createElement('div');
            textosKnobs[i].innerText = textoKnobs[i];
            textosKnobs[i].style.fontSize = tamanoTextos;
            textosKnobs[i].style.textAlign = "center";
        //JUNTANDO TODO 
        Knobs[i].appendChild(indicadores_knobs[i]);
        contenedoresKnobs[i].appendChild(Knobs[i]);
        contenedoresKnobs[i].appendChild(textosKnobs[i]);
        contenedorDeKnobs.appendChild(contenedoresKnobs[i]);

        //AÑADIENDO EVENTOS

        let crearMascaraDeArrastreParaMoverKnob = ()=>{                    

            //DEFINIENDO LAS MASCARAS DE PARA ARRASTRAR LIBREMENTE POR TODA LA PANTALLA
            mascarasDeArrastre[i] = document.createElement('div');
            mascarasDeArrastre[i].id = idKnobs[i];
            mascarasDeArrastre[i].style.position = 'fixed';
            mascarasDeArrastre[i].style.top = '0';
            mascarasDeArrastre[i].style.left = '0';
            mascarasDeArrastre[i].style.width = "100vw";
            mascarasDeArrastre[i].style.height = "100vh";
            mascarasDeArrastre[i].style.zIndex = "101";

            //Insertando Mascara de Arrastre Invisible en el contenedor de knobs
            contenedorDeKnobs.appendChild(mascarasDeArrastre[i]);

            //Funcion de Rotacion
            funcionesRotate[i] = (e) => {
                datosGeometricosKnob[i] = Knobs[i].getBoundingClientRect();
                let rotacion = calcularGrados(e,datosGeometricosKnob[i].left,datosGeometricosKnob[i].top,datosGeometricosKnob[i].width);
                Knobs[i].style.transform = `rotate(${rotacion}deg)`;
                knobsValues[i] = gradosCSSaValorKnob(rotacion,limitesInferiores[i],limitesSuperiores[i]);

                //Ejecutando Callback para cambiar valores
                if(callBacks) callBacks[i]();
            }
            
            eventosMouseDownIDs[i]=delegarEvento('mousemove',mascarasDeArrastre[i],funcionesRotate[i]);


            eventosMouseUpIDs[i]=delegarEvento("mouseup",mascarasDeArrastre[i],function(){
                eliminarEventoDelegado('mousemove',eventosMouseDownIDs[i]);
                contenedorDeKnobs.removeChild(mascarasDeArrastre[i]);   
            })                

        }

        delegarEvento('mousedown',Knobs[i],crearMascaraDeArrastreParaMoverKnob);
        delegarEvento('mousedown',indicadores_knobs[i],crearMascaraDeArrastreParaMoverKnob);


        // Knobs[i].addEventListener("mousedown",

        //EJECUTANDO LOS CALLBACKS SIN NECESIDAD DE ALGUNA INTERACCION CON LOS KNOBS
        if(callBacks) callBacks[i]();
    }

    function guardarValores(valores){
        for(let i = 0;i<cantidadKnobs;i++){
            if(valores[i]!==undefined){
                Knobs[i].style.transform = `rotate(${ValorKnobAGradosCSS(valores[i],limitesInferiores[i],limitesSuperiores[i])}deg)`;
                knobsValues[i] = valores[i];
            }
        }
    }

    guardarValores(valoresPorDefecto);

    return {
        value: knobsValues,
        setValues: guardarValores,
        obtenerIDs: idKnobs
    }

}; 







