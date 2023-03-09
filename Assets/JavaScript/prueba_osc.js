window.onload=function(){


//SINTETIZADOR**************************************************************************************

    var tipo_onda_1;
    var selector_tipo_onda = document.getElementById("")
    var detune_1_slider = document.getElementById("detune_1");
    var voces_1_slider = document.getElementById("Voces_osc_1");
    
    var tipo_onda_2;
    var detune_2_slider = document.getElementById("detune_2");
    var voces_2_slider = document.getElementById("Voces_osc_2");

    var tipo_filtro;
    const actx = new (AudioContext||webkitAudioContext)();
    var filtro_sintetizador = actx.createBiquadFilter();
    var frecuencia_filtro = document.getElementById("Filtro_Frecuencia");
    var factorq_filtro = document.getElementById("Filtro_Factor_Q");
    var maximo_tiempo_de_duracion_parametros_adsr = 4;//Segundos
    var ataque_amplificador_slider = document.getElementById("Amp_Attack");
    var decaimiento_amplificador_slider = document.getElementById("Amp_Decay");
    var sostenimiento_amplificador_slider = document.getElementById("Amp_Sustain");
    var relajamiento_amplificador_slider = document.getElementById("Amp_Release");
    var duracion_reverb_decay = document.getElementById("Duracion_Reverb_Decay");
    var paneo_slider = document.getElementById("Panorama");
    var volumen_maestro_slider= document.getElementById("volumen_master");
    var tiempo_entre_repeticiones_slider = document.getElementById("Tiempo_entre_repeticiones");
    var feedback_eco_slider = document.getElementById("feedback_eco");
    var Nodo_de_Paneo = actx.createStereoPanner();
    var convolver = new ConvolverNode(actx);
    var Nodo_volumen_maestro = actx.createGain();
    var delay= new DelayNode(actx,{delayTime:0.08});
    var feedback= new GainNode(actx,{gain:0.8});
    var duracion_Ataque;
    var final_Ataque;
    var duracion_Decay;
    var duracion_Release;
    var final_Release;
    var hora_de_inicio_de_presion_de_una_nota;
    var impulse;
    var hora_de_final_de_presion_de_una_nota;
    const nodo_ganancia_para_aplicar_adsr = actx.createGain();
    var volumen_Antes_de_soltar;
    
    var bombo_audio = document.getElementById("bombo_audio");
    var snare_audio = document.getElementById("snare_audio");
    var snare2_audio = document.getElementById("snare2_audio");
    var hithat_audio = document.getElementById("hithat_audio");
    var clap_audio = document.getElementById("clap_audio");
    var shakers_audio = document.getElementById("shakers_audio");

    var bombo_track = actx.createMediaElementSource(document.getElementById("bombo_audio"));
    var snare_track = actx.createMediaElementSource(document.getElementById("snare_audio"));
    var snare2_track = actx.createMediaElementSource(document.getElementById("snare2_audio"));
    var hithat_track = actx.createMediaElementSource(document.getElementById("hithat_audio"));
    var clap_track = actx.createMediaElementSource(document.getElementById("clap_audio"));
    var shakers_track = actx.createMediaElementSource(document.getElementById("shakers_audio"));
    var volumen_slider_bateria = document.getElementById("volumen_bateria_slider");
    var nodo_ganancia_bateria = actx.createGain();

    var nodo_bombo = actx.createGain();
    var nodo_snare = actx.createGain();
    var nodo_snare2 = actx.createGain();
    var nodo_hithat = actx.createGain();
    var nodo_clap = actx.createGain();
    var nodo_shakers = actx.createGain();

    //Conectando los elementos de bateria al nodo de ganancia
    nodo_ganancia_bateria.connect(actx.destination);
    nodo_ganancia_bateria.gain.value=1; 

    bombo_track.connect(nodo_bombo);
    nodo_bombo.gain.value = 1;

    snare_track.connect(nodo_snare);
    nodo_snare.gain.value = 1;

    snare2_track.connect(nodo_snare2);
    nodo_snare2.gain.value = 1.2;

    hithat_track.connect(nodo_hithat);
    nodo_hithat.gain.value = 1.4;

    clap_track.connect(nodo_clap);
    nodo_clap.gain.value = 1.2;

    shakers_track.connect(nodo_shakers);
    nodo_shakers.gain.value = 0.8;

    nodo_bombo.connect(nodo_ganancia_bateria);
    nodo_snare.connect(nodo_ganancia_bateria);
    nodo_snare2.connect(nodo_ganancia_bateria);
    nodo_hithat.connect(nodo_ganancia_bateria);
    nodo_clap.connect(nodo_ganancia_bateria);
    nodo_shakers.connect(nodo_ganancia_bateria);

    nodo_ganancia_bateria.gain.value = 0.85;

    volumen_slider_bateria.addEventListener('input',()=>{
        nodo_ganancia_bateria.gain.value = (volumen_slider_bateria.value/100) * 1.7;

    })
    
    
    //Conectando el filtro al nodo de ganancia para aplicar ADSR
    
    nodo_ganancia_para_aplicar_adsr.connect(filtro_sintetizador);
    filtro_sintetizador.connect(Nodo_volumen_maestro);
    filtro_sintetizador.connect(convolver);
    convolver.connect(Nodo_volumen_maestro);
    Nodo_volumen_maestro.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(Nodo_de_Paneo);
    Nodo_volumen_maestro.connect(Nodo_de_Paneo);
    Nodo_de_Paneo.connect(actx.destination);

/*
    tone.connect(toneGain)
toneGain.connect(delay)
delay.connect(feedback)
feedback.connect(delay)
delay.connect(actx.destination)*/
    //==================================================================================================
    // Analizador
    var analyser = actx.createAnalyser();

    Nodo_de_Paneo.connect(analyser);

    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var osc = document.getElementById('Analizador');
    var oscCtx = osc.getContext('2d');
    oscCtx.clearRect(0,0,osc.width,osc.height);

    function drawosc(){
        var drawVisual = requestAnimationFrame(drawosc);

        analyser.getByteTimeDomainData(dataArray);
        oscCtx.fillStyle = 'rgb(0,255,255)';
        oscCtx.fillRect(0,0,osc.width,osc.height);
        oscCtx.lineWidth = 2;
        oscCtx.strokeStyle = 'rgb(0,0,0)';
        oscCtx.beginPath();
        var sliceWidth = osc.width * 1.0 /bufferLength;
        var x = 0;
        for(var i =0; i < bufferLength; i++){
            var v = dataArray[i]/128.0;
            var y = v * osc.height/2;

            if(i ===0){
                oscCtx.moveTo(x,y);
            }else{
                oscCtx.lineTo(x,y);
            }
            x += sliceWidth;
        }
        oscCtx.lineTo(osc.width,osc.height/2);
        oscCtx.stroke();
    };
    drawosc();

    //========================================================
//REBERB
    function impulseResponse(duration,decay) {
        var length = actx.sampleRate * duration;
        var impulse;
        impulse = actx.createBuffer(2,length,actx.sampleRate);
        var IR = impulse.getChannelData(0);
        for (var i=0;i<length;i++) IR[i] = (2*Math.random()-1)*Math.pow(1-i/length,decay);
        return impulse;
    }

/*
    duracion_reverb_decay.oninput = function(){
        impulse = impulseResponse(duracion_reverb_decay.value,1);
        convolver.buffer = impulse;
    }
*/
//==============================================================

    
    paneo_slider.oninput = function(){
        Nodo_de_Paneo.pan.value = paneo_slider.value;
    }

    function validando_radio_tipo_onda_1() {
        
        for(var i=0;i<document.Controles_sintetizador.BTNTipo_de_onda_osc_1.length;i++){

            if(document.Controles_sintetizador.BTNTipo_de_onda_osc_1[i].checked){
                tipo_onda_1=document.Controles_sintetizador.BTNTipo_de_onda_osc_1[i].value;
            }
        }
    };

    function validando_radio_tipo_onda_2() {
        
        for(var i=0;i<document.Controles_sintetizador.BTNTipo_de_onda_osc_2.length;i++){

            if(document.Controles_sintetizador.BTNTipo_de_onda_osc_2[i].checked){
                tipo_onda_2=document.Controles_sintetizador.BTNTipo_de_onda_osc_2[i].value;
            }
        }
    };

    function validando_radio_tipo_filtro_y_creando_filtro(){
        for(var i=0;i<document.Controles_sintetizador.BTNTipo_Filtro.length;i++){

            if(document.Controles_sintetizador.BTNTipo_Filtro[i].checked){
                tipo_filtro=document.Controles_sintetizador.BTNTipo_Filtro[i].value;
            }
            
        }

        filtro_sintetizador.type = tipo_filtro;
        filtro_sintetizador.frequency.value =frecuencia_filtro.value ;
        filtro_sintetizador.Q.value = factorq_filtro.value*0.3;
        filtro_sintetizador.gain.value = 0;
    }

    //Cada vez que se modifique el valor del deslizador de frecuencia o el deslizador de factor q  de filtro
    //se modificaran los valores del objeto tambien
    frecuencia_filtro.addEventListener('oninput',validando_radio_tipo_filtro_y_creando_filtro());
    factorq_filtro.addEventListener('oninput',validando_radio_tipo_filtro_y_creando_filtro());
    for(var i=0;i<document.Controles_sintetizador.BTNTipo_de_onda_osc_2.length;i++){
        document.Controles_sintetizador.BTNTipo_Filtro[i].addEventListener('click',validando_radio_tipo_filtro_y_creando_filtro());
    }


const todas_las_teclas_blancas = document.getElementById('todas_las_teclas_blancas');

    todas_las_teclas_blancas.childNodes.forEach((tecla_blanca)=>{

    var num_voces_osc_1;
    var detune_osc_1;
    var osc_bank_1;
    var hay_voces_en_oscilador_2;
    var num_voces_osc_2;
    var detune_osc_2;
    var osc_bank_2;

        tecla_blanca.addEventListener('mousedown',()=>{
            Nodo_de_Paneo.pan.value = paneo_slider.value;
            Nodo_volumen_maestro.gain.value = volumen_maestro_slider.value/250; 

            setTimeout(()=>{
                impulse = impulseResponse(duracion_reverb_decay.value,1);
                convolver.buffer = impulse;
            }, 1);

            delay.delayTime.value = tiempo_entre_repeticiones_slider.value
            feedback.gain.value = feedback_eco_slider.value;

            //Desactivando voces del oscilador 1
            for(var i=0;i<num_voces_osc_1;i++){
                osc_bank_1[i].stop();
            }

            //Desactivando voces del oscilador 2 si las hay
            if(hay_voces_en_oscilador_2){
                for(var i=0;i<num_voces_osc_2;i++){
                    osc_bank_2[i].stop();
                }
            }

            //Variables oscilador 1
            num_voces_osc_1 = document.getElementById("Voces_osc_1").value;
            detune_osc_1 = document.getElementById("detune_1").value;
            

            //Variables Oscilador 2
            num_voces_osc_2 = document.getElementById("Voces_osc_2").value;
            detune_osc_2 = document.getElementById("detune_2").value;

            //Rellenando la variable para saber si el oscilador 2 esta activo o no

            hay_voces_en_oscilador_2 = (num_voces_osc_2!=0);

            //Obteniendo los tipos de onda
            validando_radio_tipo_onda_1();
            validando_radio_tipo_onda_2();

            //Obteniendo el tipo de filtro y creando el filtro
            validando_radio_tipo_filtro_y_creando_filtro();

            //Iniciando todas las voces del oscilador 1

            osc_bank_1 = new Array(num_voces_osc_1);

            for(var i=0;i<num_voces_osc_1;i++){

                var desafinacion = detune_osc_1;

                if(i==0){

                    osc_bank_1[i] = actx.createOscillator();
                    osc_bank_1[i].type = tipo_onda_1;
                    osc_bank_1[i].frequency.value=tecla_blanca.dataset.frecuency;
                    osc_bank_1[i].detune.value=0;
                    osc_bank_1[i].start();
                    osc_bank_1[i].connect(nodo_ganancia_para_aplicar_adsr);

                }else{

                    if(i%2!=0){

                        osc_bank_1[i] = actx.createOscillator();
                        osc_bank_1[i].type = tipo_onda_1;
                        osc_bank_1[i].frequency.value=tecla_blanca.dataset.frecuency;
                        osc_bank_1[i].detune.value=desafinacion;
                        osc_bank_1[i].start();
                        osc_bank_1[i].connect(nodo_ganancia_para_aplicar_adsr);

                    }else{

                        osc_bank_1[i] = actx.createOscillator();
                        osc_bank_1[i].type = tipo_onda_1;
                        osc_bank_1[i].frequency.value=tecla_blanca.dataset.frecuency;
                        osc_bank_1[i].detune.value=-desafinacion;
                        osc_bank_1[i].start();
                        osc_bank_1[i].connect(nodo_ganancia_para_aplicar_adsr);
                        desafinacion = desafinacion/2;
                    }

                }  
            };
            

            //Inicializando las voces del oscilador 2 si es que las hay

            if(hay_voces_en_oscilador_2){

                osc_bank_2 = new Array(num_voces_osc_2);

                for(var i=0;i<num_voces_osc_2;i++){

                    var desafinacion = detune_osc_2;
    
                    if(i==0){
    
                        osc_bank_2[i] = actx.createOscillator();
                        osc_bank_2[i].type = tipo_onda_2;
                        osc_bank_2[i].frequency.value=tecla_blanca.dataset.frecuency;
                        osc_bank_2[i].detune.value=0;
                        osc_bank_2[i].start();
                        osc_bank_2[i].connect(nodo_ganancia_para_aplicar_adsr);
    
                    }else{
    
                        if(i%2!=0){
    
                            osc_bank_2[i] = actx.createOscillator();
                            osc_bank_2[i].type = tipo_onda_2;
                            osc_bank_2[i].frequency.value=tecla_blanca.dataset.frecuency;
                            osc_bank_2[i].detune.value=desafinacion;
                            osc_bank_2[i].start();
                            osc_bank_2[i].connect(nodo_ganancia_para_aplicar_adsr);
                        }else{
    
                            osc_bank_2[i] = actx.createOscillator();
                            osc_bank_2[i].type = tipo_onda_2;
                            osc_bank_2[i].frequency.value=tecla_blanca.dataset.frecuency;
                            osc_bank_2[i].detune.value=-desafinacion;
                            osc_bank_2[i].start();
                            osc_bank_2[i].connect(nodo_ganancia_para_aplicar_adsr);
    
                            desafinacion = desafinacion/2;
                        }
    
                    }

                } 
            };

            
            //INICIANDO AMPLIFICADOR ADSR

            nodo_ganancia_para_aplicar_adsr.gain.cancelScheduledValues(actx.currentTime);
            hora_de_inicio_de_presion_de_una_nota = actx.currentTime;
            duracion_Ataque = (ataque_amplificador_slider.value/100)* maximo_tiempo_de_duracion_parametros_adsr;
            final_Ataque = hora_de_inicio_de_presion_de_una_nota + duracion_Ataque;
            duracion_Decay = (decaimiento_amplificador_slider.value/100)*maximo_tiempo_de_duracion_parametros_adsr;
            //Ataque
            nodo_ganancia_para_aplicar_adsr.gain.setValueAtTime(0,hora_de_inicio_de_presion_de_una_nota);
            nodo_ganancia_para_aplicar_adsr.gain.linearRampToValueAtTime(0.5,final_Ataque);
            //Decay + Sustain
            nodo_ganancia_para_aplicar_adsr.gain.setTargetAtTime((sostenimiento_amplificador_slider.value)/100,final_Ataque,duracion_Decay);
        

        });

        tecla_blanca.addEventListener('mouseout',()=>{

            volumen_Antes_de_soltar = nodo_ganancia_para_aplicar_adsr.gain.value;

            nodo_ganancia_para_aplicar_adsr.gain.cancelScheduledValues(actx.currentTime);
            hora_de_final_de_presion_de_una_nota = actx.currentTime;
            duracion_Release = (relajamiento_amplificador_slider.value/8000)* maximo_tiempo_de_duracion_parametros_adsr;
            final_Release = hora_de_final_de_presion_de_una_nota + duracion_Release;
            nodo_ganancia_para_aplicar_adsr.gain.setValueAtTime(volumen_Antes_de_soltar,hora_de_final_de_presion_de_una_nota);
            nodo_ganancia_para_aplicar_adsr.gain.linearRampToValueAtTime(0,final_Release);

                setTimeout(function(){
                    //Desactivando voces del oscilador 1

                    for(var i=0;i<num_voces_osc_1;i++){
                        osc_bank_1[i].stop();
                    }

                    //Desactivando voces del oscilador 2 si las hay
                    if(hay_voces_en_oscilador_2){
                        for(var i=0;i<num_voces_osc_2;i++){
                            osc_bank_2[i].stop();
                        }
                    }
                },duracion_Release*1000);

        });

        tecla_blanca.addEventListener('mouseup',()=>{

            volumen_Antes_de_soltar = nodo_ganancia_para_aplicar_adsr.gain.value;
            hora_de_final_de_presion_de_una_nota = actx.currentTime;
            nodo_ganancia_para_aplicar_adsr.gain.cancelScheduledValues(actx.currentTime);
            duracion_Release = (relajamiento_amplificador_slider.value/100)* maximo_tiempo_de_duracion_parametros_adsr;
            final_Release = hora_de_final_de_presion_de_una_nota + duracion_Release;
            nodo_ganancia_para_aplicar_adsr.gain.setValueAtTime(volumen_Antes_de_soltar,hora_de_final_de_presion_de_una_nota);
            nodo_ganancia_para_aplicar_adsr.gain.linearRampToValueAtTime(0,final_Release);

                setTimeout(function(){
                    //Desactivando voces del oscilador 1
                    for(var i=0;i<num_voces_osc_1;i++){
                        osc_bank_1[i].stop();
                    }

                    //Desactivando voces del oscilador 2 si las hay
                    if(hay_voces_en_oscilador_2){
                        for(var i=0;i<num_voces_osc_2;i++){
                            osc_bank_2[i].stop();
                        }
                    }
                },duracion_Release*1000);

        });

    });






    todas_las_teclas_negras=document.getElementById('todas_las_teclas_negras');

    todas_las_teclas_negras.childNodes.forEach((tecla_negra)=>{
        
        var num_voces_osc_1;
        var detune_osc_1;
        var osc_bank_1;
        var hay_voces_en_oscilador_2;
        var num_voces_osc_2;
        var detune_osc_2;
        var osc_bank_2;
    
            tecla_negra.addEventListener('mousedown',()=>{
                Nodo_de_Paneo.pan.value = paneo_slider.value;
                Nodo_volumen_maestro.gain.value = volumen_maestro_slider.value/250; 
    
                setTimeout(()=>{
                    impulse = impulseResponse(duracion_reverb_decay.value,1);
                    convolver.buffer = impulse;
                }, 1);
    
                delay.delayTime.value = tiempo_entre_repeticiones_slider.value
                feedback.gain.value = feedback_eco_slider.value;
    
                //Desactivando voces del oscilador 1
                for(var i=0;i<num_voces_osc_1;i++){
                    osc_bank_1[i].stop();
                }
    
                //Desactivando voces del oscilador 2 si las hay
                if(hay_voces_en_oscilador_2){
                    for(var i=0;i<num_voces_osc_2;i++){
                        osc_bank_2[i].stop();
                    }
                }
    
                //Variables oscilador 1
                num_voces_osc_1 = document.getElementById("Voces_osc_1").value;
                detune_osc_1 = document.getElementById("detune_1").value;
                
    
                //Variables Oscilador 2
                num_voces_osc_2 = document.getElementById("Voces_osc_2").value;
                detune_osc_2 = document.getElementById("detune_2").value;
    
                //Rellenando la variable para saber si el oscilador 2 esta activo o no
    
                hay_voces_en_oscilador_2 = (num_voces_osc_2!=0);
    
                //Obteniendo los tipos de onda
                validando_radio_tipo_onda_1();
                validando_radio_tipo_onda_2();
    
                //Obteniendo el tipo de filtro y creando el filtro
                validando_radio_tipo_filtro_y_creando_filtro();
    
                //Iniciando todas las voces del oscilador 1
    
                osc_bank_1 = new Array(num_voces_osc_1);
    
                for(var i=0;i<num_voces_osc_1;i++){
    
                    var desafinacion = detune_osc_1;
    
                    if(i==0){
    
                        osc_bank_1[i] = actx.createOscillator();
                        osc_bank_1[i].type = tipo_onda_1;
                        osc_bank_1[i].frequency.value=tecla_negra.dataset.frecuency;
                        osc_bank_1[i].detune.value=0;
                        osc_bank_1[i].start();
                        osc_bank_1[i].connect(nodo_ganancia_para_aplicar_adsr);
    
                    }else{
    
                        if(i%2!=0){
    
                            osc_bank_1[i] = actx.createOscillator();
                            osc_bank_1[i].type = tipo_onda_1;
                            osc_bank_1[i].frequency.value=tecla_negra.dataset.frecuency;
                            osc_bank_1[i].detune.value=desafinacion;
                            osc_bank_1[i].start();
                            osc_bank_1[i].connect(nodo_ganancia_para_aplicar_adsr);
    
                        }else{
    
                            osc_bank_1[i] = actx.createOscillator();
                            osc_bank_1[i].type = tipo_onda_1;
                            osc_bank_1[i].frequency.value=tecla_negra.dataset.frecuency;
                            osc_bank_1[i].detune.value=-desafinacion;
                            osc_bank_1[i].start();
                            osc_bank_1[i].connect(nodo_ganancia_para_aplicar_adsr);
                            desafinacion = desafinacion/2;
                        }
    
                    }  
                };
                
    
                //Inicializando las voces del oscilador 2 si es que las hay
    
                if(hay_voces_en_oscilador_2){
    
                    osc_bank_2 = new Array(num_voces_osc_2);
    
                    for(var i=0;i<num_voces_osc_2;i++){
    
                        var desafinacion = detune_osc_2;
        
                        if(i==0){
        
                            osc_bank_2[i] = actx.createOscillator();
                            osc_bank_2[i].type = tipo_onda_2;
                            osc_bank_2[i].frequency.value=tecla_negra.dataset.frecuency;
                            osc_bank_2[i].detune.value=0;
                            osc_bank_2[i].start();
                            osc_bank_2[i].connect(nodo_ganancia_para_aplicar_adsr);
        
                        }else{
        
                            if(i%2!=0){
        
                                osc_bank_2[i] = actx.createOscillator();
                                osc_bank_2[i].type = tipo_onda_2;
                                osc_bank_2[i].frequency.value=tecla_negra.dataset.frecuency;
                                osc_bank_2[i].detune.value=desafinacion;
                                osc_bank_2[i].start();
                                osc_bank_2[i].connect(nodo_ganancia_para_aplicar_adsr);
                            }else{
        
                                osc_bank_2[i] = actx.createOscillator();
                                osc_bank_2[i].type = tipo_onda_2;
                                osc_bank_2[i].frequency.value=tecla_negra.dataset.frecuency;
                                osc_bank_2[i].detune.value=-desafinacion;
                                osc_bank_2[i].start();
                                osc_bank_2[i].connect(nodo_ganancia_para_aplicar_adsr);
        
                                desafinacion = desafinacion/2;
                            }
        
                        }
    
                    } 
                };
    
                
                //INICIANDO AMPLIFICADOR ADSR
    
                nodo_ganancia_para_aplicar_adsr.gain.cancelScheduledValues(actx.currentTime);
                hora_de_inicio_de_presion_de_una_nota = actx.currentTime;
                duracion_Ataque = (ataque_amplificador_slider.value/100)* maximo_tiempo_de_duracion_parametros_adsr;
                final_Ataque = hora_de_inicio_de_presion_de_una_nota + duracion_Ataque;
                duracion_Decay = (decaimiento_amplificador_slider.value/100)*maximo_tiempo_de_duracion_parametros_adsr;
                //Ataque
                nodo_ganancia_para_aplicar_adsr.gain.setValueAtTime(0,hora_de_inicio_de_presion_de_una_nota);
                nodo_ganancia_para_aplicar_adsr.gain.linearRampToValueAtTime(0.5,final_Ataque);
                //Decay + Sustain
                nodo_ganancia_para_aplicar_adsr.gain.setTargetAtTime((sostenimiento_amplificador_slider.value)/100,final_Ataque,duracion_Decay);
            
    
            });
    
            tecla_negra.addEventListener('mouseout',()=>{
    
                volumen_Antes_de_soltar = nodo_ganancia_para_aplicar_adsr.gain.value;
    
                nodo_ganancia_para_aplicar_adsr.gain.cancelScheduledValues(actx.currentTime);
                hora_de_final_de_presion_de_una_nota = actx.currentTime;
                duracion_Release = (relajamiento_amplificador_slider.value/8000)* maximo_tiempo_de_duracion_parametros_adsr;
                final_Release = hora_de_final_de_presion_de_una_nota + duracion_Release;
                nodo_ganancia_para_aplicar_adsr.gain.setValueAtTime(volumen_Antes_de_soltar,hora_de_final_de_presion_de_una_nota);
                nodo_ganancia_para_aplicar_adsr.gain.linearRampToValueAtTime(0,final_Release);
    
                    setTimeout(function(){
                        //Desactivando voces del oscilador 1
    
                        for(var i=0;i<num_voces_osc_1;i++){
                            osc_bank_1[i].stop();
                        }
    
                        //Desactivando voces del oscilador 2 si las hay
                        if(hay_voces_en_oscilador_2){
                            for(var i=0;i<num_voces_osc_2;i++){
                                osc_bank_2[i].stop();
                            }
                        }
                    },duracion_Release*1000);
    
            });
    
            tecla_negra.addEventListener('mouseup',()=>{
    
                volumen_Antes_de_soltar = nodo_ganancia_para_aplicar_adsr.gain.value;
                hora_de_final_de_presion_de_una_nota = actx.currentTime;
                nodo_ganancia_para_aplicar_adsr.gain.cancelScheduledValues(actx.currentTime);
                duracion_Release = (relajamiento_amplificador_slider.value/100)* maximo_tiempo_de_duracion_parametros_adsr;
                final_Release = hora_de_final_de_presion_de_una_nota + duracion_Release;
                nodo_ganancia_para_aplicar_adsr.gain.setValueAtTime(volumen_Antes_de_soltar,hora_de_final_de_presion_de_una_nota);
                nodo_ganancia_para_aplicar_adsr.gain.linearRampToValueAtTime(0,final_Release);
    
                    setTimeout(function(){
                        //Desactivando voces del oscilador 1
                        for(var i=0;i<num_voces_osc_1;i++){
                            osc_bank_1[i].stop();
                        }
    
                        //Desactivando voces del oscilador 2 si las hay
                        if(hay_voces_en_oscilador_2){
                            for(var i=0;i<num_voces_osc_2;i++){
                                osc_bank_2[i].stop();
                            }
                        }
                    },duracion_Release*1000);
    
            });
    });

//EMPAQUETADOR DE PRESETS

    var boton_guardar_presets = document.getElementById("Boton_guardar_preset");
    var contenedor_presets_ocultos = document.getElementById("Contenedor_presets_ocultas");

    boton_guardar_presets.addEventListener('mousemove',()=>{

        var preset_contenido = "(";

        validando_radio_tipo_onda_1();
        preset_contenido += tipo_onda_1 + ",";
        preset_contenido += voces_1_slider.value +","
        preset_contenido += detune_1_slider.value + ",";
        validando_radio_tipo_filtro_y_creando_filtro();
        preset_contenido += tipo_filtro +",";
        preset_contenido += frecuencia_filtro.value + ",";
        preset_contenido += factorq_filtro.value + ",";
        preset_contenido += ataque_amplificador_slider.value +",";
        preset_contenido += decaimiento_amplificador_slider.value + ",";
        preset_contenido += sostenimiento_amplificador_slider.value + ",";
        preset_contenido += relajamiento_amplificador_slider.value + ",";
        preset_contenido += duracion_reverb_decay.value + ",";
        preset_contenido += tiempo_entre_repeticiones_slider.value +",";
        preset_contenido += feedback_eco_slider.value + ",";
        preset_contenido += paneo_slider.value + ",";
        validando_radio_tipo_onda_2();
        preset_contenido += tipo_onda_2 + ",";
        preset_contenido += detune_2_slider.value + ","
        preset_contenido += voces_2_slider.value + ")";

        contenedor_presets_ocultos.value = preset_contenido;
        console.log(contenedor_presets_ocultos.value);
    })

//PRESETS DE REGALO

    const Todos_los_Presets_de_regalo = document.querySelectorAll(".Preset_regalo");

//SUPERSAW
Todos_los_Presets_de_regalo[0].setAttribute("data-preset",
"(sawtooth,4,-20,allpass,600,0,0,0,100,0,0,0,0,0,sine,0,0)");

//LEAD CUADRADO
Todos_los_Presets_de_regalo[1].setAttribute("data-preset",
"(square,6,-14,allpass,600,0,0,0,100,0,0.9,0,0,0,triangle,-15,2)");

//SAW FILTRADO
Todos_los_Presets_de_regalo[2].setAttribute("data-preset",
"(sawtooth,4,-7,notch,600,0.1,0,0,100,0,0.01,0,0,0,square,-9,2)");


//DESEMPAQUETADOR DE PRESETS

    var combobox_presets = document.getElementById("Combo_de_PRESETS");
    var boton_insertor_presets = document.getElementById("Boton_insercion_preset");
    
    boton_insertor_presets.addEventListener("click",()=>{

        var preset_contenido = Todos_los_Presets_de_regalo[combobox_presets.value].dataset.preset;
        var acumulador = 1;
        var parametro = "";

        //Recorriendo todo el string del preset
        for(var i=1;i<preset_contenido.length;i++){

            if(preset_contenido[i]!=","&&preset_contenido[i]!=")"){
                parametro += preset_contenido[i];
            }else{
                
                switch (acumulador) {

                    case 1:

                    const todas_las_opciones_onda_1 = document.querySelectorAll('input[name="BTNTipo_de_onda_osc_1"]');

                    var valor_onda_1;
                        
                        switch (parametro) {
                            case "sine":
                                valor_onda_1 = 0;
                                break;
                            case "square":
                                valor_onda_1 = 1;
                                break;
                            case "triangle":
                                valor_onda_1 = 2;
                                break;
                            case "sawtooth":
                                valor_onda_1 = 3;
                                break;
                        }    
                    
                    todas_las_opciones_onda_1[valor_onda_1].checked = true;

                    break;
                
                    case 2:

                        voces_1_slider.value = parseFloat(parametro);
                        
                    break;

                    case 3:
                    
                        detune_1_slider.value = parseFloat(parametro);

                    break;

                    case 4:
                    
                        const todas_las_opciones_filtro = document.querySelectorAll('input[name="BTNTipo_Filtro"]');

                        var filtro_valor;

                        switch (parametro) {
                            case "lowpass":
                                filtro_valor = 0;
                                break;
                            case "highpass":
                                filtro_valor = 1;
                                break;
                            case "bandpass":
                                filtro_valor = 2;
                                break;
                            case "notch":
                                filtro_valor = 3;
                                break;
                            case "allpass":
                                filtro_valor = 4;
                                break;
                        }    

                        todas_las_opciones_filtro[filtro_valor].checked = true;

                    break;
                
                    case 5:
                        
                        frecuencia_filtro.value = parseFloat(parametro);

                    break;

                    case 6:

                        factorq_filtro.value = parseFloat(parametro);
                        
                    break;

                    case 7:
                        
                        ataque_amplificador_slider.value = parseFloat(parametro);

                    break;
                
                    case 8:

                        decaimiento_amplificador_slider.value = parseFloat(parametro);
                        
                    break;

                    case 9:
                        
                        sostenimiento_amplificador_slider.value = parseFloat(parametro);

                    break;

                    case 10:
                        
                        relajamiento_amplificador_slider.value = parseFloat(parametro);

                    break;
                
                    case 11:
                        
                        duracion_reverb_decay.value = parseFloat(parametro);

                    break;

                    case 12:
                        
                        tiempo_entre_repeticiones_slider.value = parseFloat(parametro);

                    break;

                    case 13:
                        
                        feedback_eco_slider.value = parseFloat(parametro);

                    break;
                
                    case 14:
                        
                        paneo_slider.value = parseFloat(parametro);

                    break;

                    case 15:

                        const todas_las_opciones_onda_2 = document.querySelectorAll('input[name="BTNTipo_de_onda_osc_2"]');
                        var valor_onda_2;
                        
                        switch (parametro) {
                            case "sine":
                                valor_onda_2 = 0;
                                break;
                            case "square":
                                valor_onda_2 = 1;
                                break;
                            case "triangle":
                                valor_onda_2 = 2;
                                break;
                            case "sawtooth":
                                valor_onda_2 = 3;
                                break;
                        }    
                    
                    todas_las_opciones_onda_2[valor_onda_2].checked = true;

                    break;

                    case 16:
                        
                        detune_2_slider.value = parseFloat(parametro);

                    break;

                    case 17:
                        
                        voces_2_slider.value = parseFloat(parametro);

                    break;
                }
            
            parametro = "";
            acumulador++;

            }


        }



    })
    

//FINAL SINTETIZADOR******************************************************************************************



//SEQUENCIADOR DE MELODIAS

    function obtener_nota(id_elemento_cuadro_corchea){

        var nota="";
    
        for(var i=0;i<id_elemento_cuadro_corchea.length;i++){

            if(id_elemento_cuadro_corchea[i]!="-"){
                nota=nota+id_elemento_cuadro_corchea[i];
            }else{
                break;
            }
        
        }
    
        return nota;
    }

    function obtener_posicion(id_elemento_cuadro_corchea){

        var posicion="";

        for(var i=0;i<id_elemento_cuadro_corchea.length;i++){

            if(id_elemento_cuadro_corchea[i-1]=="-"){
                
                for(var e=i;e<id_elemento_cuadro_corchea.length;e++){
                    posicion=posicion+id_elemento_cuadro_corchea[e];
                }
        
            break;

            }
        
        }
    
        return parseInt(posicion);

    }

    function obtener_numero_de_elemento(nota,posicion){

        var numero_fila;
        var numero_columna = posicion;
        var nro_elemento;

        switch(nota){

            case "C7":
                numero_fila=1;
            break;

            case "B6":
                numero_fila=2;
            break;

            case "A#6":
                numero_fila=3;
            break;

            case "A6":
                numero_fila=4;
            break;

            case "G#6":
                numero_fila=5;
            break;

            case "G6":
                numero_fila=6;
            break;

            case "F#6":
                numero_fila=7;
            break;

            case "F6":
                numero_fila=8;
            break;

            case "E6":
                numero_fila=9;
            break;

            
            case "D#6":
                numero_fila=10;
            break;

            case "D6":
                numero_fila=11;
            break;

            case "C#6":
                numero_fila=12;
            break;

            case "C6":
                numero_fila=13;
            break;
            
            case "B5":
                numero_fila=14;
            break;

            case "A#5":
                numero_fila=15;
            break;

            case "A5":
                numero_fila=16;
            break;
            
            case "G#5":
                numero_fila=17;
            break;

            case "G5":
                numero_fila=18;
            break;

            case "F#5":
                numero_fila=19;
            break;

            case "F5":
                numero_fila=20;
            break;

            case "E5":
                numero_fila=21;
            break;

            case "D#5":
                numero_fila=22;
            break;

            case "D5":
                numero_fila=23;
            break;

            case "C#5":
                numero_fila=24;
            break;
            
            case "C5":
                numero_fila=25;
            break;

            case "B4":
                numero_fila=26;
            break;

            case "A#4":
                numero_fila=27;
            break;

            case "A4":
                numero_fila=28;
            break;

            case "G#4":
                numero_fila=29;
            break;

            case "G4":
                numero_fila=30;
            break;

            case "F#4":
                numero_fila=31;
            break;

            case "F4":
                numero_fila=32;
            break;

            case "E4":
                numero_fila=33;
            break;

            case "D#4":
                numero_fila=34;
            break;

            case "D4":
                numero_fila=35;
            break;

            case "C#4":
                numero_fila=36;
            break;

            case "C4":
                numero_fila=37;
            break;
        }
        
        nro_elemento = (numero_fila-1)*128 + numero_columna -1;

        return nro_elemento;
    }


    function obtener_primer_elemento_columna(numero_de_elemento){

    primer_elemento_columna = numero_de_elemento%128;

    return (primer_elemento_columna);

    }


    //Configuracion para poder graficar melodias

    const Todos_los_cuadros_semicorchea_melodia = document.querySelectorAll('.Cuadro_Semicorchea');

    var longitud_de_nota = document.getElementById("longitud_nota");

    Todos_los_cuadros_semicorchea_melodia.forEach((cuadro_semicorchea_melodia)=>{
        

        //Evento Click

        cuadro_semicorchea_melodia.addEventListener('click',()=>{

        var nombre_nota_a_activar = obtener_nota(cuadro_semicorchea_melodia.id);
        var columna_nota_a_activar = obtener_posicion(cuadro_semicorchea_melodia.id);
        var columnas_estan_libres =true;
        var numero_de_elemento = obtener_numero_de_elemento(nombre_nota_a_activar,columna_nota_a_activar);
        var primer_elemento_de_esta_columna = obtener_primer_elemento_columna(numero_de_elemento);


        cuadro_semicorchea_melodia.setAttribute('Longitud_Semicorcheas',longitud_de_nota.value);


            for(var c=0;c<longitud_de_nota.value;c++){
                
                for(var i=0;i<37;i++){
                
                    if(Todos_los_cuadros_semicorchea_melodia[primer_elemento_de_esta_columna+c+(128*i)].getAttribute('Activado')=="Si"){
                        columnas_estan_libres=false;
                    }

                }

            };


            if(columnas_estan_libres){

                //Para longitud 1
                if(longitud_de_nota.value==1){

                //Cuadro_Semicorchea_Activado
                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].classList.add("Cuadro_Semicorchea_Activado");
                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].setAttribute('Activado','Si');
                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].setAttribute('Inicio_de_nota','Si');

                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].addEventListener('mousedown',(e)=>{

                        if(e.which==3){
                            
                            Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].classList.remove("Cuadro_Semicorchea_Activado");
                            Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].setAttribute('Activado','No');
                            Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].setAttribute('Inicio_de_nota','No')
                            Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].removeAttribute('Longitud_Semicorcheas');

                        }

                    });

                //Para longitud mayor a 1
                }else{

                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].setAttribute('Inicial','Si');
                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].setAttribute('Inicio_de_nota','Si');

                    for(var consiguientes=0;consiguientes<longitud_de_nota.value;consiguientes++){

                        Todos_los_cuadros_semicorchea_melodia[numero_de_elemento+consiguientes].classList.add("Cuadro_Semicorcheas_Activado");
                        Todos_los_cuadros_semicorchea_melodia[numero_de_elemento+consiguientes].setAttribute('Activado','Si');
                        Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].setAttribute('columna_para_iniciar',columna_nota_a_activar);

                        var longitud = Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].getAttribute('Longitud_Semicorcheas');
    
                        Todos_los_cuadros_semicorchea_melodia[numero_de_elemento+consiguientes].addEventListener('mousedown',function(e){
                        
                            if(e.which==3){

                                Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].removeAttribute('Longitud_Semicorcheas');
                                Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].removeAttribute('Inicial','Si');
                                for(var consiguientes=0;consiguientes<longitud;consiguientes++){
                                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento+consiguientes].setAttribute('Activado','No');
                                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento+consiguientes].classList.remove("Cuadro_Semicorcheas_Activado");
                                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento+consiguientes].classList.remove("borde_izquierdo_sin_modificar");
                                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento+consiguientes].classList.remove("borde_derecho_sin_modificar");
                                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento+consiguientes].setAttribute('Inicio_de_nota','No');
                                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].removeAttribute('columna_para_iniciar');
                                }
                            }
                
                        });
                    
                        if(consiguientes==0){
                            Todos_los_cuadros_semicorchea_melodia[numero_de_elemento+consiguientes].classList.add("borde_izquierdo_sin_modificar");
                        };

                        if(consiguientes==longitud_de_nota.value-1){
                            Todos_los_cuadros_semicorchea_melodia[numero_de_elemento+consiguientes].classList.add("borde_derecho_sin_modificar");
                        };
    
                    };


                };


            }

        });

    });

    //BOTON BORRAR MELODIA***********************************************

    var boton_borrar_todo_melodia = document.getElementById("boton_borrar_todo_melodia");

    boton_borrar_todo_melodia.addEventListener('click',()=>{

        Todos_los_cuadros_semicorchea_melodia.forEach((cuadro_sem_melodia)=>{

            cuadro_sem_melodia.setAttribute('Activado','No');
            cuadro_sem_melodia.classList.remove('Cuadro_Semicorcheas_Activado');
            cuadro_sem_melodia.classList.remove('Cuadro_Semicorchea_Activado');
            cuadro_sem_melodia.removeAttribute('Longitud_Semicorcheas');
            cuadro_sem_melodia.removeAttribute('Inicial');
            cuadro_sem_melodia.removeAttribute('columna_para_iniciar');
            cuadro_sem_melodia.removeAttribute('Inicio_de_nota');
        });

    });
    //***************************************************************************** 

