export class AudioVisualizerTotal{
    constructor(props) {
        this.canvas = props.canvas;
    }


    draw(props) {
        const audioData = props.audioData;
        const canvas = this.canvas;
        const height = canvas.height;
        const width = canvas.width;
        const context = canvas.getContext('2d');
        let x = 0;
        const sliceWidth = (width) / audioData.length;

        context.lineWidth = 1;
         context.strokeStyle = '#098cf0';
//        context.strokeStyle = this.colors[Math.round(Math.random() * 6)];
        context.clearRect(0, 0, width, height);

        context.beginPath();
        context.moveTo(0, height / 2);

        for (const item of audioData) {
            const y = (item / 255.0) * height;
            context.lineTo(x, y);
            x += sliceWidth;
        }
        context.lineTo(x, height / 2);
        context.stroke();
    }
}
