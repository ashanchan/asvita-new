import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { GraphService } from '../../services/graph.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs/Subscription';

import { HttpRequest } from '../../models/http-request';
import { HttpResponse } from '../../models/http-response';
import { PieGraphModel } from '../../models/pie.graph.model';
import { BarGraphModel } from '../../models/bar.graph.model';
import { TimeLineGraphModel } from '../../models/timeline.graph.model';
import { LayoutGraphModel } from '../../models/layout.graph.model';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  providers: [GraphService]
})

export class GraphComponent implements OnInit, OnDestroy {
  constructor(private formBuilder: FormBuilder, private messageService: MessageService, private dataService: DataService, private graphService: GraphService) { }
  //==============================================================================
  private form;
  private readonly: boolean = false;
  private subscription: Subscription = new Subscription();

  private idx: number = 0;
  private showForm: boolean = false;
  private totalBox: number = 0;
  private graphRecord: Array<any> = [];
  private showRecord: boolean = false;
  private colWidth: string = 'col-sm-6 col-md-6';
  private extraTitle: string = '';
  private mode: string = '';
  private oldMode: string = '';
  
  private graphData: any;
  private graphLayout: any;
  private graphTitle: string;
  private recordId:any;

  private trivia: {}[] = [
    {
      label: '<b>Body Mass Index</b>',
      db: 'WEIGHT',
      info: '<ul><li><b>Below 18.5</b> : Underweight</li><li><b>18.5 - 24.9</b> : Normal</li><li><b>25 - 29.9</b> : Overweight</li><li><b>30 - 34.9</b> : Obese Class I</li><li><b>35 - 40</b> : Obese Class II</li><li><b>Above 40</b> : Obese Class III</li></ul>'
    },
    {
      label: '<b>Blood Sugar</b>',
      db: 'SUGAR',
      info: '<ul><li><b>Fasting</b> :<br>Normal for person without diabetes : 70–99 mg/dl<br>someone with diabetes	80–130 mg/dl </li><li><b>2 hours after meals</b> : <br>Normal for person without diabetes : Less than 140 mg/dl<br>someone with diabetes	Less than 180 mg/dl </li></ul>'
    },
    {
      label: '<b>Blood Pressure</b>',
      db: 'BP',
      info: '<ul><li><b>Normal</b> : systolic: less than 120 mmHg. diastolic: less than 80mmHg</li><li><b>At risk (prehypertension)</b> : systolic: 120–139 mmHg. diastolic: 80–89 mmHg</li><li><b>High</b> : systolic: 140 mmHg or higher. diastolic: 90 mmHg or higher</li></ul>'
    },
    {
      label: '<b>Temperature</b>',
      db: 'TEMPERATURE',
      info: `Not everyone's "normal" body temperature is the same. Yours could be a whole degree different than someone else's. A German doctor in the 19th century set the standard at 98.6 F, but more recent studies say the baseline for most people is closer to 98.2 F.<br><br>For a typical adult, body temperature can be anywhere from 97 F to 99 F. Babies and children have a little higher range: 97.9 F to 100.4 F.<br><br>Your temperature doesn't stay same all day, and it will vary throughout your lifetime, too. Some things that cause your temperature to move around during the day include:<ul><li>How active you are</li><li>What time of day it is</li><li>Your age</li><li>Your sex</li><li>What you've eaten or had to drink</li><li>If you're a woman) where you are in your menstrual cycle</li></ul>`
    }
  ]

