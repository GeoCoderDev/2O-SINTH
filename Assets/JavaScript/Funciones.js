var medidasRelativas = [];
    medidasRelativas[0] = window.innerWidth;
    medidasRelativas[1] = window.innerHeight;

function actualizarMedidadRelativas(){
    medidasRelativas[0] = window.innerWidth;
    medidasRelativas[1] = window.innerHeight;
}

window.addEventListener('resize',actualizarMedidadRelativas);

function pixelsToVWVH(pixeles,medida){

    let conversion;
    if(medida=="vw"){
        let anchoPantalla = medidasRelativas[0];
        conversion = (pixeles*100)/anchoPantalla;
    }else{
        let altoPantalla = medidasRelativas[1];
        conversion = (pixeles*100)/altoPantalla;
    }

    return conversion;

}

function insertarReglasCSSAdicionales(reglasCSS){
    let elementoStyle = document.createElement('style');
    elementoStyle.innerHTML = reglasCSS;
    document.head.appendChild(elementoStyle);
}

