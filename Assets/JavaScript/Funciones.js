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

/**
 * 
 * @param {*} medida medida relativa vw o vh
 * @param {*} cantidad
 * @returns devuelve la cantidad de pixeles ingresadas en vw o vh
 */
function VWVHTopixels(medida, cantidad){
    if(medida=="vw"){
        return [(cantidad*medidasRelativas[0])/100]
    }else{
        return [(cantidad*medidasRelativas[1])/100]
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


function makeResizableByRight(elementoHTML,nombreClaseNueva,PIXELES_DE_SENSIBILIDAD) {

    insertarReglasCSSAdicionales(`

        .${nombreClaseNueva}::after {
            content: "";
            position: absolute;
            top: 0;
            right: -${pixelsToVWVH(PIXELES_DE_SENSIBILIDAD,'vw')}vw;
            bottom: 0;
            width: ${pixelsToVWVH(PIXELES_DE_SENSIBILIDAD,'vw')}vw; 
            cursor: ew-resize;
        }

    `)

    const resizableDiv = elementoHTML;
    resizableDiv.classList.add(nombreClaseNueva) 
    let isResizing = false;
    let lastX = 0;
    let originalWidth = 0;

    resizableDiv.style.position = 'absolute'; // Asegurarse de que el elemento tenga posición relativa o absoluta

    resizableDiv.addEventListener('mousedown', (e) => {
        if (e.offsetX >= resizableDiv.offsetWidth - 20) { // Solo en el borde derecho
            isResizing = true;
            lastX = e.clientX;
            originalWidth = resizableDiv.offsetWidth;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const deltaX = e.clientX - lastX;
        const newWidth = originalWidth + deltaX; // Cambiamos aquí para que el elemento se redimensione hacia la derecha
        resizableDiv.style.width = `${Math.max(newWidth, 0)}px`;
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });
}