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