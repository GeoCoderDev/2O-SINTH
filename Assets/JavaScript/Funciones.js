var medidasRelativas = [];
    medidasRelativas[0] = window.innerWidth;
    medidasRelativas[1] = window.innerHeight;

function actualizarMedidadRelativas(){
    medidasRelativas[0] = window.innerWidth;
    medidasRelativas[1] = window.innerHeight;
}

window.addEventListener('resize',actualizarMedidadRelativas);


/**
 * 
 * @param {*} pixeles cantidad en pixeles
 * @param {*} medida medida relativa vw o vh
 * @returns devuelve la cantidad de pixeles ingresadas en vw o vh
 */
function pixelsToVWVH(pixeles,medida){


    if(medida=="vw"){
        return [((pixeles*100)/medidasRelativas[0])]
    }else{
        return [((pixeles*100)/medidasRelativas[1])]
    }


}

function insertarReglasCSSAdicionales(reglasCSS){
    let elementoStyle = document.createElement('style');
    elementoStyle.innerHTML = reglasCSS;
    document.head.appendChild(elementoStyle);
}


function distanciaRelativaEntreElementos(ancestroHTML, descendienteHTML){

    let distanciaHorizontalPX = 0, distanciaVerticalPX = 0;

    let iteradorArbolHTML = descendienteHTML;

    while (iteradorArbolHTML && iteradorArbolHTML!=ancestroHTML) {
        distanciaHorizontalPX += iteradorArbolHTML.offsetLeft;
        distanciaVerticalPX += iteradorArbolHTML.offsetTop;
        iteradorArbolHTML = iteradorArbolHTML.offsetParent;
    }

    return{distanciaHorizontalPX,distanciaVerticalPX};

}