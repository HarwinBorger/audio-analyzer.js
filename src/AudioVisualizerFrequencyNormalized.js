export class AudioVisualizerFrequencyNormalized{
    constructor(props) {
        //canvas
        this.canvas = props.canvas;
        this.height = this.canvas.height;
        this.width = this.canvas.width;
        //context
        this.context = this.canvas.getContext('2d');
        //audio
        this.sampleRate = props.sampleRate;
        this.frequencyBinCount = props.frequencyBinCount;
        this.maxHz = this.sampleRate/2;
        this.Hz = (this.maxHz) / this.frequencyBinCount;
        this.octaveHz = 17.75; // 31.5 first octave  https://www.cirrusresearch.co.uk/blog/wp-content/uploads/2011/11/Octave-Band.jpg
        console.log(31.5 * Math.pow(2,10));
        console.log(`Normalizer at Hz: ${this.Hz} on a samplerate of ${this.sampleRate}`);

    }


    draw(props) {
        const audioData = props.audioData;
        let octaveHz = this.octaveHz;

        const sliceWidth = this.calculateSliceWidth(octaveHz);
        console.log(sliceWidth);

        this.context.lineWidth = 1;
        this.context.strokeStyle = '#098cf0';
        this.context.clearRect(0, 0, this.width, this.height);

        let currentWidth = sliceWidth;
        this.context.lineWidth = currentWidth;
        let x = this.context.lineWidth;
        let correction = currentWidth / 2;

        for (const [key,item] of audioData.entries()) {
            if(((key)*this.Hz) > octaveHz){
//                console.log(`${key}, ${octaveHz}, ${key*this.Hz}`);
                octaveHz = octaveHz * 2;
                currentWidth = this.calculateSliceWidth(octaveHz);
                correction = currentWidth / 2;
                this.drawOctaveLine(x);
                this.context.lineWidth = Math.max(1,currentWidth);
            }

            const y = this.height - (item / 255.0) * this.height;
            this.context.strokeStyle = `hsl(${300-75/this.height*y},100%,${95-(80/this.height)*y}%)`;
            this.context.beginPath();
            this.context.moveTo(x+correction, this.height );
            this.context.lineTo(x+correction, y);
            this.context.stroke();
            x += currentWidth;
        }
    }

    /**
     * @description Draw Octave Line
     * @param x
     */
    drawOctaveLine(x){
        this.context.lineWidth = 1;
        this.context.strokeStyle = `hsl(100,0%,50%)`;
        this.context.beginPath();
        this.context.moveTo(x , this.height );
        this.context.lineTo(x, 0);
        this.context.stroke();
    }

    /**
     * @description Calculate Slice Width for each data point at an octave
     * @param octaveHz
     * @returns {number}
     */
    calculateSliceWidth(octaveHz){
        return (this.width / 10) / (octaveHz / this.Hz);
    }
}
