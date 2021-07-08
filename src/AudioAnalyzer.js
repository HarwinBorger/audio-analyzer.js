import {AudioVisualizer} from "./AudioVisualizer";
import {AudioVisualizerTotal} from "./AudioVisualizerTotal";
import {AudioVisualizerFrequency} from './AudioVisualizerFrequency';
import {AudioVisualizerFrequencyNormalized} from './AudioVisualizerFrequencyNormalized';

export class AudioAnalyzer {

    constructor() {
        const canvas1 = document.querySelector('#canvas1');
        const canvas2 = document.querySelector('#canvas2');
        const canvas3 = document.querySelector('#canvas3');
        const canvas4 = document.querySelector('#canvas4');
        canvas1.width = window.innerWidth;
        canvas2.width = window.innerWidth;
        canvas3.width = window.innerWidth;
        canvas4.width = window.innerWidth;


        console.log('Audio Analyzer initialized');
        this.audioContext = new (
            window.AudioContext || window.webkitAudioContext
        )();
        // main analyser
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = this.getFftSize(8);
        this.analyser.smoothingTimeConstant = 0.2;
        // optimized analyser
        this.analyserOptimized = this.audioContext.createAnalyser();
        this.analyserOptimized.fftSize = this.getFftSize(4);
        //
        var bufferLength = this.analyser.frequencyBinCount;
        var bufferLength2 = this.analyserOptimized.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
        this.dataArrayOptimized = new Uint8Array(bufferLength2);
        this.dataFrequencyArray = new Uint8Array(bufferLength);
        // set first analyser data
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.analyser.getByteFrequencyData(this.dataFrequencyArray);
        this.analyserOptimized.connect(this.analyser);
        this.analyserOptimized.getByteTimeDomainData(this.dataArray);

        // long wave capture
        this.dataArrayTotalMaxLength = 5000;
        this.dataArrayTotal = new Array(this.dataArrayTotalMaxLength);


        // Visualizers
        this.visual = new AudioVisualizer({canvas: canvas1});
        this.visualFrequency = new AudioVisualizerFrequency({canvas: canvas2});
        this.visualFrequencyNormalized = new AudioVisualizerFrequencyNormalized({
            canvas: canvas3,
            sampleRate: this.audioContext.sampleRate,
            frequencyBinCount: this.analyser.frequencyBinCount
        });
        this.visualTotal = new AudioVisualizerTotal({canvas: canvas4});

        requestAnimationFrame(() => {
            this.tick()
        });
    }

    /**
     *
     * @param number
     * @returns {number} 1-8
     */
    getFftSize(number){
        return 32 * Math.pow(2, number);
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
        let fpsInterval = 60;
        let now = Date.now();
        let elapsed = now - this.then;
        // if enough time has elapsed, draw the next frame
        if (elapsed > fpsInterval) {
//            this.analyser.getByteTimeDomainData(this.dataArray);
            this.analyserOptimized.getByteTimeDomainData(this.dataArrayOptimized);
            this.analyser.getByteTimeDomainData(this.dataArray);
            this.analyser.getByteFrequencyData(this.dataFrequencyArray);
//            this.analyser.getFloatFrequencyData(this.dataFrequencyArray);

            for (var i = 0; i < this.dataArrayOptimized.length; i = i + 48) {
                this.dataArrayTotal.push(this.dataArrayOptimized[i]);
            }
            if (this.dataArrayTotal.length > this.dataArrayTotalMaxLength) {
                this.dataArrayTotal.splice(0, this.dataArrayTotal.length - this.dataArrayTotalMaxLength);
            }
//            this.dataArrayTotal.push(...this.dataArray);
            this.visual.draw({audioData: this.dataArray});
            this.visualFrequency.draw({audioData: this.dataFrequencyArray});
            this.visualFrequencyNormalized.draw({audioData: this.dataFrequencyArray});
            this.visualTotal.draw({audioData: this.dataArrayTotal});
            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            this.then = now - (
                elapsed % fpsInterval
            );
            // Put your drawing code here
        }
        requestAnimationFrame(() => {
            this.tick()
        });
    }

    play() {
        var offset = this.pausedAt;

        console.log('play');
        console.log(this.audioContext);
        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = this.audioBuffer;
        this.audioSource.connect(this.analyserOptimized);
        this.analyser.connect(this.audioContext.destination);
        this.audioSource.start(0, offset);
        this.pausedAt = 0;
        this.then = 0;

    }

    pause() {
        console.log(this.audioContext);
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.analyser.getByteFrequencyData(this.dataFrequencyArray);
//        this.analyser.getFloatFrequencyData(this.dataFrequencyArray);
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

