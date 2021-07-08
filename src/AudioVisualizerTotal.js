export class AudioVisualizerTotal{
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
        let x = 0;
        const sliceWidth = (width) / audioData.length;

        context.lineWidth = 2;
         context.strokeStyle = '#098cf0';
//        context.strokeStyle = this.colors[Math.round(Math.random() * 6)];
        context.clearRect(0, 0, width, height);

        for (const item of audioData) {
            context.beginPath();
            const y = height - (item / 255.0) * height;
            context.strokeStyle = `hsl(260,80%,${65-40/height*y}%)`;
            context.moveTo(x, height /2);
            context.lineTo(x, y);
            context.stroke();
            x += sliceWidth;
        }
    }
}
