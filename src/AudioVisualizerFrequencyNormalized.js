export class AudioVisualizerFrequencyNormalized{
    constructor(props) {
        this.canvas = props.canvas;
        this.detail = props.detail;
    }


    draw(props) {
        const audioData = props.audioData;
        const canvas = this.canvas;
        const height = canvas.height;
        const width = canvas.width;
        const context = canvas.getContext('2d');
        const sliceWidth = width / 12;

        context.lineWidth = 1;
        context.strokeStyle = '#098cf0';
        context.clearRect(0, 0, width, height);

        let double = 1;
        let currentWidth = sliceWidth / double;
        context.lineWidth = currentWidth;
        let x = context.lineWidth;
        let correction = currentWidth / 2;

        for (const [key,item] of audioData.entries()) {

            if(key === double){
                double = double *2;
                currentWidth = sliceWidth / double;
                correction = currentWidth / 2;
                context.lineWidth = 1;
                //draw line
                context.strokeStyle = `hsl(100,0%,50%)`;
                context.beginPath();
                context.moveTo(x , height );
                context.lineTo(x, 0);
                context.stroke();
                context.lineWidth = currentWidth;
            }

            const y = height - (item / 255.0) * height;
            context.strokeStyle = `hsl(${300-75/height*y},80%,${100-85/height*y}%)`;
            context.beginPath();
            context.moveTo(x+correction, height );
            context.lineTo(x+correction, y);
            context.stroke();
            x += currentWidth;
        }
    }
}
