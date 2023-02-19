function pixelsToVWVH(pixeles,medida){

    let conversion;
    if(medida=="vw"){
        let anchoPantalla = window.innerWidth;
        conversion = (pixeles*100)/anchoPantalla;
    }else{
        let altoPantalla = window.innerHeight;
        conversion = (pixeles*100)/altoPantalla;
    }

    return conversion;

}

function insertarReglasCSSAdicionales(reglasCSS){
    let elementoStyle = document.createElement('style');
    elementoStyle.innerHTML = reglasCSS;
    document.head.appendChild(elementoStyle);
}