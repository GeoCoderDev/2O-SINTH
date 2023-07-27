function desvanecerElemento(HTMLelement,duracionSegundos,horizontalmente=false,permanent=true){

    let displayOriginal = window.getComputedStyle(HTMLelement).display;

    if(horizontalmente){
        let anchoOriginal = HTMLelement.offsetWidth;
        let anchoOriginalEnPorcentaje = roundToDecimals((anchoOriginal/HTMLelement.parentNode.clientWidth)*100,2);

        console.log(`${anchoOriginalEnPorcentaje}%`)

        const FADE_HORIZONTAL = HTMLelement.animate([
            {opacity:1}, //0%
            {}, //25%
            {}, //50%
            {opacity:0,width:`${anchoOriginalEnPorcentaje}%`, margin:0}, //75%
            {opacity:0,width:0,margin:`0 -${anchoOriginalEnPorcentaje/2}%`,display:"none"} //100%
        ],{
            iterations:1,
            duration: duracionSegundos * 1000, //esta propiedad recibe un valor en milisegundos
            easing:"ease-in",
            fill:(permanent)?'forwards':'none'
        })

        return{anchoOriginalEnPorcentaje:anchoOriginalEnPorcentaje,animacionFinalizada:FADE_HORIZONTAL.finished,displayOriginal:displayOriginal}

    }else{        
        
        let altoOriginal = HTMLelement.offsetHeight;
        let altoOriginalEnPorcentaje = (altoOriginal/HTMLelement.parentNode.clientHeight)*100;


        const FADE_VERTICAL = HTMLelement.animate([
            {opacity:1}, //0%
            {}, //25%
            {}, //50%
            {opacity:0,height:`${altoOriginalEnPorcentaje}%`, margin:0}, //75%
            {opacity:0,height:0,margin:`-${altoOriginalEnPorcentaje/2}% 0`,display:"none"} //100%
        ],{
            iterations:1,
            duration: duracionSegundos * 1000, //esta propiedad recibe un valor en milisegundos
            easing:"ease-in",
            fill:(permanent)?'forwards':'none'
        })

        return{altoOriginalEnPorcentaje:altoOriginalEnPorcentaje,animacionFinalizada:FADE_VERTICAL.finished,displayOriginal:displayOriginal}

    }
        
};


function aparecerElemento(HTMLelement,duracionSegundos,dimensionOriginalEnPorcentaje,displayOriginal,horizontalmente=false,permanent=true){

    if(horizontalmente){

        const APPEAR_HORIZONTAL = HTMLelement.animate([
            {opacity:0,width:0,margin:`0 -${dimensionOriginalEnPorcentaje/2}%`,display:displayOriginal}, //0%
            {}, //25%
            {}, //50%
            {opacity:0,width:`${dimensionOriginalEnPorcentaje}%`, margin:0, display:displayOriginal}, //75%
            {opacity:1, width:`${dimensionOriginalEnPorcentaje}%`, margin:0, display:displayOriginal} //100%
        ],{
            iterations:1,
            duration: duracionSegundos * 1000, //esta propiedad recibe un valor en milisegundos
            easing:"ease-in",
            fill:((permanent)?'forwards':'none')
        })

        return{animacionFinalizada:APPEAR_HORIZONTAL.finished}

    }else{        
        
        const APPEAR_VERTICAL = HTMLelement.animate([
            {opacity:0,height:0,display:displayOriginal}, //0%
            {}, //25%
            {}, //50%
            {opacity:0,height:`${dimensionOriginalEnPorcentaje}%`, margin:0,display:displayOriginal}, //75%
            {opacity:1,height:`${dimensionOriginalEnPorcentaje}%`, margin:0,display:displayOriginal} //100%
        ],{
            iterations:1,
            duration: duracionSegundos * 1000, //esta propiedad recibe un valor en milisegundos
            easing:"ease-in",
            fill:(permanent)?'forwards':'none'
        })

        return{animacionFinalizada:APPEAR_VERTICAL.finished}

    }
        
};

