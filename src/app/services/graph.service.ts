import * as Plotly from 'plotly.js/src/core';
import { Injectable } from '@angular/core';

declare let require: any;
Plotly.register([
  require('plotly.js/lib/pie'),
  require('plotly.js/lib/choropleth'),
  require('plotly.js/lib/bar'),
  require('plotly.js/lib/scattergeo'),
  require('plotly.js/lib/scatter'),
  require('plotly.js/lib/candlestick')
]);

@Injectable()
export class GraphService {
  public Plotly;
  constructor() {
    this.Plotly = Plotly;
  }
  //=======================================
  //=======================================
  public plotGraph(graphDiv, graphData, graphLayout) {
    let data = [];
    if (graphData.data) {
      data.push(graphData.data);
    }
    else {
      var ctr = graphData.length;
      for (let i = 0; i < ctr; i++) {
        data[i] = graphData[i].data;
      }
    }
    Plotly.plot(graphDiv, data, graphLayout);
  }
  //=======================================
  //=======================================
  public deleteGraph(graphDiv) {
    Plotly.purge(graphDiv);
  }
  //=======================================
  //=======================================
}
