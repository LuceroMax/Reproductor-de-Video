  let contenedor = document.querySelector(".container"),
  video = contenedor.querySelector("video"),
  barraProgreso = contenedor.querySelector(".progress-bar"),
  videoTimeLine = contenedor.querySelector(".video-timeline"),
  currentTimeLine = contenedor.querySelector(".current-time"),
  videoDuration = contenedor.querySelector(".video-duration"),
  volumenBtn = contenedor.querySelector(".volume i"),
  controlVolumen = contenedor.querySelector(".left input"), 
  atrasar = contenedor.querySelector(".skip-backward i"),
  delantar = contenedor.querySelector(".skip-forward i"),
  speedBtn = contenedor.querySelector(".playback-speed span"),
  speedOptions = contenedor.querySelector(".speed-options"),
  play = contenedor.querySelector(".play-pause i"),
  minimizarBtn = contenedor.querySelector(".pic-in-pic span"),
  maximizarBtn = contenedor.querySelector(".fullscreen i");
  let timer;
  const hideControls = () =>{
    if(video.paused) return; // si el video es pausado retorna
    timer = setTimeout(() =>{
        contenedor.classList.remove("show-controls");
    },2500);
  };
  hideControls();
  contenedor.addEventListener("mousemove", ()=>{
      contenedor.classList.add("show-controls");
      clearTimeout(timer);
  hideControls();
  });

  const formatTime = time =>{
    //obteniendo segundos,minutos y horas
    let segundos = Math.floor(time % 60),
     minutos = Math.floor(time / 60) % 60,
     horas = Math.floor(time / 3600);
     //agregando 0 al principio si el valor particular es menor que 10
     segundos = segundos < 10 ? `0${segundos}` : segundos;
     minutos = minutos < 10 ? `0${minutos}` : minutos;
     horas = horas < 10 ? `0${horas}` : horas;

     if(horas == 0){ // si hora 0 retorna minutos y segundos de lo contrario devolver todo
      return `${minutos}:${segundos}`
     }
      return `${horas}:${minutos}:${segundos}`

  }
//linea de tiempo
  video.addEventListener("timeupdate",(e)=>{
    let { currentTime, duration } = e.target; //Obteniendo hora actual y duracion del video.
    let porcentaje = ( currentTime / duration) * 100; //obteniendo porcentaje
    barraProgreso.style.width = `${porcentaje}%`; //pasando porcentaje como porcentaje de ancho de barra 
    currentTimeLine.innerText = formatTime(currentTime);
  });
//Duracion de video

  video.addEventListener("loadeddata", (e) =>{
    videoDuration.innerText = formatTime(e.target.duration);
  });
  // tiempo de linea de tiempo
  videoTimeLine.addEventListener("click", e =>{
    let timelineWidth = videoTimeLine.clientWidth;
    video.currentTime = (e.offsetX / timelineWidth) * video.duration;
  });

  //tiempo de linea SOSTENIDO
  const draggableProgressBar = e =>{
    let timelineWidth = videoTimeLine.clientWidth;
    barraProgreso.style.width = `${e.offsetX}px`;
    video.currentTime = (e.offsetX / timelineWidth) * video.duration;
    currentTimeLine.innerText = formatTime(video.currentTime);
  }
    videoTimeLine.addEventListener("mousedown", ()=>{
      videoTimeLine.addEventListener("mousemove", draggableProgressBar);
    });

    contenedor.addEventListener("mouseup", ()=>{
      videoTimeLine.removeEventListener("mousemove", draggableProgressBar);
    });
  //nuevo

videoTimeLine.addEventListener("mousemove",(e)=>{
  const progressTime = videoTimeLine.querySelector("span");
  let offsetX = e.offsetX;
  progressTime.style.left = `${offsetX}px`;
  let timelineWidth = videoTimeLine.clientWidth;
  let porcent = (e.offsetX / timelineWidth) * video.duration;
  progressTime.innerText = formatTime(porcent);
});

//minimizar
  minimizarBtn.addEventListener("click",()=>{
    video.requestPictureInPicture();
  });
