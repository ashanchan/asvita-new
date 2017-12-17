export class BarGraphModel {
    constructor(
        public data = {
            x: [],
            y: [],
            name: '',
            type: 'bar',
            orientation: 'v',
            animate: true,
            autoRange: true
        }
    ) { }
}
