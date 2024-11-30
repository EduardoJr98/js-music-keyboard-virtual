const pianoKeys = document.querySelectorAll(".piano-keys .key");
const volumeSlider = document.querySelector(".volume-slider input");
const keysCheck = document.querySelector(".keys-check input");

let mapedKeys = [];
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let volume = 1; // Controle de volume global

const playTune = (key) => {
  const audio = new Audio(`src/tunes/${key}.wav`);
  const track = audioContext.createMediaElementSource(audio);
  const distortion = audioContext.createWaveShaper();
  const gainNode = audioContext.createGain();

  // Configurando curva de distorção
  function makeDistortionCurve(amount) {
    const n_samples = 256;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }
  distortion.curve = makeDistortionCurve(400); // Ajuste a intensidade da distorção
  distortion.oversample = "4x";

  // Ajustando volume
  gainNode.gain.value = volume;

  // Conectando os elementos
  track.connect(distortion);
  distortion.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Tocar áudio
  audio.play();

  // Ativar animação de tecla
  const clickedKey = document.querySelector(`[data-key="${key}"]`);
  clickedKey.classList.add("active");
  setTimeout(() => {
    clickedKey.classList.remove("active");
  }, 150);
};

pianoKeys.forEach((key) => {
  key.addEventListener("click", () => playTune(key.dataset.key));
  mapedKeys.push(key.dataset.key);
});

document.addEventListener("keydown", (e) => {
  if (mapedKeys.includes(e.key)) {
    playTune(e.key);
  }
});

const handleVolume = (e) => {
  volume = e.target.value;
};

const showHideKeys = () => {
  pianoKeys.forEach((key) => key.classList.toggle("hide"));
};

volumeSlider.addEventListener("input", handleVolume);
keysCheck.addEventListener("click", showHideKeys);
