import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs/Subscription';

import { HttpRequest } from '../../models/http-request';
import { HttpResponse } from '../../models/http-response';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit, OnDestroy {
  constructor(private messageService: MessageService, private dataService: DataService) { }
  //==============================================================================
  private subscription: Subscription = new Subscription();
  private showDropDown:boolean = false;
  private medicalRecord = null;
  //==============================================================================
  public ngOnInit() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
    this.setDashboard();
  }
  //==============================================================================
  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.medicalRecord = null;
  }
  //==============================================================================
  private onMessageReceived(message: HttpResponse): void {
    switch (message.event) {
      case 'onPanelLoaded':
       this.setDashboard();
        break;
    }
  }
  //==============================================================================
  private setDashboard() {
    try{
      if (this.dataService.getUserMode() === "PAT") {
        this.medicalRecord = this.dataService.getPrescriptionData()[0];
        this.medicalRecord['doctorName'] = this.dataService.findConnection(this.medicalRecord['doctorId'])[0].fullName;
        this.medicalRecord['doctorImg'] = this.dataService.getRootPath() + this.medicalRecord['doctorId'] + '/profile.jpg';
      }
    }
    catch(e)
    {

    }
  }
  //==============================================================================

}