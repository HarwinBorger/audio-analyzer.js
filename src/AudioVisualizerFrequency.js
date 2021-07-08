export class AudioVisualizerFrequency{
    constructor(props) {
        this.canvas = props.canvas;
        this.colors = [
            '#f09f09',
            '#f90f90',
            '#90f90f',
            '#09f09f',
            '#0F90F9',
            '#9F09F0',
        ];
        this.detail = props.detail;
    }


    draw(props) {
        const audioData = props.audioData;
        const canvas = this.canvas;
        const height = canvas.height;
        const width = canvas.width;
        const context = canvas.getContext('2d');
        let x = 0;
        const sliceWidth = (width * this.detail) / audioData.length;

        context.lineWidth = 1;
         context.strokeStyle = '#098cf0';
//        context.strokeStyle = this.colors[Math.round(Math.random() * 6)];
        context.clearRect(0, 0, width, height);

        for (const item of audioData) {
            const y = height - (item / 255.0) * height;
            context.strokeStyle = `hsl(${300-75/height*y},80%,${90-85/height*y}%)`;
            context.beginPath();
            context.moveTo(x, height );
            context.lineTo(x, y);
            context.stroke();
            x += sliceWidth;
        }
    }
}