//MELODIAS DE REGALO***********************************************

    const Todas_las_melodias_de_regalo = document.querySelectorAll(".Melodia_regalo");


//NO MOVER NADA PLIS ;)


    //AVICCI - WAITING FOR LOVE
Todas_las_melodias_de_regalo[0].setAttribute('data-melodia',
"(F4-1,NULL-2,D#4-1,F4-1,NULL-2,D#4-1,\
F4-1,G#4-1,NULL-2,C5-1,NULL-1,D#5-1,NULL-1,\
F5-1,NULL-2,F5-1,D#5-1,NULL-2,D#5-1\
,C5-1,A#4-1,G#4-1,NULL-1,C5-1,NULL-1,D#5-1,NULL-1,\
F5-1,NULL-2,F5-1,G5-1,NULL-2,G#5-1,\
C5-1,A#4-1,G#4-1,NULL-1,C5-1,NULL-1,G#4-1,NULL-1,\
A#4-1,NULL-2,D#4-1,F4-1,NULL-2,D#4-1,\
F4-1,G#4-3,NULL-2,F4-1,NULL-1,\
F4-1,D#4-1,F4-1,G#4-1,F4-1)");


    //AVRIL LAVIGNE - COMPLICATED
    Todas_las_melodias_de_regalo[1].setAttribute('data-melodia',
"(E4-1,D4-1,E4-1,D4-1,E4-1,NULL-1,D4-1,E4-1,\
NULL-1,D4-1,E4-1,D4-1,E4-1,NULL-1,G4-1,D4-1,\
NULL-1,D4-1,NULL-5,D4-1,\
G4-1,NULL-1,F4-1,NULL-1,E4-1,NULL-1,D4-2,\
E4-1,D4-1,E4-1,D4-1,E4-1,NULL-1,D4-1,E4-1,\
NULL-1,D4-1,E4-1,D4-1,E4-1,NULL-1,G4-1,D4-1,\
NULL-1,D4-1,NULL-5,D4-1,\
G4-1,NULL-1,F4-1,NULL-1,E4-1,NULL-1,D4-2,\
C4-1,NULL-1,C4-1,G4-1,NULL-2,C4-1,NULL-1,\
C4-1,G4-1,NULL-2,C4-1,NULL-1,C4-1,NULL-1,\
G4-1,NULL-1,F4-1,NULL-1,E4-1,NULL-1,D4-1,NULL-1,\
E4-1,D4-1,E4-1,D4-1,E4-1,NULL-1,D4-1,E4-1,\
NULL-1,D4-1,E4-1,D4-1,E4-1,NULL-1,G4-1,D4-1,\
C4-5)");

    //MIKE POSNER - I TOOK A PILL IN IBIZA
    Todas_las_melodias_de_regalo[2].setAttribute('data-melodia',
"(G5-1,NULL-3,A5-1,NULL-3,\
C6-1,NULL-2,D6-1,NULL-2,D6-1,NULL-3,\
G5-1,NULL-1,A5-2,C6-1,NULL-3,\
C6-1,NULL-1,D6-2,E6-1,NULL-1,\
G5-1,NULL-3,A5-1,NULL-3,C6-1,\
NULL-2,D6-1,NULL-2,G5-2,NULL-16,\
G5-1,NULL-3,A5-1,NULL-3,\
C6-1,NULL-2,D6-1,NULL-2,D6-1,NULL-3,\
G5-1,NULL-1,A5-2,C6-1,NULL-3,\
C6-1,NULL-1,D6-2,E6-1,NULL-1,\
G5-1,NULL-3,A5-1,NULL-3,C6-1,\
NULL-2,D6-1,NULL-2,G5-2)");


    //MARSHMELLO - HAPPIER
    Todas_las_melodias_de_regalo[3].setAttribute('data-melodia',
"(NULL-2,C5-2,NULL-1,C5-2,NULL-1,\
C5-2,NULL-1,D5-3,E5-2,NULL-2,\
C5-2,NULL-1,C5-2,NULL-1,C5-2,NULL-1,\
G5-2,NULL-1,E5-2,NULL-2,C5-2,\
NULL-1,C5-2,NULL-1,C5-2,NULL-1,\
D5-2,NULL-1,E5-2,NULL-2,C5-2,\
NULL-1,C5-2,NULL-1,C5-2,NULL-1,\
B4-2,NULL-1,G4-2,NULL-2,C5-2,NULL-1,C5-2,NULL-1,\
C5-2,NULL-1,D5-3,E5-2,NULL-2,\
C5-2,NULL-1,C5-2,NULL-1,C5-2,NULL-1,\
G5-2,NULL-1,E5-2,NULL-2,C5-2,\
NULL-1,C5-2,NULL-1,C5-2,NULL-1,\
D5-2,NULL-1,E5-2,NULL-2,C5-2,\
NULL-1,C5-2,NULL-1,C5-2,NULL-1,\
B4-2,NULL-1,G4-2)");



    //JAMICROSS - BYE
    Todas_las_melodias_de_regalo[4].setAttribute('data-melodia',
"(C4-2,NULL-4,C4-2,\
E4-2,NULL-2,G4-2,NULL-2,\
A4-3,NULL-3,E4-1,NULL-1,\
C5-2,NULL-2,B4-2,B4-2,\
NULL-2,G4-2,D4-2,NULL-2,\
E4-2,D4-2,NULL-2,C4-2,\
C4-2,NULL-4,C4-2,\
E4-2,NULL-2,G4-2,NULL-2,\
A4-3,NULL-3,E4-2,C5-2,NULL-2,\
B4-2,B4-2,NULL-2,G4-2,\
NULL-2,D5-1,NULL-1,C5-1,NULL-1,A4-1,NULL-1,\
E4-1,NULL-1,C4-1,NULL-1,\
E4-2,D4-2,NULL-2,C4-2,C4-1)");


    //KYGO - STOLE THE SHOW
    Todas_las_melodias_de_regalo[5].setAttribute('data-melodia',
"(F#4-1,G#4-1,B4-1,NULL-2,B4-1,NULL-1,B4-1,\
NULL-1,B4-1,NULL-2,B4-1,NULL-1,B4-1,B4-1,\
F#4-1,G#4-1,B4-2,NULL-1,B4-1,NULL-1,B4-1,\
NULL-1,F#4-1,B4-1,F#4-1,D#5-1,C#5-1,B4-2,\
F#4-1,G#4-1,B4-1,NULL-2,B4-1,NULL-1,B4-1,\
NULL-1,B4-2,NULL-1,B4-1,NULL-1,B4-1,\
B4-1,F#4-1,G#4-1,B4-2,NULL-1,B4-1,\
NULL-1,B4-1,NULL-1,F#4-1,F#5-1,NULL-1,D#5-1,C#5-1,B4-1,NULL-1,\
F#4-1,G#4-1,B4-1,NULL-2,B4-1,NULL-1,B4-1,\
NULL-1,B4-1,NULL-2,B4-1,NULL-1,B4-1,B4-1,\
F#4-1,G#4-1,B4-2,NULL-1,B4-1,NULL-1,B4-1,\
NULL-1,F#4-1,B4-1,F#4-1,D#5-1,C#5-1,B4-2,\
F#4-1,G#4-1,B4-1,NULL-2,B4-1,NULL-1,B4-1,\
NULL-1,B4-2,NULL-1,B4-1,NULL-1,B4-1,\
B4-1,F#4-1,G#4-1,B4-2,NULL-1,B4-1,\
NULL-1,B4-1,NULL-1,F#4-1,F#5-1,NULL-1,D#5-1,C#5-1,B4-1)");

    //MAJOR LAZER -. LIGTH IT UP
    Todas_las_melodias_de_regalo[6].setAttribute('data-melodia',
"(E5-1,NULL-1,D5-1,C5-2,NULL-1,A4-1,NULL-1,\
A4-1,A4-1,NULL-1,A4-1,C5-1,NULL-1,A4-1,NULL-1,\
E5-1,NULL-1,D5-1,C5-2,NULL-1,A4-1,NULL-1,\
C5-1,D5-1,NULL-1,D5-1,E5-1,NULL-1,G5-1,NULL-1,E5-1,\
NULL-1,D5-1,C5-2,NULL-1,A4-1,NULL-1,A4-1,\
A4-1,NULL-1,A4-1,C5-1,NULL-1,A4-1,NULL-1,E5-1,\
NULL-1,D5-1,C5-2,NULL-1,A4-1,NULL-1,G4-1,\
A4-1,NULL-1,A4-1,A4-2,NULL-2,\
E5-1,NULL-1,D5-1,C5-2,NULL-1,A4-1,NULL-1,\
A4-1,A4-1,NULL-1,A4-1,C5-1,NULL-1,A4-1,NULL-1,\
E5-1,NULL-1,D5-1,C5-2,NULL-1,A4-1,NULL-1,\
C5-1,D5-1,NULL-1,D5-1,E5-1,NULL-1,G5-1,NULL-1,E5-1,\
NULL-1,D5-1,C5-2,NULL-1,A4-1,NULL-1,A4-1,\
A4-1,NULL-1,A4-1,C5-1,NULL-1,A4-1,NULL-1,E5-1,\
NULL-1,D5-1,C5-2,NULL-1,A4-1,NULL-1,G4-1,\
A4-1,NULL-1,A4-1,A4-2)");

    
    //LSD - GENIUS
    Todas_las_melodias_de_regalo[7].setAttribute('data-melodia',
"(C6-1,NULL-1,A#5-1,NULL-1,G#5-1,NULL-1,G5-1,NULL-1,\
F5-1,G5-1,NULL-1,C5-1,NULL-1,C5-1,C5-1,C5-1,\
C6-1,NULL-1,A#5-1,NULL-1,G#5-1,NULL-1,G5-1,NULL-1,\
F5-1,G5-1,NULL-1,C5-1,NULL-1,C5-1,C5-1,C5-1,\
C6-1,NULL-1,A#5-1,NULL-1,G#5-1,NULL-1,G5-1,NULL-1,\
F5-1,G5-1,NULL-1,C5-1,NULL-1,C5-1,C5-2,\
NULL-2,C6-1,C6-1,C6-1,C6-1,C6-1,NULL-1,\
C5-1,C6-1,NULL-1,C6-1,C6-1,C6-1,C6-1,NULL-1,\
C6-1,NULL-1,A#5-1,NULL-1,G#5-1,NULL-1,G5-1,NULL-1,\
F5-1,G5-1,NULL-1,C5-1,NULL-1,C5-1,C5-1,C5-1,\
C6-1,NULL-1,A#5-1,NULL-1,G#5-1,NULL-1,G5-1,NULL-1,\
F5-1,G5-1,NULL-1,C5-1,NULL-1,C5-1,C5-1,C5-1,\
C6-1,NULL-1,A#5-1,NULL-1,G#5-1,NULL-1,G5-1,NULL-1,\
F5-1,G5-1,NULL-1,C5-1,NULL-1,C5-1,C5-2,\
NULL-2,C6-1,C6-1,C6-1,C6-1,C6-1,NULL-1,\
C5-1,C6-1,NULL-1,C6-1,C6-1,C6-1,C6-1)");

    //KODALINE - SOMETIMES 
    Todas_las_melodias_de_regalo[8].setAttribute('data-melodia',
"(A5-2,B5-2,C#6-1,NULL-1,C#6-4,\
NULL-1,B5-1,A5-3,F#5-1,\
E5-3,NULL-1,\
A5-1,NULL-1,G#5-2,NULL-8,\
A5-2,B5-2,C#6-1,NULL-1,C#6-4,\
NULL-1,B5-1,A5-2,NULL-1,G#5-1,\
F#5-3,NULL-1,E5-2,F#5-4,NULL-6,\
A5-2,B5-2,C#6-1,NULL-1,C#6-3,NULL-1,\
B5-2,NULL-4,E6-1,NULL-1,E6-1,NULL-1,E6-2,\
B5-6,NULL-4,A5-2,B5-2,C#6-1,NULL-1,\
C#6-5,NULL-1,B5-4,A5-3,F#5-3,A5-4)");



    //iMAGINE DRAGONS - IT'S TIME
    Todas_las_melodias_de_regalo[9].setAttribute('data-melodia',
"(C5-1,NULL-1,C5-1,NULL-1,B4-2,C5-1,NULL-1,\
NULL-2,C5-2,B4-2,C5-1,NULL-3,\
C5-1,NULL-1,C5-1,NULL-1,C5-1,NULL-1,\
D5-1,NULL-1,D5-2,E5-3,NULL-1,\
C5-1,NULL-1,C5-2,B4-2,C5-1,NULL-3,\
C5-2,B4-2,C5-1,NULL-3,C5-1,NULL-1,C5-1,\
NULL-1,C5-1,NULL-1,D5-1,NULL-1,D5-2,\
E5-3,NULL-1,D5-2,NULL-1,C5-5,NULL-10,\
C5-1,NULL-1,C5-1,NULL-1,C5-1,NULL-1,F5-2,\
NULL-1,E5-2,NULL-1,D5-1,NULL-1,C5-6,NULL-9,D5-1,\
D5-1,NULL-1,D5-1,NULL-1,D5-1,NULL-1,D5-1,NULL-1,\
D5-1,NULL-1,C5-1,NULL-1,C5-2)");

    //DJ SNAKE - MIDDLE
    Todas_las_melodias_de_regalo[10].setAttribute('data-melodia',
"(C5-1,NULL-1,E5-2,D5-1,NULL-1,C5-1,C5-1,\
NULL-1,C5-1,E5-2,D5-1,NULL-3,\
C5-1,NULL-1,E5-2,D5-1,NULL-1,C5-1,C5-1,\
NULL-1,C5-1,E5-2,D5-1,NULL-3,\
A5-1,NULL-1,G5-1,E5-1,G5-1,NULL-1,E5-1,D5-1,\
E5-1,D5-1,NULL-1,C5-1,C5-1,NULL-1,C5-1,NULL-1,\
A5-1,NULL-1,G5-1,E5-1,G5-1,NULL-1,E5-1,D5-1,\
E5-1,D5-1,NULL-1,C5-1,C5-1,NULL-3,\
C5-1,NULL-1,E5-2,D5-1,NULL-1,C5-1,C5-1,\
NULL-1,C5-1,E5-2,D5-1,NULL-3,\
C5-1,NULL-1,E5-2,D5-1,NULL-1,C5-1,C5-1,\
NULL-1,C5-1,E5-2,D5-1,NULL-3,\
A5-1,NULL-1,G5-1,E5-1,G5-1,NULL-1,E5-1,D5-1,\
E5-1,D5-1,NULL-1,C5-1,C5-1,NULL-1,C5-1,NULL-1,\
A5-1,NULL-1,G5-1,E5-1,G5-1,NULL-1,E5-1,D5-1,\
E5-1,D5-1,NULL-1,C5-1,C5-1,NULL-3)");

    //JUSTIN BIEBER - LOVE YOURSELF
    Todas_las_melodias_de_regalo[11].setAttribute('data-melodia',
"(G5-1,E5-1,NULL-1,G5-1,NULL-1,E5-2,NULL-1,\
D5-1,C5-1,NULL-1,C5-1,NULL-4,\
G5-1,E5-1,NULL-1,G5-1,NULL-1,E5-2,NULL-1,\
D5-1,C5-1,NULL-1,E5-2,NULL-3,\
G5-1,E5-1,NULL-1,G5-1,NULL-1,E5-1,NULL-2,\
D5-1,C5-1,NULL-2,F5-1,E5-1,NULL-1,D5-1,\
NULL-1,C5-1,NULL-2,C5-1,NULL-11,\
G5-1,E5-1,NULL-1,G5-1,NULL-1,E5-2,NULL-1,\
D5-1,C5-1,NULL-1,C5-1,NULL-4,\
G5-1,E5-1,NULL-1,G5-1,NULL-1,E5-2,NULL-1,\
D5-1,C5-1,NULL-1,E5-2,NULL-3,\
G5-1,E5-1,NULL-1,G5-1,NULL-1,E5-1,NULL-2,\
D5-1,C5-1,NULL-2,F5-1,E5-1,NULL-1,D5-1,\
NULL-1,C5-1,NULL-2,C5-1)");

    //David Guetta - Play Hard
    Todas_las_melodias_de_regalo[12].setAttribute('data-melodia',
"(B4-2,NULL-2,B4-2,G#4-1,\
NULL-3,B4-1,NULL-3,B4-2,\
A#4-2,NULL-1,F#4-1,NULL-2,F#4-2,\
F#5-1,NULL-2,F#5-1,NULL-2,D#5-2,\
B4-2,NULL-2,B4-2,G#4-2,\
NULL-2,B4-2,NULL-2,B4-1,NULL-1,\
A#4-2,NULL-1,F#4-2,NULL-1,F#4-2,\
E5-2,NULL-1,E5-1,NULL-2,D#5-2,\
B4-2,NULL-2,B4-2,G#4-1,\
NULL-3,B4-1,NULL-3,B4-2,\
A#4-2,NULL-1,F#4-1,NULL-2,F#4-2,\
F#5-1,NULL-2,F#5-1,NULL-2,D#5-2,\
B4-2,NULL-2,B4-2,G#4-2,\
NULL-2,B4-2,NULL-2,B4-1,NULL-1,\
A#4-2,NULL-1,F#4-2,NULL-1,F#4-2,\
E5-2,NULL-1,E5-1,NULL-2,D#5-2)");

    //BILLIE EILISH - BAD GUY
    Todas_las_melodias_de_regalo[13].setAttribute('data-melodia',
"(D4-1,NULL-2,D4-1,F4-1,D4-1,NULL-1,D4-1,\
NULL-1,D4-1,NULL-1,D4-1,F4-1,D4-1,C4-2,\
D4-1,NULL-2,D4-1,F4-1,D4-1,NULL-1,D4-1,\
NULL-1,D4-1,NULL-1,D4-1,F4-1,D4-1,C4-2,\
G4-1,NULL-2,G4-1,A#4-1,G4-1,NULL-1,G4-1,\
NULL-1,G4-1,NULL-1,G4-1,A#4-1,G4-1,D5-2,\
A4-1,NULL-2,A4-1,C#5-1,A4-2,D4-1,\
NULL-1,D4-1,NULL-1,D4-1,NULL-1,C4-1,D4-2,\
D4-1,NULL-2,D4-1,F4-1,D4-1,NULL-1,D4-1,\
NULL-1,D4-1,NULL-1,D4-1,F4-1,D4-1,C4-2,\
D4-1,NULL-2,D4-1,F4-1,D4-1,NULL-1,D4-1,\
NULL-1,D4-1,NULL-1,D4-1,F4-1,D4-1,C4-2,\
G4-1,NULL-2,G4-1,A#4-1,G4-1,NULL-1,G4-1,\
NULL-1,G4-1,NULL-1,G4-1,A#4-1,G4-1,D5-2,\
A4-1,NULL-2,A4-1,C#5-1,A4-2,D4-1,\
NULL-1,D4-1,NULL-1,D4-1,NULL-1,C4-1,D4-2)");

    //THE WEEKND - BLINDING LIGTHS
    Todas_las_melodias_de_regalo[14].setAttribute('data-melodia',
"(E5-1,NULL-3,E5-1,NULL-2,D5-1,\
E5-1,F#5-1,NULL-1,B4-1,NULL-1,D5-1,NULL-2,\
E5-1,NULL-3,E5-1,NULL-2,D5-1,\
E5-1,F#5-1,NULL-1,B4-1,NULL-1,D5-1,NULL-1,D5-1,\
A5-1,F#5-1,NULL-1,E5-1,NULL-1,D5-1,NULL-1,D5-1,\
A5-1,F#5-1,NULL-1,E5-1,NULL-1,D5-1,NULL-1,\
E5-5,NULL-4,E5-1,F#5-1,F#5-1,E5-1,\
D5-1,B4-1,A4-1,B4-1,\
E5-1,NULL-3,E5-1,NULL-2,D5-1,\
E5-1,F#5-1,NULL-1,B4-1,NULL-1,D5-1,NULL-2,\
E5-1,NULL-3,E5-1,NULL-2,D5-1,\
E5-1,F#5-1,NULL-1,B4-1,NULL-1,D5-1,NULL-1,D5-1,\
A5-1,F#5-1,NULL-1,E5-1,NULL-1,D5-1,NULL-1,D5-1,\
A5-1,F#5-1,NULL-1,E5-1,NULL-1,D5-1,NULL-1,\
E5-5,NULL-4,E5-1,F#5-1,F#5-1,E5-1,\
D5-1,B4-1,A4-1,B4-1)");

    //COLDPLAY - FIX YOU
    Todas_las_melodias_de_regalo[15].setAttribute('data-melodia',
"(F5-4,E5-4,D5-3,C5-1,B4-2,NULL-1,A4-1,\
G4-4,A4-2,C5-10,\
F5-4,E5-4,D5-3,C5-1,B4-2,NULL-1,A4-1,\
G4-4,A4-2,C5-10,NULL-6,\
C5-2,F5-4,E5-4,D5-11,NULL-3,\
C5-2,E5-2,C5-6)");

    //CALVIN HARRIS - SUMMER
    Todas_las_melodias_de_regalo[16].setAttribute('data-melodia',
"(NULL-2,C#5-1,NULL-1,C#5-1,NULL-1,D#5-1,NULL-1,D#5-1,NULL-1,\
F5-1,NULL-1,F5-1,NULL-1,C#5-1,NULL-1,C#5-1,NULL-1,\
C5-1,NULL-1,C5-1,NULL-1,A#4-1,NULL-1,A#4-1,NULL-1,\
G#4-1,NULL-1,G#4-2,C#5-1,NULL-3,\
C#5-1,NULL-1,C#5-1,NULL-1,D#5-1,NULL-1,D#5-1,NULL-1,\
F5-1,NULL-1,F5-1,NULL-1,C#5-1,NULL-1,C#5-1,NULL-1,\
C5-1,NULL-1,C5-1,NULL-1,A#4-1,NULL-1,A#4-1,NULL-1,\
G#4-1,NULL-1,G#4-2,F4-2,\
NULL-2,C#5-1,NULL-1,C#5-1,NULL-1,D#5-1,NULL-1,D#5-1,NULL-1,\
F5-1,NULL-1,F5-1,NULL-1,C#5-1,NULL-1,C#5-1,NULL-1,\
C5-1,NULL-1,C5-1,NULL-1,A#4-1,NULL-1,A#4-1,NULL-1,\
G#4-1,NULL-1,G#4-2,C#5-1,NULL-3,\
C#5-1,NULL-1,C#5-1,NULL-1,D#5-1,NULL-1,D#5-1,NULL-1,\
F5-1,NULL-1,F5-1,NULL-1,C#5-1,NULL-1,C#5-1,NULL-1,\
C5-1,NULL-1,C5-1,NULL-1,A#4-1,NULL-1,A#4-1,NULL-1,\
G#4-1,NULL-1,G#4-2,F4-2)");

    //HARRY STYLES - AS IT WAS
    Todas_las_melodias_de_regalo[17].setAttribute('data-melodia',
"(C5-1,D5-1,E5-1,D5-1,NULL-1,D5-1,NULL-1,D5-1,\
NULL-1,D5-1,NULL-1,C5-1,G5-1,G5-1,E5-2,\
C5-1,D5-1,E5-1,D5-1,NULL-1,D5-1,NULL-1,D5-1,\
NULL-1,D5-1,NULL-1,C5-1,D5-2,C5-1,NULL-1,\
C5-1,D5-1,E5-1,D5-1,NULL-1,D5-1,NULL-1,D5-1,\
NULL-1,D5-1,NULL-1,C5-1,G5-1,G5-1,E5-2,\
C5-1,D5-1,E5-1,D5-1,NULL-1,D5-1,NULL-1,D5-1,\
NULL-1,D5-1,NULL-1,C5-1,D5-2,C5-1,NULL-1,\
C5-1,D5-1,E5-1,D5-1,NULL-1,D5-1,NULL-1,D5-1,\
NULL-1,D5-1,NULL-1,C5-1,G5-1,G5-1,E5-2,\
C5-1,D5-1,E5-1,D5-1,NULL-1,D5-1,NULL-1,D5-1,\
NULL-1,D5-1,NULL-1,C5-1,D5-2,C5-1,NULL-1,\
C5-1,D5-1,E5-1,D5-1,NULL-1,D5-1,NULL-1,D5-1,\
NULL-1,D5-1,NULL-1,C5-1,G5-1,G5-1,E5-2,\
C5-1,D5-1,E5-1,D5-1,NULL-1,D5-1,NULL-1,D5-1,\
NULL-1,D5-1,NULL-1,C5-1,D5-2,C5-1)");

    //BAD BUNNY - DAKITI
    Todas_las_melodias_de_regalo[18].setAttribute('data-melodia',
"(A5-1,NULL-1,A5-1,NULL-1,D6-1,NULL-1,C6-1,NULL-1,\
B5-1,NULL-1,A5-1,NULL-1,C6-3,NULL-1,\
G5-1,NULL-1,G5-1,NULL-1,G5-1,NULL-1,G5-1,NULL-1,\
G5-1,NULL-1,C6-2,B5-3,NULL-1,\
G5-1,NULL-1,G5-1,NULL-1,G5-1,NULL-1,G5-1,NULL-1,\
G5-1,NULL-1,A5-1,NULL-1,B5-2,NULL-2,\
B5-1,NULL-1,B5-1,NULL-1,B5-1,NULL-1,A5-1,NULL-1,\
G5-1,NULL-1,A5-1,NULL-1,A5-2,NULL-2,\
A5-1,NULL-1,A5-1,NULL-1,D6-1,NULL-1,C6-1,NULL-1,\
B5-1,NULL-1,A5-1,NULL-1,C6-3,NULL-1,\
G5-1,NULL-1,G5-1,NULL-1,C6-1,NULL-1,B5-1,NULL-1,\
A5-1,NULL-1,G5-1,NULL-1,B5-3,NULL-1,\
G5-1,NULL-1,G5-1,NULL-1,G5-1,NULL-1,G5-1,NULL-1,\
G5-1,NULL-1,A5-1,NULL-1,B5-2,NULL-2,\
B5-1,NULL-1,B5-1,NULL-1,B5-1,NULL-1,A5-1,NULL-1,\
G5-1,NULL-1,A5-1,NULL-1,A5-2)");



    //CALLE 13 - MUERTE EN HAWAII
    Todas_las_melodias_de_regalo[19].setAttribute('data-melodia',
"(NULL-2,E5-1,NULL-1,D5-1,NULL-3,\
D5-1,D5-1,D5-1,D5-1,D5-1,D5-1,D5-1,D5-1,\
A4-1,E5-1,NULL-1,D5-1,NULL-4,\
D5-1,D5-1,D5-1,D5-1,D5-1,D5-1,D5-1,D5-1,\
A4-1,E5-1,NULL-1,D5-1,NULL-2,B4-1,NULL-1,\
B4-1,A4-1,B4-1,A4-1,B4-1,NULL-3,\
D5-1,D5-1,D5-1,D5-1,NULL-1,D5-1,NULL-2,\
E5-1,D5-1,E5-1,D5-1,F#5-1,NULL-1,D5-1,NULL-1,\
NULL-2,E5-1,NULL-1,D5-1,NULL-3,\
D5-1,D5-1,D5-1,D5-1,D5-1,D5-1,D5-1,D5-1,\
A4-1,E5-1,NULL-1,D5-1,NULL-4,\
D5-1,D5-1,D5-1,D5-1,D5-1,D5-1,D5-1,D5-1,\
A4-1,E5-1,NULL-1,D5-1,NULL-2,B4-1,NULL-1,\
B4-1,A4-1,B4-1,A4-1,B4-1,NULL-3,\
D5-1,D5-1,D5-1,D5-1,NULL-1,D5-1,NULL-2,\
E5-1,D5-1,E5-1,D5-1,F#5-1,NULL-1,D5-1)");  


    //JAY HARDWAY - WAKE UP
    Todas_las_melodias_de_regalo[20].setAttribute('data-melodia',
"(G#5-1,NULL-1,G#5-1,NULL-1,F#5-1,NULL-1,F#5-1,NULL-1,\
D#5-1,NULL-1,F#5-1,NULL-1,G#4-1,NULL-2,G#4-1,\
NULL-2,B4-1,NULL-1,G#4-1,NULL-2,G#4-2,\
NULL-1,F#4-1,NULL-1,G#4-1,NULL-3,\
G#5-1,NULL-1,G#5-1,NULL-1,F#5-1,NULL-1,F#5-1,NULL-1,\
B5-1,NULL-1,A#5-1,NULL-1,G#5-1,NULL-2,G#5-1,\
NULL-1,F#5-1,F#5-1,NULL-1,\
G#5-1,G#5-1,G#5-1,G#5-1,G#5-1,NULL-1,F#5-1,NULL-1,G#4-1,NULL-3,\
G#5-1,NULL-1,G#5-1,NULL-1,F#5-1,NULL-1,F#5-1,NULL-1,\
D#5-1,NULL-1,F#5-1,NULL-1,G#4-1,NULL-2,G#4-1,\
NULL-2,B4-1,NULL-1,G#4-1,NULL-2,G#4-1,\
NULL-2,F#4-1,NULL-1,G#4-1,NULL-3,\
G#5-1,NULL-1,G#5-1,NULL-1,F#5-1,NULL-1,F#5-1,NULL-1,\
B5-1,NULL-1,A#5-1,NULL-1,G#5-1,NULL-2,G#5-1,\
NULL-2,G#5-1,NULL-1,D#6-2,NULL-1,C#6-2,NULL-1,B5-2,G#5-2)");


    //EMINEM - THE REAL SLIM SHADY
    Todas_las_melodias_de_regalo[21].setAttribute('data-melodia',
"(C5-1,NULL-1,D#5-1,NULL-1,G5-1,NULL-1,G#5-1,NULL-1,\
C6-1,NULL-5,G#5-1,NULL-1,\
G5-1,NULL-5,G#5-1,NULL-1,G5-1,NULL-1,F5-1,NULL-1,\
G5-1,NULL-1,D#5-1,NULL-1,\
C5-1,NULL-1,D#5-1,NULL-1,G5-1,NULL-1,G#5-1,NULL-1,\
C6-1,NULL-5,G#5-1,NULL-1,G5-1,NULL-5,G#5-1,NULL-1,\
G5-1,NULL-1,F5-1,NULL-1,G5-1,NULL-1,D#5-1,NULL-1,\
C5-1,NULL-1,D#5-1,NULL-1,G5-1,NULL-1,G#5-1,NULL-1,\
C6-1,NULL-5,G#5-1,NULL-1,\
G5-1,NULL-5,G#5-1,NULL-1,G5-1,NULL-1,F5-1,NULL-1,\
G5-1,NULL-1,D#5-1,NULL-1,\
C5-1,NULL-1,D#5-1,NULL-1,G5-1,NULL-1,G#5-1,NULL-1,\
C6-1,NULL-5,G#5-1,NULL-1,G5-1,NULL-5,G#5-1,NULL-1,\
G5-1,NULL-1,F5-1,NULL-1,G5-1,NULL-1,D#5-1)");

    //CHARLIE PUTH - ATTENTION
    Todas_las_melodias_de_regalo[22].setAttribute('data-melodia',
"(F4-2,C5-2,F5-2,C5-2,G#5-2,G5-2,F5-2,C5-2,\
D#4-2,A#4-2,D#5-2,F5-2,G5-2,NULL-6,\
C4-2,A#4-2,D#5-2,A#4-2,G5-2,F5-2,D#5-2,A#4-2,\
C#4-2,G#4-2,C#5-2,D#5-2,F5-2,NULL-6,\
F4-2,C5-2,F5-2,C5-2,G#5-2,G5-2,F5-2,C5-2,\
D#4-2,A#4-2,D#5-2,F5-2,G5-2,NULL-6,\
C4-2,A#4-2,D#5-2,A#4-2,G5-2,F5-2,D#5-2,A#4-2,\
C#4-2,G#4-2,C#5-2,D#5-2,F5-2)");



    //CALLE 13 - EL AGUANTE
    Todas_las_melodias_de_regalo[23].setAttribute('data-melodia',
"(D5-1,E5-1,F5-1,E5-1,F5-1,G5-1,F5-1,E5-1,\
F5-1,E5-1,D5-1,A4-1,D5-1,E5-1,F5-1,E5-1,\
F5-1,G5-1,F5-1,E5-1,F5-4,\
D5-1,E5-1,F5-1,E5-1,F5-1,G5-1,F5-1,E5-1,\
F5-1,E5-1,D5-1,A4-1,NULL-2,A5-1,NULL-2,\
A5-1,F5-1,D5-1,G5-1,E5-1,C5-1,D5-1,NULL-4,\
D5-1,E5-1,F5-1,E5-1,F5-1,G5-1,F5-1,E5-1,\
F5-1,E5-1,D5-1,A4-1,D5-1,E5-1,F5-1,E5-1,\
F5-1,G5-1,F5-1,E5-1,F5-4,\
D5-1,E5-1,F5-1,E5-1,F5-1,G5-1,F5-1,E5-1,\
F5-1,E5-1,D5-1,A4-1,NULL-2,A5-1,NULL-2,\
A5-1,F5-1,D5-1,G5-1,E5-1,C5-1,D5-1)");



    //LOS BUNKERS - BAILANDO SOLO
    Todas_las_melodias_de_regalo[24].setAttribute('data-melodia',
"(A#4-1,NULL-2,A#4-1,NULL-2,G#4-1,NULL-1,\
A#4-1,NULL-2,A#4-1,NULL-2,G#4-1,NULL-1,\
A#4-1,NULL-2,A#4-1,NULL-2,G#4-1,NULL-1,\
A#4-1,NULL-1,G#4-1,NULL-1,A#4-1,NULL-1,C5-1,NULL-1,\
C#5-1,NULL-2,C#5-1,NULL-2,C5-1,NULL-1,\
C#5-1,NULL-2,C#5-1,NULL-2,C5-1,NULL-1,\
C#5-1,NULL-2,C#5-1,NULL-2,C5-1,NULL-1,\
C#5-1,NULL-1,C5-1,NULL-1,C#5-1,NULL-1,D#5-1,NULL-1,\
F5-1,NULL-2,F5-1,NULL-2,D#5-1,NULL-1,\
F5-1,NULL-2,F5-1,NULL-2,D#5-1,NULL-1,\
F5-1,NULL-2,F5-1,NULL-2,F5-1,NULL-1,\
F#5-1,NULL-1,F5-1,NULL-1,D#5-1,NULL-1,C#5-1)");

    //TWENTY ONE PILOTS  - HEAVY DIRTY SOUL
    Todas_las_melodias_de_regalo[25].setAttribute('data-melodia',
"(NULL-2,A4-1,NULL-1,A4-2,B4-2,D5-1,NULL-1,E5-1,NULL-1,D5-1,NULL-3,\
NULL-2,A4-1,NULL-1,A4-1,NULL-1,B4-1,NULL-1,\
D5-2,E5-1,NULL-1,D5-1,NULL-3,\
B5-1,NULL-3,F#5-1,NULL-3,F#5-1,NULL-1,E5-1,NULL-1,E5-3,NULL-1,\
D5-1,NULL-3,F#5-1,NULL-1,A5-1,NULL-1,\
F#5-1,NULL-1,E5-1,NULL-1,E5-1,NULL-1,D5-1,NULL-1,\
NULL-2,A4-1,NULL-1,A4-2,B4-2,D5-1,NULL-1,E5-1,NULL-1,D5-1,NULL-3,\
NULL-2,A4-1,NULL-1,A4-1,NULL-1,B4-1,NULL-1,\
D5-2,E5-1,NULL-1,D5-1,NULL-3,\
B5-1,NULL-3,F#5-1,NULL-3,F#5-1,NULL-1,E5-1,NULL-1,E5-3,NULL-1,\
D5-1,NULL-3,F#5-1,NULL-1,A5-1,NULL-1,\
F#5-1,NULL-1,E5-1,NULL-1,E5-1,NULL-1,D5-1)");


    //XXXTENTACION - SAD!
    Todas_las_melodias_de_regalo[26].setAttribute('data-melodia',
"(D#6-2,NULL-2,C6-2,NULL-2,\
G5-1,NULL-1,F5-1,NULL-1,G5-2,F5-1,NULL-1,\
G5-1,NULL-1,F5-2,G5-2,F5-1,NULL-1,G5-2,F5-1,NULL-1,D#5-2,NULL-2,\
D#6-2,NULL-2,C6-2,NULL-2,\
G5-1,NULL-1,F5-1,NULL-1,G5-2,F5-1,NULL-1,\
G5-1,NULL-1,F5-2,G5-2,F5-1,NULL-1,G5-2,F5-1,NULL-1,D#5-2,NULL-2,\
D#6-2,NULL-2,C6-2,NULL-2,\
G5-1,NULL-1,F5-1,NULL-1,G5-2,F5-1,NULL-1,\
G5-1,NULL-1,F5-2,G5-2,F5-1,NULL-1,G5-2,F5-1,NULL-1,D#5-2,NULL-2,\
D#5-1,NULL-1,A#5-1,NULL-3,F5-1,NULL-1,\
F5-2,NULL-2,D#5-2,NULL-2,\
D#5-1,NULL-1,A#5-1,NULL-3,F5-1,NULL-1,\
F5-2,NULL-2,D#5-2)");

    //MARSHMELLO - FRIENDS
    Todas_las_melodias_de_regalo[27].setAttribute('data-melodia',
"(E5-1,NULL-1,E5-1,E5-1,E5-1,NULL-1,D5-1,NULL-1,\
B4-1,NULL-3,B4-1,NULL-1,D5-1,NULL-1,\
C5-1,NULL-1,C5-1,C5-1,C5-1,NULL-1,B4-1,NULL-1,\
A4-1,NULL-7,\
E5-1,NULL-1,E5-1,E5-1,E5-1,NULL-1,D5-1,NULL-1,\
B4-1,NULL-3,B4-1,NULL-1,D5-1,NULL-1,\
C5-1,NULL-1,C5-1,C5-1,C5-1,NULL-1,B4-1,NULL-1,\
A4-1,NULL-7,\
E5-1,NULL-1,E5-1,E5-1,E5-1,NULL-1,D5-1,NULL-1,\
B4-1,NULL-3,B4-1,NULL-1,D5-1,NULL-1,\
C5-1,NULL-1,C5-1,C5-1,C5-1,NULL-1,B4-1,NULL-1,\
A4-1,NULL-7,\
E5-1,NULL-1,E5-1,E5-1,E5-1,NULL-1,D5-1,NULL-1,\
B4-1,NULL-3,B4-1,NULL-1,D5-1,NULL-1,\
C5-1,NULL-1,C5-1,C5-1,C5-1,NULL-1,B4-1,NULL-1,\
A4-1)");

    //PORTER && ROBINSON - SHELTER
    Todas_las_melodias_de_regalo[28].setAttribute('data-melodia',
"(D6-2,NULL-2,B6-1,A6-1,NULL-1,D6-3,NULL-6,\
D6-2,NULL-2,B6-1,A6-1,NULL-1,E6-3,NULL-2,\
E6-1,NULL-1,D6-1,NULL-1,\
D6-2,NULL-2,B6-1,A6-1,NULL-1,D6-1,NULL-6,F#6-1,NULL-1,\
F#6-1,NULL-1,D6-1,E6-1,F#6-1,NULL-1,\
D6-1,E6-1,F#6-1,NULL-1,D6-1,E6-1,F#6-2,D6-1,E6-1,\
D6-2,NULL-2,B6-1,A6-1,NULL-1,D6-3,NULL-6,\
D6-2,NULL-2,B6-1,A6-1,NULL-1,E6-3,NULL-2,\
E6-1,NULL-1,D6-1,NULL-1,\
D6-2,NULL-2,B6-1,A6-1,NULL-1,D6-1,NULL-6,F#6-1,NULL-1,\
F#6-1,NULL-1,D6-1,E6-1,F#6-1,NULL-1,\
D6-1,E6-1,F#6-1,NULL-1,D6-1,E6-1,F#6-2,D6-1,E6-1)");

    //IMAGINE DRAGONS SHOTS
    Todas_las_melodias_de_regalo[29].setAttribute('data-melodia',
"(NULL-2,C6-1,NULL-1,C6-1,NULL-1,A5-1,NULL-1,\
C6-1,NULL-1,A5-1,NULL-1,G5-1,NULL-1,C6-1,NULL-1,\
NULL-2,C6-1,NULL-1,C6-1,NULL-1,A5-1,NULL-1,\
C6-1,NULL-1,D6-1,NULL-1,E6-1,NULL-1,D6-1,NULL-5,\
C6-1,NULL-1,D6-1,NULL-1,E6-1,NULL-1,E6-1,NULL-1,C6-1,NULL-1,D6-1,NULL-1,\
E6-1,NULL-1,E6-1,C6-1,NULL-1,D6-1,NULL-1,E6-2,NULL-1,B5-1,NULL-2,A5-1,NULL-3,\
C6-1,NULL-3,A5-2,C6-1,NULL-1,A5-1,NULL-1,G5-1,NULL-1,C6-1,NULL-3,\
C6-1,NULL-1,C6-1,NULL-1,A5-1,NULL-1,C6-1,NULL-1,D6-1,NULL-1,E6-1,NULL-1,D6-1,NULL-5,\
C6-1,NULL-1,D6-1,NULL-1,E6-1,NULL-1,E6-1,NULL-1,C6-1,NULL-1,D6-1,NULL-1,\
E6-1,NULL-1,E6-1,NULL-1,C6-1,NULL-1,D6-1,NULL-1,G6-2,NULL-1,B5-1,\
NULL-2,A5-1)");



