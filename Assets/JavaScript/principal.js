const ENTORNO_AUDIO = new AudioContext();

let nodoSalidaSintetizador = ENTORNO_AUDIO.createGain();
let nodoCompresorSintetizador = ENTORNO_AUDIO.createDynamicsCompressor();



// let h = new Map;

// h.set(3,"juanito")
// h.set(5)


// console.log(h)
// h.forEach((valor,clave)=>{
//     console.log(clave);
// })


// console.log(h.get(3));
