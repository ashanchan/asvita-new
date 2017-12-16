export class LayoutGraphModel {
    constructor(
        public layout = {
            title: "",
            autosize: true,
            showlegend: true,
            font: {
                color: '#000',
                size: 12
            },
            legend: {
                font: {
                    color: '#000',
                    size: 12
                }
            },
            xaxis: { title: '' },
            yaxis: { title: '' },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent'
        }
    ) { }
}
