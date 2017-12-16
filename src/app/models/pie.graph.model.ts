export class PieGraphModel {
    constructor(
        public data = {
            values: [],
            labels: [],
            name: '',
            type: 'pie',
            textposition: 'inside',
            hoverinfo: 'label+percent',
            hole: .5,
            rotation: 0
        }
    ) { }
}

