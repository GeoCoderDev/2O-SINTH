class CronometroConCentisegundos {
  isRunning = false;
  isPaused = false;
  startTime;
  elapsedTime = 0;
  requestAnimationID;
  elementoHTML;

  /**
   * Esta clase crea un cronometro con centisegundos
   * @param {HTMLElement} elementoHTML
   */
  constructor(elementoHTML) {
    this.elementoHTML = elementoHTML;
  }

  iniciar() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;

    this.startTime = Date.now() - this.elapsedTime;

    const iniciarCronometro = () => {
      const tiempoTranscurrido = this.isPaused
        ? this.elapsedTime
        : Date.now() - this.startTime;
      const segundosTotales = tiempoTranscurrido / 1000;
      const minutos = Math.floor(segundosTotales / 60);
      const segundos = Math.floor(segundosTotales % 60);
      const centisegundos = Math.floor((tiempoTranscurrido % 1000) / 10);

      const tiempoMostrado = `${minutos}:${this.formatoDosDigitos(
        segundos
      )}.${this.formatoDosDigitos(centisegundos)}`;

      this.elementoHTML.textContent = tiempoMostrado;
      if (!this.isPaused) {
        this.requestAnimationID = requestAnimationFrame(iniciarCronometro);
      }
    };

    iniciarCronometro();
  }

  pausar() {
    if (this.isPaused) return;

    this.isRunning = false;
    this.isPaused = true;


    this.elapsedTime = Date.now() - this.startTime;
    if (this.requestAnimationID) cancelAnimationFrame(this.requestAnimationID);
  }

  parar() {

    this.elementoHTML.textContent = "0:00:00";
    this.elapsedTime = 0;

    this.isRunning = false;
    this.isPaused = false;


    this.elapsedTime = 0;

    if (this.requestAnimationID) cancelAnimationFrame(this.requestAnimationID);
  }

  reiniciarYSeguir() {
    this.startTime = Date.now();
    this.elapsedTime = 0;
  }

  formatoDosDigitos(valor) {
    return valor < 10 ? `0${valor}` : `${valor}`;
  }

  /**
   *
   * @param {Number} segundosTranscurridos
   */
  establecerTiempoTranscurrido(segundosTranscurridos) {
    this.elapsedTime = segundosTranscurridos * 1000;

    const segundosTotales = segundosTranscurridos;
    const minutos = Math.floor(segundosTotales / 60);
    const segundos = Math.floor(segundosTotales % 60);
    const centisegundos = Math.floor(
      ((segundosTranscurridos * 1000) % 1000) / 10
    );

    const tiempoMostrado = `${minutos}:${this.formatoDosDigitos(
      segundos
    )}.${this.formatoDosDigitos(centisegundos)}`;

    this.elementoHTML.textContent = tiempoMostrado;
  }
}
