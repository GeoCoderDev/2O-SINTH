function insertarGraficoDeBarrasInteractiva
(
    contenedor,
    cantidadDeBarras,
    valorLimiteInferiorBarras,
    valorLimiteSuperiorBarras,
    colorContornos,
    colorFondo
){

    contenedor.style.display = "flex";
    contenedor.style.flexDirection = "row";
    contenedor.style.alignItems = "center";
    contenedor.style.justifyContent = "none";
    contenedor.style.border = `0.15vw solid ${colorContornos}`;

    let anchoContenedor = contenedor.getBoundingClientRect().right - contenedor.getBoundingClientRect().left; 
    let matrizValores = [];

    for(let i=0;i<cantidadDeBarras;i++){
        let barraContenedora = document.createElement("div");
        barraContenedora.style.width = pixelsToVWVH(anchoContenedor/cantidadDeBarras,"vw") + "vw";
        barraContenedora.style.height = "100%";
        barraContenedora.style.borderRight = (i==cantidadDeBarras-1)?"none":`1px solid ${colorContornos}`;
        barraContenedora.style.backgroundImage = `linear-gradient(to top,${colorFondo} 0%,${colorFondo} 50%,transparent 50%)`

        contenedor.appendChild(barraContenedora);
    }
    

    return matrizValores;

}

var barras = insertarGraficoDeBarrasInteractiva
(
    document.getElementById('cont-barras'),
    11,
    -1,
    1,
    "rgb(184, 133, 112)",
    "rgb(154, 103, 82)"

)