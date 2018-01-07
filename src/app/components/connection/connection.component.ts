import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs/Subscription';

import { HttpRequest } from '../../models/http-request';
import { HttpResponse } from '../../models/http-response';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})

export class ConnectionComponent implements OnInit, OnDestroy {
  @Input() showDropDown: boolean;
  @Output() onConnectionSelected: EventEmitter<string> = new EventEmitter<string>();
  private connections: {}[] = [];
  private requests: {}[] = [];
  private currentConnection: string = '';
  private connectionIdx: number;

  constructor(private messageService: MessageService, private dataService: DataService) { }
  //==============================================================================
  private subscription: Subscription = new Subscription();
  //==============================================================================
  public ngOnInit() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
    setTimeout(()=> this.createConnection(), 250);
  }
  //==============================================================================
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  //==============================================================================
  private onMessageReceived(message: HttpResponse): void {
    switch (message.event) {
      case 'onPanelLoaded':
        break;
    }
  }
  //==============================================================================
  private createConnection() {
    let fullList = this.dataService.getConnectionList();
    let connection = this.dataService.getProfileData()['connection'];
    let requested = this.dataService.getProfileData()['connectionReq'];
    let ctr = connection.length;
    let ftr = fullList.length;
    let rtr = requested.length;

    for (let i = 0; i < ftr; i++) {
      for (let j = 0; j < ctr; j++) {
        if (fullList[i]['userId'] === connection[j]) {
          this.connections.push(fullList[i])
        }
      }

      for (let k = 0; k < ctr; k++) {
        if (fullList[i]['userId'] === requested[k]) {
          this.requests.push(fullList[i])
        }
      }
    }
  }
  //==============================================================================
  private setConnection(idx: number) {
    this.connectionIdx = idx;
    this.currentConnection = this.connections[this.connectionIdx]['userId'];
  }
  //==============================================================================
  private connectionSelected() {
    this.onConnectionSelected.emit(this.currentConnection);
  }
  //==============================================================================

}