  //==============================================================================
  public ngOnInit() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
    this.totalBox = this.trivia.length;
    this.setForm();
  }
  //==============================================================================
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  //==============================================================================
  private onMessageReceived(message: HttpResponse): void {
    switch (message.event) {
      case 'onGraphRecordSubmitResponse':
        this.onRecordClick(-1, 'back');
        break;
      case 'onGetGraphRecordResponse':
        this.showForm = false;
        this.dataService.setGraphData(this.trivia[this.idx]['db'], message.responseData.data);
        this.graphRecord = message.responseData.data;
        this.showForm = true;
        break;

      case 'onOpenModalResponse':
        this.messageService.sendMessage({event:'removeRecordById', data : {db:this.trivia[this.idx]['db'], idx:this.recordId}});    
        break;

      case 'removeRecordByIdResponse':
        this.onRecordClick(this.idx, 'View');
        break;
    }
    this.readonly = true;
  }
  //==============================================================================
  onSubmit() {
    let httpRequest: HttpRequest = new HttpRequest();
    httpRequest.event = 'onGraphRecordSubmit';
    httpRequest.formData = this.form._value;
    httpRequest.validate = true;
    httpRequest.formData['component'] = 'graph';
    httpRequest.formData['db'] = this.trivia[this.idx]['db'];
    httpRequest.formData['urlExtn'] = 'create';
    this.messageService.sendMessage(httpRequest);
  }
  //=======================================
  private getGraphRecord() {
    let httpRequest: HttpRequest = new HttpRequest();
    httpRequest.event = 'onGetGraphRecord';
    httpRequest.formData = {};
    httpRequest.validate = true;
    httpRequest.formData['component'] = 'graph';
    httpRequest.formData['db'] = this.trivia[this.idx]['db'];
    httpRequest.formData['urlExtn'] = 'read';
    httpRequest.formData['ignoreField'] = { __v: 0, userId: 0 };
    httpRequest.formData['sortOnField'] = "recordDate";
    this.messageService.sendMessage(httpRequest);
  }
  //=======================================
  private setForm() {
    var tDate = this.dataService.getStringDate();
    this.form = this.formBuilder.group({
      recordDate: [tDate, Validators.compose([Validators.required])],
      height: [170, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(3)])],
      weight: [70, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
      fasting: [100, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(3)])],
      normal: [100, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(3)])],
      systolic: [120, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
      diastolic: [80, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
      pulse: [72, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
      temperature: [98.6, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(5)])]
    })
  }
  //=======================================
  private onRecordClick(idx: number, mode: string) {
    this.idx = idx;
    this.mode = mode;
    let ele: any;
    this.showForm = idx !== -1;

    if (idx !== -1) {
      this.graphTitle = this.trivia[this.idx]['label'];
      this.extraTitle = ' > ' + this.mode + ' Record';
    }

    this.colWidth = 'col-sm-12 col-md-12';

    switch (this.mode.toLowerCase()) {
      case 'back':
        this.extraTitle = '';
        this.colWidth = 'col-sm-6 col-md-6';
        break

      case 'view':
        this.getGraphRecord();
        break

      case 'graph':
        setTimeout(() => this.showGraph(), 100);
        break;

      case 'refresh':
        this.mode = this.oldMode;
        this.onRecordClick(idx, this.oldMode)
        return;
        
      default:
        break
    }

    for (let i = 0; i < this.totalBox; i++) {
      ele = document.getElementsByName('info-box')[i];
      ele['style'] = 'display:none';
      if (i === idx || idx === -1) {
        ele['style'] = 'display:block';
      }
    }
    this.readonly = this.mode === 'Add' ? false : true;
    this.oldMode = this.mode;
  }
  //=======================================
  private showGraph() {
    let graphDiv = document.querySelector("#graphDiv #plotDiv");
    try {
      this.resetGraph();
      this.graphService.deleteGraph(graphDiv);
    }
    catch (e) {
    }
    finally {
      setTimeout(() => this.plotGraph(), 100);
    }
  }
  //=======================================
  private resetGraph() {
    this.showForm = true;
    this.graphData = [];
    this.graphLayout = new LayoutGraphModel().layout;
    let plotData, plot = [], label, dataCtr, lblCtr, i, j = null;
    delete this.graphLayout['xaxis'];
    delete this.graphLayout['yaxis'];
    plotData = this.dataService.getGraphData(this.trivia[this.idx]['db']);
    dataCtr = plotData.length;
    label = Object.keys(plotData[0]);
    lblCtr = label.length - 1;

    this.graphLayout.title = this.graphTitle;
    
    for (i = 0; i < lblCtr; i++) {
      plot[i] = new TimeLineGraphModel();
      plot[i].data.name = this.dataService.titleCase(label[i]);
    }

    for (i = 0; i < dataCtr; i++) {
      for (j = 0; j < lblCtr; j++) {
        plot[j].data.x.push(plotData[i].recordDate);
        plot[j].data.y.push(plotData[i][label[j]]);
      }
    }

    for (i = 1; i < lblCtr; i++) {
      this.graphData.push(plot[i]);
    }
  }
  //=======================================
  private plotGraph() {
    let graphDiv = document.querySelector("#graphDiv #plotDiv");
    this.graphService.plotGraph(graphDiv, this.graphData, this.graphLayout);
  }
  //=======================================
  private onRemoveClick(idx) {
    this.recordId = idx;
    let popupEvent = {}
    popupEvent['event'] = 'onOpenModal';
    popupEvent['header'] = "Confirmation";
    popupEvent['content'] = "Are you sure to delete this record?";
    this.messageService.sendMessage(popupEvent);
  }
  //=======================================
}
