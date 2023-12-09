// const DRUMS = document.querySelectorAll("audio.drum");

// let audioBuffer;

// fetch("Assets/Wav/Kick.wav")
//   .then((response) => response.arrayBuffer())
//   .then((data) => ENTORNO_AUDIO.decodeAudioData(data))
//   .then((decodedBuffer) => {
//     audioBuffer = decodedBuffer;
//   })
//   .then(() => {

//         const audioBufferSourceNode = ENTORNO_AUDIO.createBufferSource();
//         audioBufferSourceNode.buffer = audioBuffer;
//         audioBufferSourceNode.play();

//   });


const DRUMS = document.querySelectorAll("audio.drum");

const ctx = new AudioContext();

fetch("Assets/Wav/Snare.wav")
  .then((response) => response.arrayBuffer())
  .then((data) => {
    console.log(data);
    return ctx.decodeAudioData(data);
  })
  .then((decodedBuffer) => {
    // Create a new audio buffer source node for each click
    const audioBufferSourceNode = ctx.createBufferSource();
    audioBufferSourceNode.buffer = decodedBuffer;
    // Now, audioBufferSourceNode will have the play function
    audioBufferSourceNode.connect(ctx.destination); // Connect to the audio context destination
    audioBufferSourceNode.start(); // Use start instead of play

    // Optionally, if you want to stop the audio after a certain time, you can use the following:
    // audioBufferSourceNode.stop(ENTORNO_AUDIO.currentTime + durationInSeconds);

    setInterval(()=>{
        const audioBufferSourceNode = ctx.createBufferSource();
    audioBufferSourceNode.buffer = decodedBuffer;
    // Now, audioBufferSourceNode will have the play function
    audioBufferSourceNode.connect(ctx.destination); // Connect to the audio context destination
    audioBufferSourceNode.start(); // Use start instead of play
    }, 450)

  })
  .catch((error) => {
    console.error("Error loading audio:", error);
  });


