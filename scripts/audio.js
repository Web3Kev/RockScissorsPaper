// audio.js
let audioContext;


let popSoundBuffer;
let snapSoundBuffer;

let rockSoundBuffer ;
let scissorsSoundBuffer;
let paperSoundBuffer;
let oneSoundBuffer;
let twoSoundBuffer;
let threeSoundBuffer;

let tieSoundBuffer;
let winSoundBuffer;
let lostSoundBuffer;

let soundIsOn = localStorage.getItem('soundIsOn') !== 'false';

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  loadSounds();
}

async function loadSounds() {
    try {
        const pop = await fetch('./assets/pop.mp3');
        const snap = await fetch('./assets/snap.mp3');

        const rock = await fetch('./assets/rock.mp3');
        const scissors = await fetch('./assets/scissors.mp3');
        const paper = await fetch('./assets/paper.mp3');
        const one = await fetch('./assets/one.mp3');
        const two = await fetch('./assets/two.mp3');
        const three = await fetch('./assets/three.mp3');

        const tie = await fetch('./assets/tie.mp3');
        const win = await fetch('./assets/win.mp3');
        const lost = await fetch('./assets/lost.mp3');

        rockSoundBuffer = await audioContext.decodeAudioData(await rock.arrayBuffer());
        scissorsSoundBuffer = await audioContext.decodeAudioData(await scissors.arrayBuffer());
        paperSoundBuffer= await audioContext.decodeAudioData(await paper.arrayBuffer());
        oneSoundBuffer = await audioContext.decodeAudioData(await one.arrayBuffer());
        twoSoundBuffer = await audioContext.decodeAudioData(await two.arrayBuffer());
        threeSoundBuffer= await audioContext.decodeAudioData(await three.arrayBuffer());

        tieSoundBuffer = await audioContext.decodeAudioData(await tie.arrayBuffer());
        winSoundBuffer = await audioContext.decodeAudioData(await win.arrayBuffer());
        lostSoundBuffer= await audioContext.decodeAudioData(await lost.arrayBuffer());
        
        popSoundBuffer = await audioContext.decodeAudioData(await pop.arrayBuffer());
        snapSoundBuffer= await audioContext.decodeAudioData(await snap.arrayBuffer());

      } catch (error) {
        console.error("Error loading sounds:", error);
      }
}

function playSound(buffer, loop = false) {
    if (!audioContext || !buffer) return;
        
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.connect(audioContext.destination);
    source.start(0);
    return source;
}

function playRock() {
    if (soundIsOn && rockSoundBuffer) {
      playSound(rockSoundBuffer);
    }
}
function playScissors() {
    if (soundIsOn && scissorsSoundBuffer) {
      playSound(scissorsSoundBuffer);
    }
}
function playPaper() {
    if (soundIsOn && paperSoundBuffer) {
      playSound(paperSoundBuffer);
    }
}
function playThree() {
    if (soundIsOn && threeSoundBuffer) {
      playSound(threeSoundBuffer);
    }
}
function playTwo() {
    if (soundIsOn && twoSoundBuffer) {
      playSound(twoSoundBuffer);
    }
}
function playOne() {
    if (soundIsOn && oneSoundBuffer) {
      playSound(oneSoundBuffer);
    }
}

function playTie() {
    if (soundIsOn && tieSoundBuffer) {
      playSound(tieSoundBuffer);
    }
}

function playWin() {
    if (soundIsOn && winSoundBuffer) {
      playSound(winSoundBuffer);
    }
}

function playLost() {
    if (soundIsOn && lostSoundBuffer) {
      playSound(lostSoundBuffer);
    }
}

function playPopSound() {
    if (soundIsOn && popSoundBuffer) {
      playSound(popSoundBuffer);
    }
}

function playSnapSound() {
    if (soundIsOn && snapSoundBuffer) {
      playSound(snapSoundBuffer);
    }
  }



function toggleSound() {
  soundIsOn = !soundIsOn;
  localStorage.setItem('soundIsOn', soundIsOn);
  if (soundIsOn) {
    initAudio();
  } else {
    cleanupSounds();
  }
  updateSpeakerIcon();
}

function updateSpeakerIcon() {
  const speakerIcon = document.getElementById('speaker-icon');
  speakerIcon.src = soundIsOn ? '../assets/speaker-on.png' : '../assets/speaker-off.png';
  speakerIcon.alt = soundIsOn ? 'Speaker On' : 'Speaker Off';
}

function cleanupSounds() {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}

export { initAudio, playLost,playOne,playPaper,playRock,playScissors,playThree,playTie,playTwo,playWin,playPopSound,playSnapSound, toggleSound, updateSpeakerIcon, cleanupSounds };