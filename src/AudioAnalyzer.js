import {AudioVisualizer} from "./AudioVisualizer";
import {AudioVisualizerTotal} from "./AudioVisualizerTotal";
import {AudioVisualizerFrequency} from './AudioVisualizerFrequency';

export class AudioAnalyzer {

    constructor() {
        const canvas = document.querySelector('#canvas');
        const canvas2 = document.querySelector('#canvas2');
        const canvas3 = document.querySelector('#canvas3');
        canvas.width = window.innerWidth;
        canvas2.width = window.innerWidth;
        canvas3.width = window.innerWidth;


        console.log('Audio Analyzer initialized');
        this.audioContext = new (
            window.AudioContext || window.webkitAudioContext
        )();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = Math.pow(8,4);
        this.analyser.smoothingTimeConstant = 0.2;
        var bufferLength = this.analyser.frequencyBinCount;
//        var bufferLength = 4096;
        this.dataArray = new Uint8Array(bufferLength);
        this.dataFrequencyArray = new Uint8Array(bufferLength);
        this.dataArrayTotalMaxLength = 50000;
        this.dataArrayTotal = new Array(this.dataArrayTotalMaxLength);
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.visual = new AudioVisualizer({canvas: canvas, detail: 1});
        this.visualFrequency = new AudioVisualizerFrequency({canvas: canvas2, detail: 1});
        this.visualTotal = new AudioVisualizerTotal({canvas: canvas3, detail: 1});

        requestAnimationFrame(() => {
            this.tick()
        });
    }


    loadSource(URL) {
        window.fetch(URL)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.audioBuffer = audioBuffer;

                this.visual.draw({audioData: this.dataArray});
                this.visualFrequency.draw({audioData: this.dataFrequencyArray});
            });
    }

    tick() {
        let fpsInterval = 30;
        let now = Date.now();
        let elapsed = now - this.then;
        // if enough time has elapsed, draw the next frame
        if (elapsed > fpsInterval) {
//            this.analyser.getByteTimeDomainData(this.dataArray);
            this.analyser.getByteTimeDomainData(this.dataArray);
            this.analyser.getByteFrequencyData(this.dataFrequencyArray);

            for (var i = 0; i < this.dataArray.length; i = i+48) {
                this.dataArrayTotal.push(this.dataArray[i]);
            }
            if(this.dataArrayTotal.length > this.dataArrayTotalMaxLength){
                this.dataArrayTotal.splice(0,this.dataArrayTotal.length - this.dataArrayTotalMaxLength);
            }
//            this.dataArrayTotal.push(...this.dataArray);
            this.visual.draw({audioData: this.dataArray});
            this.visualFrequency.draw({audioData: this.dataFrequencyArray});
            this.visualTotal.draw({audioData: this.dataArrayTotal});
            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            this.then = now - (
                elapsed % fpsInterval
            );
            // Put your drawing code here
        }
        requestAnimationFrame(()=>{this.tick()});
    }

    play() {
        var offset = this.pausedAt;

        console.log('play');
        console.log(this.audioContext);
        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = this.audioBuffer;
        this.audioSource.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.audioSource.start(0, offset);
        this.pausedAt = 0;
        this.then = 0;

    }

    pause() {
        console.log(this.audioContext);
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.analyser.getByteFrequencyData(this.dataFrequencyArray);
        console.log(this.dataArray);
        console.log(this.dataFrequencyArray);

        setTimeout(()=>{
            this.pausedAt = this.audioContext.currentTime;
            this.audioSource.stop();
        },500)
    }

    stop() {
        console.log('stop');
        this.pausedAt = 0;
        this.audioSource.stop();
    }
}

