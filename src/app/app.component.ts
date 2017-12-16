import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from './services/http.service';
import { HttpRequest } from './models/http-request';
import { HttpResponse } from './models/http-response';
import { DataService } from './services/data.service';
import { MessageService } from './services/message.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

//==============================================================================
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  private httpServiceSubscription;
  private currentEvent: string = '';
  private popUpEvent: any = { header: '', content: '' };
  private loader: any;
  private ignoreFields: {} = { __v: 0, _id: 0 }
  //==============================================================================
  constructor(private httpService: HttpService, private dataService: DataService, private messageService: MessageService) { }
  //==============================================================================
  public ngOnInit(): void {
    this.dataService.setServerPath('http://localhost:1616/');
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
    this.loader = document.getElementById('overlay');
  }
  //==============================================================================
  public ngOnDestroy(): void {
    alert('ngOnDestroy of app');
//    this.httpServiceSubscription.unsubscribe();
//    this.subscription.unsubscribe();
  }
  //==============================================================================
  private onMessageReceived(event): void {
    if (event.event !== 'onToggleLoader') {
      this.currentEvent = event.event;
      switch (this.currentEvent) {
        case 'onOpenModal':
          this.openPopUp(event);
          break;

        case 'onLoginSubmit':
        case 'onLoginForgotSubmit':
        case 'onLoginRegisterSubmit':
        case 'onGetUserProfile':
        case 'onGetPrescription':
        case 'onGetSubscription':
        case 'onGetConnection':
        case 'onProfileSubmit':
        case 'onPrescriptionSubmit':
        case 'onGraphRecordSubmit':
        case 'onGetGraphRecord':
        case 'onSearchSubmit':
        case 'onResetSubmit':
          if (!event.formData['ignoreField']) {
            event.formData['ignoreField'] = { __v: 0, _id: 0 };
          }
          this.makeHttpRequest(event)
          break;

        case 'removeRecordById':
          let httpRequest: HttpRequest = new HttpRequest();
          httpRequest.event = 'removeRecordById';
          httpRequest.formData = {};
          httpRequest.validate = true;
          httpRequest.formData['db'] = event.data.db;
          httpRequest.formData['idx'] = event.data.idx;
          httpRequest.formData['urlExtn'] = 'delete';
          this.makeHttpRequest(httpRequest)
          break;

        case 'onSelfDestroy':
          this.ngOnDestroy();
          break;
      }
    }
  }
  //==============================================================================
  private makeHttpRequest(httpRequest: HttpRequest): void {
    this.toggleLoader(true);
    this.httpServiceSubscription = this.httpService.getApiData(httpRequest)
      .subscribe(
      data => {
        this.onHttpResponse(data.response, true)
      },
      err => {
        this.onHttpResponse(err, false)
      })
  }
  //==============================================================================
  private onHttpResponse(data, success) {
    this.toggleLoader(false);
    let responseData: HttpResponse = new HttpResponse();
    responseData.event = this.currentEvent + 'Response';
    //alert('emitting '+responseData.event);
    if (success) {
      responseData.responseCode = data.responseCode;
      responseData.responseData = data.data;
      responseData.success = data.success;
    }
    else {
      responseData.responseCode = 400;
      responseData.responseData = { message: 'Error Connecting to Server' };
      responseData.success = false;
    }
    this.messageService.sendMessage(responseData);
    // this.httpServiceSubscription.unsubscribe();
  }
  //==============================================================================
  private openPopUp(event) {
    this.popUpEvent = event;
    document.getElementById('popup-modal').click();
  }
  //==============================================================================
  private closePopUp(success) {
    let popupEvent = {}
    popupEvent['event'] = this.currentEvent + 'Response';
    this.messageService.sendMessage(popupEvent);
  }
  //==============================================================================
  private toggleLoader(mode) {
    let st = mode ? "block" : "none";
    this.loader.style = "display: " + st;
    this.messageService.sendMessage({ event: 'onToggleLoader', mode: mode });
  }
  //==============================================================================
  //==============================================================================
}
