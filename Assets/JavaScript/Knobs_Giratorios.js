var contenedorKnobsLFO = document.getElementById('cont-knobs-lfo');

// alert(`${document.getElementById('cont-amplificador').getBoundingClientRect().left},${document.getElementById('cont-amplificador').getBoundingClientRect().top}`)

// var unidad_vw_en_px = window.matchMedia('screen and (orientation:landscape)').matches? window.innerWidth/100:windows.innerHeight/100;

function calcularGrados(e,ObjetoX,ObjetoY,ancho_O_altoKnob){
    const OriginX = ObjetoX + (ancho_O_altoKnob/2);
    const OriginY = ObjetoY + (ancho_O_altoKnob/2);    
    const PosXMouse = e.clientX;
    const PosYMouse = e.clientY;
    const PosXMouseWithKnobAsReference = PosXMouse - OriginX;
    const PosYMouseWithKnobAsReference = OriginY - PosYMouse;
    // alert(`${PosXMouseWithKnobAsReference},${PosYMouseWithKnobAsReference}`);
    // alert(`${PosXMouse},${PosYMouse}`);
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
        }else if(grados<90 || grados>=0){
            grados = 90 - grados;
        }else if(grados<360 || grados>=315){
            grados = (360 - grados) + 90;
        }        
    }

    return grados;

}




function insertaKnobsEn(contenedorDeKnobs,tamanoDeKnobs,tamanoTextos,cantidadKnobs,cantidadKnobsPorFila,textoKnobs,idKnobs){
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
            Knobs[i].id = idKnobs[i];
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

                //CREACION DE UN INDICADOR
                indicadores_knobs[i] = document.createElement('div');
                indicadores_knobs[i].style.position = "relative"
                indicadores_knobs[i].style.display = "block";
                indicadores_knobs[i].style.top = "6%"
                indicadores_knobs[i].style.height = "40%";
                indicadores_knobs[i].style.width = "10%";       
                indicadores_knobs[i].borderRadius = "50%";                                         
                indicadores_knobs[i].style.backgroundColor = "#999999";                                       

            //CREACION DE LOS TEXTOS DE LOS KNOBS
            textosKnobs[i] = document.createElement('div');
            textosKnobs[i].innerText = textoKnobs[i];
            textosKnobs[i].style.fontSize = tamanoTextos;
        //JUNTANDO TODO 
        Knobs[i].appendChild(indicadores_knobs[i]);
        contenedoresKnobs[i].appendChild(Knobs[i]);
        contenedoresKnobs[i].appendChild(textosKnobs[i]);
        contenedorDeKnobs.appendChild(contenedoresKnobs[i]);

        //AÑADIENDO EVENTOS
             

        Knobs[i].addEventListener("mousedown",function(){

            funcionesRotate[i] = (e) => {
                datosGeometricosKnob[i] = Knobs[i].getBoundingClientRect();
                Knobs[i].style.transform = `rotate(${calcularGrados(e,datosGeometricosKnob[i].left,datosGeometricosKnob[i].top,datosGeometricosKnob[i].width)}deg)`;
            }

            Knobs[i].addEventListener("mousemove",funcionesRotate[i]);

            Knobs[i].addEventListener("mouseup",function(){
                Knobs[i].removeEventListener('mousemove',funcionesRotate[i]);                       
            })                

        });

        



    }


}; 

insertaKnobsEn(contenedorKnobsLFO,"3vw","1vw",3,3,["Retraso","Amplitud","Velocidad"],["Knob-Retraso-LFO","Knob-Amplitud-LFO","Knob-Velocidad-LFO"]);