//maximizar
  maximizarBtn.addEventListener("click",()=>{
    contenedor.classList.toggle("fullscreen");//alternar el modo de pantalla completa
    if(document.fullscreenElement){ //si el video ya está en modo de pantalla completa
      maximizarBtn.classList.replace("fa-compress", "fa-expand");
      return document.exitFullscreen();//salir al modo de pantalla completa y volver
    }
    maximizarBtn.classList.replace("fa-expand","fa-compress");
    contenedor.requestFullscreen();
  });
  //velocidad de video
  speedBtn.addEventListener("click",()=>{
    speedOptions.classList.toggle("show");//toggle muestra y desmuestra la clase show
  });

    speedOptions.querySelectorAll("li").forEach(option =>{
      option.addEventListener("click", ()=>{ //agregando evento de clic en todas las opciones de velocidad
        video.playbackRate = option.dataset.speed; //opción de pasar el valor del dataset(data-speed del html) como valor de reproducción de video
        speedOptions.querySelector(".active").classList.remove("active"); //removemos el active
        option.classList.add("active"); //añadimos la clase active a la opcion que seleccionemos
      });
    });
  document.addEventListener("click",(e)=>{ //ocultar opciones de velocidad al hacer clic en el documento
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded"){
    speedOptions.classList.remove("show"); //remueve la clase show
    }

  })
  //adelantar y atrasar 5s
delantar.addEventListener("click", () =>{
  video.currentTime += 5;
});
atrasar.addEventListener("click", () =>{
  video.currentTime -= 5;
});

//funcion mute y controlador de volumen
volumenBtn.addEventListener("click",()=>{
  if(!volumenBtn.classList.contains("fa-volume-high")){ //si el ícono de volumen no es el ícono de volumen alto
    video.volume = 0.5; //pasando valor 0.5 como volumen del video
    volumenBtn.classList.replace("fa-volume-xmark","fa-volume-high");

    }else{
      video.volume = 0.0; //pasando valor 0.0 como volumen del video 
    volumenBtn.classList.replace("fa-volume-high", "fa-volume-xmark"); 
    }
    controlVolumen.value = video.volume; // update slide
});

  controlVolumen.addEventListener("input", (e)=>{
    video.volume = e.target.value;//pasa el volumen del control deslizante como volumen de video
    if(e.target.value == 0){
      volumenBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }else{
    volumenBtn.classList.replace("fa-volume-xmark","fa-volume-high");
      
    }
  })

//funcion de reproduccion de video al boton
  play.addEventListener("click",() => {
    video.paused ? video.play() : video.pause();
  });

//funcion de reproduccion de video al clickear el video
  video.addEventListener("click",() =>{
    video.paused ? video.play() : video.pause(); 
  });

  //cambio de icono boton play y pause
  video.addEventListener("play",() =>{
    play.classList.replace("fa-play","fa-pause");
  });

  video.addEventListener("pause",() =>{
    play.classList.replace("fa-pause","fa-play");
  });



// Download bottom https://drive.google.com/uc?export=download&id=1AIOIfHdJRvsRZZfV9clQyhxKZji7eBIb
  const downloadBtn = document.querySelector(".download-btn");
  const fileLink = "https://drive.google.com/uc?export=download&id=1AIOIfHdJRvsRZZfV9clQyhxKZji7eBIb"
  
  const initTimer = () => {
    if(downloadBtn.classList.contains("disable-timer")) {
        return location.href = fileLink;
    }
    let timer = downloadBtn.dataset.timer;
    downloadBtn.classList.add("timer");
    downloadBtn.innerHTML = `Tu descargar comenzará en <b>${timer}</b> segundos`;
    const initCounter = setInterval(() => {
        if(timer > 0) {
            timer--;
            return downloadBtn.innerHTML = `Tu descargar comenzará en <b>${timer}</b> segundos`;
        }
        clearInterval(initCounter);
        location.href = fileLink;
        downloadBtn.innerText = "Tu video se esta Descargando...";
        setTimeout(() => {
            downloadBtn.classList.replace("timer", "disable-timer");
            downloadBtn.innerHTML = `<span class="icon material-symbols-rounded">vertical_align_bottom</span>
                                     <span class="text">Descargar De Nuevo</span>`;
        }, 2000);
    }, 1000);
}
downloadBtn.addEventListener("click", initTimer);