//******************************************************************************


    //BOTON EMPAQUETADOR DE MELODIAS**********************************************************

    const boton_para_guardar_melodia = document.getElementById("Boton_guardar_Melodia");
    const contenedor_melodia_empaquetada = document.getElementById("Contenedor_melodias_ocultas");

    
    boton_para_guardar_melodia.addEventListener('mousemove',()=>{

        var Todas_las_notas_iniciales = document.querySelectorAll(".Cuadro_Semicorchea[Inicio_de_nota='Si']");
        var melodia_empaquetada = "(";
        var columna_para_hacer_nota=0;
        var columna_esta_libre;
        var contador_nulls=0;
        var no_se_recorrieron_todas_las_notas = true;
        var cantidad_notas_melodia = Todas_las_notas_iniciales.length;
        var acumulador_notas=0;
        var nombre_nota_para_empaquetar="";
        var duracion_nota_para_empaquetar=0;

        while(no_se_recorrieron_todas_las_notas){

            columna_esta_libre = true;

            for(var e=0;e<37;e++){

                if(Todos_los_cuadros_semicorchea_melodia[columna_para_hacer_nota+(128*e)].getAttribute('Activado')=='Si'){



                    columna_esta_libre=false;

                    nombre_nota_para_empaquetar = obtener_nota(Todos_los_cuadros_semicorchea_melodia[columna_para_hacer_nota+(128*e)].id);
                    duracion_nota_para_empaquetar = parseInt(Todos_los_cuadros_semicorchea_melodia[columna_para_hacer_nota+(128*e)].getAttribute('Longitud_Semicorcheas'));

                    if(contador_nulls!=0){

                        melodia_empaquetada = melodia_empaquetada + "-" + contador_nulls+",";

                    }

                    contador_nulls=0;


                }

            }

            if(columna_esta_libre){
                
                contador_nulls++;
                columna_para_hacer_nota++;

                if(contador_nulls==1&&acumulador_notas!=cantidad_notas_melodia){

                    melodia_empaquetada = melodia_empaquetada + "NULL";

                }

            }else{

                melodia_empaquetada = melodia_empaquetada + nombre_nota_para_empaquetar + "-" + duracion_nota_para_empaquetar;
                columna_para_hacer_nota=columna_para_hacer_nota + duracion_nota_para_empaquetar;

                acumulador_notas++;

                if(acumulador_notas!=cantidad_notas_melodia){
                    melodia_empaquetada = melodia_empaquetada + ",";
                }
            }
                

            

            if(acumulador_notas==cantidad_notas_melodia){
                no_se_recorrieron_todas_las_notas=false;
            }

        };


        melodia_empaquetada = melodia_empaquetada + ")";

        if(cantidad_notas_melodia==0){

            melodia_empaquetada = "(NULL-128)";

        }

        

        contenedor_melodia_empaquetada.value = melodia_empaquetada;
        console.log(contenedor_melodia_empaquetada.value);

    });



    //***************************************************************************************

    //BOTON DESENPAQUEDADOR E INSERTOR DE MELODIAS**************************************




    function obtener_duracion(nota_duracion){

        var duracion="";

        for(var i=0;i<nota_duracion.length;i++){

            if(nota_duracion[i-1]=="-"){
                
                for(var e=i;e<nota_duracion.length;e++){
                    duracion=duracion+nota_duracion[e];
                }
        
            break;

            }
        
        }
    
        return parseInt(duracion);

    }

    function obtener_numero_de_elemento_para_desempacar(nota,numero_de_columna_para_iniciar){

        var numero_fila;
        var numero_columna = numero_de_columna_para_iniciar;
        var nro_elemento;

        switch(nota){

            case "C7":
                numero_fila=1;
            break;

            case "B6":
                numero_fila=2;
            break;

            case "A#6":
                numero_fila=3;
            break;

            case "A6":
                numero_fila=4;
            break;

            case "G#6":
                numero_fila=5;
            break;

            case "G6":
                numero_fila=6;
            break;

            case "F#6":
                numero_fila=7;
            break;

            case "F6":
                numero_fila=8;
            break;

            case "E6":
                numero_fila=9;
            break;

            
            case "D#6":
                numero_fila=10;
            break;

            case "D6":
                numero_fila=11;
            break;

            case "C#6":
                numero_fila=12;
            break;

            case "C6":
                numero_fila=13;
            break;
            
            case "B5":
                numero_fila=14;
            break;

            case "A#5":
                numero_fila=15;
            break;

            case "A5":
                numero_fila=16;
            break;
            
            case "G#5":
                numero_fila=17;
            break;

            case "G5":
                numero_fila=18;
            break;

            case "F#5":
                numero_fila=19;
            break;

            case "F5":
                numero_fila=20;
            break;

            case "E5":
                numero_fila=21;
            break;

            case "D#5":
                numero_fila=22;
            break;

            case "D5":
                numero_fila=23;
            break;

            case "C#5":
                numero_fila=24;
            break;
            
            case "C5":
                numero_fila=25;
            break;

            case "B4":
                numero_fila=26;
            break;

            case "A#4":
                numero_fila=27;
            break;

            case "A4":
                numero_fila=28;
            break;

            case "G#4":
                numero_fila=29;
            break;

            case "G4":
                numero_fila=30;
            break;

            case "F#4":
                numero_fila=31;
            break;

            case "F4":
                numero_fila=32;
            break;

            case "E4":
                numero_fila=33;
            break;

            case "D#4":
                numero_fila=34;
            break;

            case "D4":
                numero_fila=35;
            break;

            case "C#4":
                numero_fila=36;
            break;

            case "C4":
                numero_fila=37;
            break;
        }
        
        nro_elemento = (numero_fila-1)*128 + numero_columna - 1;

        return nro_elemento;
    }

    var comboBox_melodias = document.getElementById("Combo_de_MELODIAS");
    var Todas_las_melodias = document.querySelectorAll('.Melodia_regalo');
    const BOTON_INSERTOR_DE_MELODIAS= document.getElementById("Boton_insercion"); 
    

    BOTON_INSERTOR_DE_MELODIAS.addEventListener('click',()=>{

    //Eliminando cualquier melodia anterior a la insercion************************
        Todos_los_cuadros_semicorchea_melodia.forEach((cuadro_sem_melodia)=>{

            cuadro_sem_melodia.setAttribute('Activado','No');
            cuadro_sem_melodia.classList.remove('Cuadro_Semicorcheas_Activado');
            cuadro_sem_melodia.classList.remove('Cuadro_Semicorchea_Activado');
            cuadro_sem_melodia.removeAttribute('Longitud_Semicorcheas');
            cuadro_sem_melodia.removeAttribute('Inicial');
            cuadro_sem_melodia.removeAttribute('columna_para_iniciar');
            cuadro_sem_melodia.removeAttribute('Inicio_de_nota');
        });


    //Obteniendo la melodia empaquetada de la opcion seleccionada en el COMBOBOX
    var melodia = Todas_las_melodias[comboBox_melodias.value].dataset.melodia;

    //RECORRIENDO LOS CARACTERES DE TODA LA MELODIA A EXCEPCION DEL PRIMER PARENTESIS
        var nota_mas_duracion="";
        var numero_de_columa_para_iniciar_a_graficar_nota = 1;
        
        for(var caracter=1;caracter<melodia.length;caracter++){
        
            if(melodia[caracter]!=","&&melodia[caracter]!=")"){

                nota_mas_duracion=nota_mas_duracion + melodia[caracter];

            }else{

                var nombre_nota_a_activar =  obtener_nota(nota_mas_duracion);
                var duracion = obtener_duracion(nota_mas_duracion);

                if(nombre_nota_a_activar!="NULL"){

                var numero_de_elemento = obtener_numero_de_elemento_para_desempacar(nombre_nota_a_activar,numero_de_columa_para_iniciar_a_graficar_nota);
                Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].setAttribute('Longitud_Semicorcheas',duracion);

                //Para longitud 1
                    if(duracion==1){

                    //Cuadro_Semicorchea_Activado
                        Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].classList.add("Cuadro_Semicorchea_Activado");
                        Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].setAttribute('Activado','Si');
                        Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].setAttribute('Inicio_de_nota','Si');

                    //Para longitud mayor a 1
                    }else{

                        Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].setAttribute('Inicial','Si');
                        Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].setAttribute('columna_para_iniciar',numero_de_columa_para_iniciar_a_graficar_nota);
                        Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].setAttribute('Inicio_de_nota','Si');

                        for(var consiguientes=0;consiguientes<duracion;consiguientes++){

                            Todos_los_cuadros_semicorchea_melodia[numero_de_elemento+consiguientes].classList.add("Cuadro_Semicorcheas_Activado");
                            Todos_los_cuadros_semicorchea_melodia[numero_de_elemento+consiguientes].setAttribute('Activado','Si');
                            
                            var longitud = Todos_los_cuadros_semicorchea_melodia[numero_de_elemento].getAttribute('Longitud_Semicorcheas');

                        
                            if(consiguientes==0){
                                Todos_los_cuadros_semicorchea_melodia[numero_de_elemento+consiguientes].classList.add("borde_izquierdo_sin_modificar");
                            };

                            if(consiguientes==duracion-1){
                                Todos_los_cuadros_semicorchea_melodia[numero_de_elemento+consiguientes].classList.add("borde_derecho_sin_modificar");
                            };
        
                        };


                    };
                }   


                //RESETEANDO VARIABLE de nota_mas_duracion para almacenar el siguiente valor
                nota_mas_duracion="";
                //AVANZANDO NUMERO DE COLUMNAS
                numero_de_columa_para_iniciar_a_graficar_nota=numero_de_columa_para_iniciar_a_graficar_nota + duracion;
            }

        }

        //COLOCANDO EVENTO DE CLIC IZQUIERDO 

        const Todos_los_cuadros_semicorchea_melodia_desempaquetados = document.querySelectorAll(".Cuadro_Semicorchea_Activado");
        

        Todos_los_cuadros_semicorchea_melodia_desempaquetados.forEach((cuadros_nota_activada)=>{

            cuadros_nota_activada.addEventListener('mousemove',()=>{

                cuadros_nota_activada.addEventListener('mousedown',(e)=>{
                    

                    if(e.which==3){

                        cuadros_nota_activada.classList.remove("Cuadro_Semicorchea_Activado");
                        cuadros_nota_activada.setAttribute('Activado','No');
                        cuadros_nota_activada.setAttribute('Inicio_de_nota','No')
                    
                    }

                });

            })

        });

        //Longitud 1
        //MAS DE 1

        const Todos_los_cuadros_semicorcheas_iniciales_melodia_desempaquetados = document.querySelectorAll(".Cuadro_Semicorcheas_Activado[Inicial='Si']");

        Todos_los_cuadros_semicorcheas_iniciales_melodia_desempaquetados.forEach((cuadros_mas_de_1_semicorchea)=>{

            if(cuadros_mas_de_1_semicorchea.getAttribute('Longitud_Semicorcheas')!=undefined){

                var longitud = cuadros_mas_de_1_semicorchea.getAttribute('Longitud_Semicorcheas');
                var numero_de_elemento_inicial = obtener_numero_de_elemento(obtener_nota(cuadros_mas_de_1_semicorchea.id),parseInt(cuadros_mas_de_1_semicorchea.getAttribute('columna_para_iniciar')));
                

                for(var cuadros_que_conforman=0;cuadros_que_conforman<longitud;cuadros_que_conforman++){

                    //Todos_los_cuadros_semicorchea_melodia[numero_de_elemento_inicial+cuadros_que_conforman].addEventListener('mousemove',()=>{

                        Todos_los_cuadros_semicorchea_melodia[numero_de_elemento_inicial+cuadros_que_conforman].addEventListener('mousedown',(e)=>{
    
                            if(e.which==3){
        
                                Todos_los_cuadros_semicorchea_melodia[numero_de_elemento_inicial].removeAttribute('Longitud_Semicorcheas');
                                Todos_los_cuadros_semicorchea_melodia[numero_de_elemento_inicial].removeAttribute('Inicial','Si');
                                for(var consiguientes=0;consiguientes<longitud;consiguientes++){
                                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento_inicial+consiguientes].setAttribute('Activado','No');
                                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento_inicial+consiguientes].classList.remove("Cuadro_Semicorcheas_Activado");
                                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento_inicial+consiguientes].classList.remove("borde_izquierdo_sin_modificar");
                                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento_inicial+consiguientes].classList.remove("borde_derecho_sin_modificar");
                                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento_inicial+consiguientes].setAttribute('Inicio_de_nota','No');
                                    Todos_los_cuadros_semicorchea_melodia[numero_de_elemento_inicial+consiguientes].removeAttribute('columna_para_iniciar');
                                }
                            
                            }
                        });
    
                        
                    //});
                };
            }



        });

        //************************************************************************* 
        

    });




    //BOTON PLAY Y STOP***********************************************************

    function reproducir_nota_secuenciador(frecuencia,duracion_MS,velocidad){

        //*********************************************************************** 
        var num_voces_osc_1;
        var detune_osc_1;
        var osc_bank_1;
        var hay_voces_en_oscilador_2;
        var num_voces_osc_2;
        var detune_osc_2;
        var osc_bank_2;
    
            Nodo_de_Paneo.pan.value = paneo_slider.value;
            Nodo_volumen_maestro.gain.value = volumen_maestro_slider.value/250; 
    
            setTimeout(()=>{
                impulse = impulseResponse(duracion_reverb_decay.value,1);
                convolver.buffer = impulse;
            }, 1);
    
            delay.delayTime.value = tiempo_entre_repeticiones_slider.value
            feedback.gain.value = feedback_eco_slider.value;
    
            //Desactivando voces del oscilador 1
            for(var i=0;i<num_voces_osc_1;i++){
                osc_bank_1[i].stop();
            }
    
            //Desactivando voces del oscilador 2 si las hay
            if(hay_voces_en_oscilador_2){
                for(var i=0;i<num_voces_osc_2;i++){
                    osc_bank_2[i].stop();
                }
            }
    
            //Variables oscilador 1
            num_voces_osc_1 = document.getElementById("Voces_osc_1").value;
            detune_osc_1 = document.getElementById("detune_1").value;
            
    
            //Variables Oscilador 2
            num_voces_osc_2 = document.getElementById("Voces_osc_2").value;
            detune_osc_2 = document.getElementById("detune_2").value;
    
            //Rellenando la variable para saber si el oscilador 2 esta activo o no
    
            hay_voces_en_oscilador_2 = (num_voces_osc_2!=0);
    
            //Obteniendo los tipos de onda
            validando_radio_tipo_onda_1();
            validando_radio_tipo_onda_2();
    
            //Obteniendo el tipo de filtro y creando el filtro
            validando_radio_tipo_filtro_y_creando_filtro();
    
            //Iniciando todas las voces del oscilador 1
    
            osc_bank_1 = new Array(num_voces_osc_1);
    
            for(var i=0;i<num_voces_osc_1;i++){
    
                var desafinacion = detune_osc_1;
    
                if(i==0){
    
                    osc_bank_1[i] = actx.createOscillator();
                    osc_bank_1[i].type = tipo_onda_1;
                    osc_bank_1[i].frequency.value=frecuencia;
                    osc_bank_1[i].detune.value=0;
                    osc_bank_1[i].start();
                    osc_bank_1[i].connect(nodo_ganancia_para_aplicar_adsr);
    
                }else{
    
                    if(i%2!=0){
    
                        osc_bank_1[i] = actx.createOscillator();
                        osc_bank_1[i].type = tipo_onda_1;
                        osc_bank_1[i].frequency.value=frecuencia;
                        osc_bank_1[i].detune.value=desafinacion;
                        osc_bank_1[i].start();
                        osc_bank_1[i].connect(nodo_ganancia_para_aplicar_adsr);
    
                    }else{
    
                        osc_bank_1[i] = actx.createOscillator();
                        osc_bank_1[i].type = tipo_onda_1;
                        osc_bank_1[i].frequency.value=frecuencia;
                        osc_bank_1[i].detune.value=-desafinacion;
                        osc_bank_1[i].start();
                        osc_bank_1[i].connect(nodo_ganancia_para_aplicar_adsr);
                        desafinacion = desafinacion/2;
                    }
    
                }  
            };
            
    
            //Inicializando las voces del oscilador 2 si es que las hay
    
            if(hay_voces_en_oscilador_2){
    
                osc_bank_2 = new Array(num_voces_osc_2);
    
                for(var i=0;i<num_voces_osc_2;i++){
    
                    var desafinacion = detune_osc_2;
    
                    if(i==0){
    
                        osc_bank_2[i] = actx.createOscillator();
                        osc_bank_2[i].type = tipo_onda_2;
                        osc_bank_2[i].frequency.value=frecuencia;
                        osc_bank_2[i].detune.value=0;
                        osc_bank_2[i].start();
                        osc_bank_2[i].connect(nodo_ganancia_para_aplicar_adsr);
    
                    }else{
    
                        if(i%2!=0){
    
                            osc_bank_2[i] = actx.createOscillator();
                            osc_bank_2[i].type = tipo_onda_2;
                            osc_bank_2[i].frequency.value=frecuencia;
                            osc_bank_2[i].detune.value=desafinacion;
                            osc_bank_2[i].start();
                            osc_bank_2[i].connect(nodo_ganancia_para_aplicar_adsr);
                        }else{
    
                            osc_bank_2[i] = actx.createOscillator();
                            osc_bank_2[i].type = tipo_onda_2;
                            osc_bank_2[i].frequency.value=frecuencia;
                            osc_bank_2[i].detune.value=-desafinacion;
                            osc_bank_2[i].start();
                            osc_bank_2[i].connect(nodo_ganancia_para_aplicar_adsr);
    
                            desafinacion = desafinacion/2;
                        }
    
                    }
    
                    } 
                };
    
            
            //INICIANDO AMPLIFICADOR ADSR
    
            nodo_ganancia_para_aplicar_adsr.gain.cancelScheduledValues(actx.currentTime);
            hora_de_inicio_de_presion_de_una_nota = actx.currentTime;
            duracion_Ataque = (ataque_amplificador_slider.value/100)* maximo_tiempo_de_duracion_parametros_adsr;
            final_Ataque = hora_de_inicio_de_presion_de_una_nota + duracion_Ataque;
            duracion_Decay = (decaimiento_amplificador_slider.value/100)*maximo_tiempo_de_duracion_parametros_adsr;
            //Ataque
            nodo_ganancia_para_aplicar_adsr.gain.setValueAtTime(0,hora_de_inicio_de_presion_de_una_nota);
            nodo_ganancia_para_aplicar_adsr.gain.linearRampToValueAtTime(0.5,final_Ataque);
            //Decay + Sustain
            nodo_ganancia_para_aplicar_adsr.gain.setTargetAtTime((sostenimiento_amplificador_slider.value)/100,final_Ataque,duracion_Decay);
    
    
            //*********************************************************************** 
    
            setTimeout(function(){
    
                volumen_Antes_de_soltar = nodo_ganancia_para_aplicar_adsr.gain.value;
    
                nodo_ganancia_para_aplicar_adsr.gain.cancelScheduledValues(actx.currentTime);
                hora_de_final_de_presion_de_una_nota = actx.currentTime;
                duracion_Release = (relajamiento_amplificador_slider.value/8000)* maximo_tiempo_de_duracion_parametros_adsr;
                final_Release = hora_de_final_de_presion_de_una_nota + duracion_Release;
                nodo_ganancia_para_aplicar_adsr.gain.setValueAtTime(volumen_Antes_de_soltar,hora_de_final_de_presion_de_una_nota);
                nodo_ganancia_para_aplicar_adsr.gain.linearRampToValueAtTime(0,final_Release);
    
    
          //      setTimeout(function(){
                    //Desactivando voces del oscilador 1
    
                    for(var i=0;i<num_voces_osc_1;i++){
                        osc_bank_1[i].stop();
                    }
    
                    //Desactivando voces del oscilador 2 si las hay
                    if(hay_voces_en_oscilador_2){
                        for(var i=0;i<num_voces_osc_2;i++){
                            osc_bank_2[i].stop();
                        }
                    }
   //             },duracion_Release*1000);
    
            },duracion_MS-18-(velocidad*120));
    
    
        }
    
    
    function obtener_frecuencia_por_nombre_nota(nombre_nota){

        var frecuencia;

        switch(nombre_nota){

            case "C7":
                frecuencia=2093;
            break;

            case "B6":
                frecuencia=1975.53;
            break;

            case "A#6":
                frecuencia=1864.66;
            break;

            case "A6":
                frecuencia=1760;
            break;

            case "G#6":
                frecuencia=1661.22;
            break;

            case "G6":
                frecuencia=1567.98;
            break;

            case "F#6":
                frecuencia=1479.98;
            break;

            case "F6":
                frecuencia=1396.91;
            break;

            case "E6":
                frecuencia=1318.51;
            break;

            
            case "D#6":
                frecuencia=1244.51;
            break;

            case "D6":
                frecuencia=1174.66;
            break;

            case "C#6":
                frecuencia=1108.73;
            break;

            case "C6":
                frecuencia=1046.5;
            break;
            
            case "B5":
                frecuencia=987.77;
            break;

            case "A#5":
                frecuencia=932.33;
            break;

            case "A5":
                frecuencia=880;
            break;
            
            case "G#5":
                frecuencia=830.61;
            break;

            case "G5":
                frecuencia=783.99;
            break;

            case "F#5":
                frecuencia=739.99;
            break;

            case "F5":
                frecuencia=698.46;
            break;

            case "E5":
                frecuencia=659.26;
            break;

            case "D#5":
                frecuencia=622.25;
            break;

            case "D5":
                frecuencia=587.33;
            break;

            case "C#5":
                frecuencia=554.37;
            break;
            
            case "C5":
                frecuencia=523.25;
            break;

            case "B4":
                frecuencia=493.88;
            break;

            case "A#4":
                frecuencia=466;
            break;

            case "A4":
                frecuencia=440;
            break;

            case "G#4":
                frecuencia=415.3;
            break;

            case "G4":
                frecuencia=392;
            break;

            case "F#4":
                frecuencia=369.99;
            break;

            case "F4":
                frecuencia=349.23;
            break;

            case "E4":
                frecuencia=329.63;
            break;

            case "D#4":
                frecuencia=311.13;
            break;

            case "D4":
                frecuencia=293.66;
            break;

            case "C#4":
                frecuencia=277.18;
            break;

            case "C4":
                frecuencia=261.63;
            break;
        }

        return frecuencia;
    }

    //PLAY

    const barra_para_recorrer_melodias = document.getElementById("Barra_para_recorrer_melodias");
    
    const boton_play = document.querySelector(".Boton_Play");

    var tiempo_total_de_recorrido_segundos;
    var animacion_para_desplazar_barra;
    var podemos_reproducir_otra_vez;
    var semicorchea_acumulador_columna;
    podemos_reproducir_otra_vez = true;
    var funcion_repetitiva_semicorchea;
    var funcion_repetitiva_volver_a_recorrer;
    var no_se_pulsado_play = true;

    var boton_triangular = document.querySelector(".Play");

    boton_play.addEventListener('click',()=>{

        if(no_se_pulsado_play==true){
            boton_play.classList.add("mas_animacion_de_opacidad");
            boton_triangular.classList.add("mas_animacion_de_boton_play");

            podemos_reproducir_otra_vez = true;

            barra_para_recorrer_melodias.classList.add("Barra_de_barrido_aparecer");
    
            var tempo_input = document.getElementById("Tempo_entrada");
            
            var velocidad_por_corchea_en_segundos = 60/(tempo_input.value*4);
            tiempo_total_de_recorrido_segundos = velocidad_por_corchea_en_segundos*128;
    

            bombo_audio.playbackRate=tempo_input.value/60;
            snare_audio.playbackRate=tempo_input.value/100;
            snare2_audio.playbackRate=tempo_input.value/100;
            hithat_audio.playbackRate=tempo_input.value/100;
            clap_audio.playbackRate=tempo_input.value/100;
            shakers_audio.playbackRate=tempo_input.value/40;

            function frames(){
    
                animacion_para_desplazar_barra = barra_para_recorrer_melodias.animate([
                    //keyframes
                    {transform:"TranslateX(0px)"},
                    {transform:"TranslateX(+2490px)"}
    
                ],{
                    easing: "linear",
                    iterations:1,
                    duration: tiempo_total_de_recorrido_segundos*1000
                });
            
    
                //Reproduciendo notas por semicorchea
                
                semicorchea_acumulador_columna=1;
                var numero_elemento_encontrado_id;
                var numero_elemento;
                var frecuencia_nota;
                var duracion_nota_Semicorcheas;
                var acumulador_cuadros_grid = -1;

                //==================================================================================
                if(no_se_pulsado_play==true){
    
                    var columna_no_esta_libre = false;
                    
                    for(var i=0;i<37;i++){
        
                        if(Todos_los_cuadros_semicorchea_melodia[(semicorchea_acumulador_columna-1)+(128*i)].getAttribute('Activado')=='Si'){

                            if(Todos_los_cuadros_semicorchea_melodia[(semicorchea_acumulador_columna-1)+(128*i)].getAttribute('Inicio_de_nota')=='Si'){

                                columna_no_esta_libre=true;
                                numero_elemento_encontrado_id = Todos_los_cuadros_semicorchea_melodia[semicorchea_acumulador_columna+(128*i)-1].id;
                                numero_elemento = obtener_numero_de_elemento(obtener_nota(numero_elemento_encontrado_id),obtener_posicion(numero_elemento_encontrado_id));
                                frecuencia_nota = obtener_frecuencia_por_nombre_nota(obtener_nota(numero_elemento_encontrado_id));
                                duracion_nota_Semicorcheas = parseInt(Todos_los_cuadros_semicorchea_melodia[semicorchea_acumulador_columna+(128*i)-1].getAttribute('Longitud_Semicorcheas'));

                            }


                        }

                    }
                    
                    if(columna_no_esta_libre){
        
                        reproducir_nota_secuenciador(frecuencia_nota,duracion_nota_Semicorcheas*1000*velocidad_por_corchea_en_segundos,velocidad_por_corchea_en_segundos);

                    }

                    semicorchea_acumulador_columna++;
        //=======================================================================
                    
        
                    acumulador_cuadros_grid++;

                    for(var u=0;u<6;u++){

                        if(acumulador_cuadros_grid!=0){
                            Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)-1].classList.remove("Cuadro_semicorchea_barrido");
                        }else{
                            Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)+15].classList.remove("Cuadro_semicorchea_barrido");
                        }
                        
                        Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)].classList.add("Cuadro_semicorchea_barrido");
                        
                        switch (u) {
                            case 0:

                                if(Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)].getAttribute("Activado")=="Si"){
                                    //console.log("b");
                                    
                                    
                                    bombo_audio.play();
                                }
                            
                            break;
                            case 1:

                                if(Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)].getAttribute("Activado")=="Si"){
                                    
                                    snare_audio.play();
                                }

                            break;
                        
                            case 2:

                                if(Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)].getAttribute("Activado")=="Si"){
                                
                                    snare2_audio.play();
                                }

                            break;

                            case 3:

                                if(Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)].getAttribute("Activado")=="Si"){
                                    
                                    hithat_audio.play();
                                }

                            break;

                            case 4:

                                if(Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)].getAttribute("Activado")=="Si"){
                                    
                                    clap_audio.play();
                                }

                            break;

                            case 5:

                                if(Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)].getAttribute("Activado")=="Si"){

                                    shakers_audio.play();
                                }

                            break;

                        }

                    };

                }
    



                //===============================================================================
                
                if(no_se_pulsado_play==true){
                    funcion_repetitiva_semicorchea = setInterval(()=>{
    
                        if(podemos_reproducir_otra_vez){
        
                            var columna_no_esta_libre = false;
                            
                            for(var i=0;i<37;i++){
        
                                if(Todos_los_cuadros_semicorchea_melodia[(semicorchea_acumulador_columna-1)+(128*i)].getAttribute('Activado')=='Si'){
        
                                    if(Todos_los_cuadros_semicorchea_melodia[(semicorchea_acumulador_columna-1)+(128*i)].getAttribute('Inicio_de_nota')=='Si'){
        
                                        columna_no_esta_libre=true;
                                        numero_elemento_encontrado_id = Todos_los_cuadros_semicorchea_melodia[semicorchea_acumulador_columna+(128*i)-1].id;
                                        numero_elemento = obtener_numero_de_elemento(obtener_nota(numero_elemento_encontrado_id),obtener_posicion(numero_elemento_encontrado_id));
                                        frecuencia_nota = obtener_frecuencia_por_nombre_nota(obtener_nota(numero_elemento_encontrado_id));
                                        duracion_nota_Semicorcheas = parseInt(Todos_los_cuadros_semicorchea_melodia[semicorchea_acumulador_columna+(128*i)-1].getAttribute('Longitud_Semicorcheas'));
        
                                    }
        
        
                                }
        
                            }
                            
                            if(columna_no_esta_libre){
        
                                reproducir_nota_secuenciador(frecuencia_nota,duracion_nota_Semicorcheas*1000*velocidad_por_corchea_en_segundos,velocidad_por_corchea_en_segundos);
        
                            }
        
                            semicorchea_acumulador_columna++;
                        };
        
                        if(no_se_pulsado_play){

                            if(semicorchea_acumulador_columna==127){
                                semicorchea_acumulador_columna=1;
                            }
                            if(semicorchea_acumulador_columna==128){
                                semicorchea_acumulador_columna=1;
                            }
                        }    

                        //REPRODUCIENDO PATRON GRID

                        if(acumulador_cuadros_grid==15){
                            acumulador_cuadros_grid = -1;
                        }

                        acumulador_cuadros_grid++;

                        for(var u=0;u<6;u++){

                            if(acumulador_cuadros_grid!=0){
                                Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)-1].classList.remove("Cuadro_semicorchea_barrido");
                            }else{
                                Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)+15].classList.remove("Cuadro_semicorchea_barrido");
                            }
                            
                            Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)].classList.add("Cuadro_semicorchea_barrido");
                            
                            switch (u) {
                                case 0:

                                    if(Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)].getAttribute("Activado")=="Si"){


                                        bombo_audio.play();
                                    }
                                
                                break;
                                case 1:

                                    if(Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)].getAttribute("Activado")=="Si"){

                                        snare_audio.play();
                                    }

                                break;
                            
                                case 2:

                                    if(Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)].getAttribute("Activado")=="Si"){
                                        console.log("s2");
                                        snare2_audio.play();
                                    }

                                break;

                                case 3:

                                    if(Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)].getAttribute("Activado")=="Si"){

                                        hithat_audio.play();
                                    }

                                break;

                                case 4:

                                    if(Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)].getAttribute("Activado")=="Si"){

                                        clap_audio.play();
                                    }

                                break;

                                case 5:

                                    if(Todos_los_cuadros_semicorchea_ritmos[acumulador_cuadros_grid+(16*u)].getAttribute("Activado")=="Si"){
                                    
                                    //HUMANIZACION DE SHAKERS
                                    switch(acumulador_cuadros_grid){
                                        case 0:
                                        case 4:
                                        case 8:
                                        case 12:
                                        nodo_shakers.gain.value = 1;
                                        console.log(1);
                                        break;
                                        
                                        case 1:
                                        case 3:
                                        case 5:
                                        case 7:
                                        case 9:
                                        case 11:
                                        case 13:
                                        case 15:
                                        nodo_shakers.gain.value = 0.4;
                                        console.log(0.5);
                                        break;

                                        case 2:
                                        case 6:
                                        case 10:
                                        case 14:
                                        nodo_shakers.gain.value = 0.7;
                                        console.log(0.75);
                                        break;

                                    }
                                        shakers_audio.play();
                                    }

                                break;

                            }

                        };


                    },velocidad_por_corchea_en_segundos*1000);



                }

                return animacion_para_desplazar_barra.finish;
            };
    
    
            frames();
    
    
            funcion_repetitiva_volver_a_recorrer = setInterval(()=>{
    
                if(podemos_reproducir_otra_vez){
                    frames();
                }
                
            },(tiempo_total_de_recorrido_segundos*1000)+120);

            no_se_pulsado_play = false;

        }
    });


    //STOP

    const boton_stop = document.querySelector(".Boton_Stop");

    boton_stop.addEventListener('click',()=>{



        podemos_reproducir_otra_vez=false;
        animacion_para_desplazar_barra.cancel();
        clearInterval(funcion_repetitiva_semicorchea);
        clearInterval(funcion_repetitiva_volver_a_recorrer);

        no_se_pulsado_play = true;

        boton_triangular.classList.remove("mas_animacion_de_boton_play");
        boton_play.classList.remove("mas_animacion_de_opacidad");
        Todos_los_cuadros_semicorchea_ritmos.forEach((cuadro_sem_cor_rit)=>{
            cuadro_sem_cor_rit.classList.remove("Cuadro_semicorchea_barrido");
        })

    });

    //**********************************************************************


