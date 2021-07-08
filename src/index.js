import {AudioAnalyzer} from "./AudioAnalyzer";


console.log('test');
const audio = new AudioAnalyzer();
audio.loadSource('./src/maxi.mp3');
//audio.loadSource('./src/beat.mp3');
//audio.loadSource('./src/extreme.mp3');
//audio.loadSource('./src/child.mp3');
//audio.loadSource('./src/20.mp3');
const playButton = document.querySelector('#play');
const stopButton = document.querySelector('#stop');
const pauseButton = document.querySelector('#pause');
playButton.onclick = () => audio.play();
stopButton.onclick = () => audio.stop();
pauseButton.onclick = () => audio.pause();

