export class TimeLineGraphModel {
    constructor(
        public data = {
            x: [],
            y: [],
            name: '',
            type: 'timeline',
            mode: "candlestick",
            animate: true,
            autoRange: true
        }
    ) { }
}