//FINAL SEQUENCIADOR DE MELODIAS******************************************************************************************

//SEQUENCIADOR DE BATERIA**********************************************************************

    const Todos_los_cuadros_semicorchea_ritmos = document.querySelectorAll('.Cuadro_Semicorchea_patron');

    Todos_los_cuadros_semicorchea_ritmos.forEach((cuadro_semicorchea_ritmo)=>{

        cuadro_semicorchea_ritmo.addEventListener('click',()=>{

            cuadro_semicorchea_ritmo.classList.add("Cuadro_semicorchea_patron_activado");
            cuadro_semicorchea_ritmo.setAttribute('Activado','Si');


        })

        cuadro_semicorchea_ritmo.addEventListener('mousedown',function(e){

            if(e.which==3){
                cuadro_semicorchea_ritmo.classList.remove("Cuadro_semicorchea_patron_activado");
                cuadro_semicorchea_ritmo.setAttribute('Activado','No');
            }

        });

    })


    //BOTON EMPAQUETADOR DE RITMOS

    var boton_para_guardar_ritmos = document.getElementById("Boton_guardar_Ritmo");
    const contenedor_ritmo_empaquetado = document.getElementById("Contenedor_ritmos_ocultos");
    boton_para_guardar_ritmos.addEventListener('mousemove',()=>{

        var ritmo_empaquetado ="(";

        for(var i=0;i<Todos_los_cuadros_semicorchea_ritmos.length;i++){

            if(Todos_los_cuadros_semicorchea_ritmos[i].getAttribute('Activado')=='Si'){

                ritmo_empaquetado = ritmo_empaquetado + 1;

            }else{

                ritmo_empaquetado = ritmo_empaquetado + 0;

            }

        }
        ritmo_empaquetado = ritmo_empaquetado + ")";
        contenedor_ritmo_empaquetado.value = ritmo_empaquetado;
        console.log(contenedor_ritmo_empaquetado.value);

    });


    //RITMOS DE REGALO

    const Todos_los_ritmos = document.querySelectorAll(".Ritmo_regalo");
    var comboBox_Ritmos = document.getElementById("Combo_de_RITMOS");

    //RITMO 1 2 1 2
    Todos_los_ritmos[0].setAttribute('data-ritmo',
    '(100010001000100000000000000000000000000000000000000000000000000000001000000010000000000000000000)');

    //Mombathon
    Todos_los_ritmos[1].setAttribute('data-ritmo',
    '(100010001000100000000000000000000001001000010010000000000000000000001000000010001111111111111111)');

    //REGUETON
    Todos_los_ritmos[2].setAttribute('data-ritmo',
    '(100010001000100000000000000000000001001000010010000000000000000000000000000000000000000000000000)');
    
    //Hip Hop
    Todos_los_ritmos[3].setAttribute('data-ritmo',
    '(100000011010000000001000000010000000000000000010101010101010101000000000000000000000000000000000)');

    //Vintage - soul
    Todos_los_ritmos[4].setAttribute('data-ritmo',
    '(100010001000100000000000000000000000100000001000001000100010001000000000000000000000000000000000)');

    //RITMO 2-4-8

    Todos_los_ritmos[5].setAttribute('data-ritmo',
    '(100010001000100000000000000000000000100000001000101010101010101000000000000000000000000000000000)');


    //BOTON BORRAR RITMO
    var boton_borrar_ritmo = document.querySelector(".boton_borrar_ritmo");

    boton_borrar_ritmo.addEventListener("click",()=>{

        Todos_los_cuadros_semicorchea_ritmos.forEach((cuadro_ser_cor_rit)=>{

            cuadro_ser_cor_rit.classList.remove("Cuadro_semicorchea_patron_activado");
            cuadro_ser_cor_rit.setAttribute('Activado','No');

        });

    })


    //BOTON DESEMPAQUETADOR DE RITMOS

    var boton_insertor_ritmos = document.getElementById("Boton_insc_rit");

    boton_insertor_ritmos.addEventListener('click',()=>{

        Todos_los_cuadros_semicorchea_ritmos.forEach((cuadro_ser_cor_rit)=>{

            cuadro_ser_cor_rit.classList.remove("Cuadro_semicorchea_patron_activado");
            cuadro_ser_cor_rit.setAttribute('Activado','No');

        })




        var ritmo = Todos_los_ritmos[comboBox_Ritmos.value].dataset.ritmo;

        for(var r=1;r<ritmo.length;r++){


            if(ritmo[r]!=")"){

                if(ritmo[r]=="1"){

                    Todos_los_cuadros_semicorchea_ritmos[r-1].classList.add("Cuadro_semicorchea_patron_activado");
                    Todos_los_cuadros_semicorchea_ritmos[r-1].setAttribute('Activado','Si');
            
            
                    Todos_los_cuadros_semicorchea_ritmos[r-1].addEventListener('mousedown',function(e){
            
                        if(e.which==3){
                            Todos_los_cuadros_semicorchea_ritmos[r-1].classList.remove("Cuadro_semicorchea_patron_activado");
                            Todos_los_cuadros_semicorchea_ritmos[r-1].setAttribute('Activado','No');
                        }
            
                    });

                }
            }


        }


    })
}


