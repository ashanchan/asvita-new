import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs/Subscription';

import { HttpRequest } from '../../models/http-request';
import { HttpResponse } from '../../models/http-response';

@Component({
  selector: 'app-panel-right',
  templateUrl: './panel-right.component.html',
  styleUrls: ['./panel-right.component.css']
})

export class PanelRightComponent implements OnInit, OnDestroy {
  constructor(private messageService: MessageService, private dataService: DataService) { }
  //==============================================================================
  private subscription: Subscription = new Subscription();
  private details = {}
  private profileImgUrl: string = '';
  private isActive: boolean = false;
  //==============================================================================
  public ngOnInit() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
  }
  //==============================================================================
  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.isActive = false;
  }
  //==============================================================================
  private onMessageReceived(message: HttpResponse): void {
    switch (message.event) {
      case 'onLoginSuccess':
        this.getUserProfile();
        break;
      //===========================================  
      case 'onGetUserProfileResponse':
        this.dataService.setProfileData(message.responseData.data[0]);
        this.getConnection();
        break;

      case 'onGetConnectionResponse':
        this.dataService.setConnectionList(message.responseData.data);
        this.getSubscription();
        break;

      case 'onGetSubscriptionResponse':
        this.dataService.setSubscription('usedSpace', message.responseData.data.diskSpace);
        let profileInfo = this.dataService.getProfileData();
        let profileSub = this.dataService.getSubscription();
        this.details['profileImgUrl'] = this.dataService.getRootPath() + profileInfo['userId'] + '/profile.jpg';
        this.dataService.getFolderPath() + 'profile.jpg'
        this.details['userId'] = profileInfo['userId'];
        this.details['email'] = profileInfo['email'];
        this.details['fullName'] = profileInfo['fullName'];
        this.details['location'] = profileInfo['location'];
        this.details['registeredOn'] = profileSub['registeredOn'];
        this.details['addOn'] = profileSub['addOn'];
        this.details['startFrom'] = profileSub['startFrom'];
        this.details['expiresOn'] = profileSub['expiresOn'];
        this.details['diskSpace'] = profileSub['diskSpace'];
        this.details['usedSpace'] = profileSub['usedSpace'];
        this.getPrescription();
        break;

      case 'onGetPrescriptionResponse':
        this.dataService.setPrescriptionData(message.responseData.data);
        this.messageService.sendMessage({ event: 'onPrescriptionUpdated' });
        this.onPanelLoaded();
        break;

      case 'onSelfDestroy':
        this.ngOnDestroy();
        break;  
    }
  }
  //==============================================================================
  getUserProfile() {
    let httpRequest: HttpRequest = new HttpRequest();
    httpRequest.event = 'onGetUserProfile';
    httpRequest.formData = {};
    httpRequest.validate = true;
    httpRequest.formData['component'] = 'rightPanel';
    httpRequest.formData['db'] = this.dataService.getUserMode() === "DOC" ? 'DOCTOR_PROFILE' : 'PATIENT_PROFILE';
    httpRequest.formData['queryField'] = { "userId": this.dataService.getUserId() };
    httpRequest.formData['recordLimit'] = 1;
    httpRequest.formData['urlExtn'] = 'read';
    this.messageService.sendMessage(httpRequest);
  }
  //==============================================================================
  getPrescription() {
    if (this.dataService.getUserMode() === "PAT") {
      let httpRequest: HttpRequest = new HttpRequest();
      httpRequest.event = 'onGetPrescription';
      httpRequest.formData = {};
      httpRequest.validate = true;
      httpRequest.formData['component'] = 'rightPanel';
      httpRequest.formData['db'] = 'PRESCRIPTION';
      httpRequest.formData['queryField'] = { "patientId": this.dataService.getUserId() };
      httpRequest.formData['recordLimit'] = 10;
      httpRequest.formData['sortOnField'] = { 'recordDate': -1 };
      httpRequest.formData['urlExtn'] = 'read';
      this.messageService.sendMessage(httpRequest);
    }
    else {
      this.onPanelLoaded();
    }
  }
  //================================================================================
  getSubscription() {
    let httpRequest: HttpRequest = new HttpRequest();
    httpRequest.event = 'onGetSubscription';
    httpRequest.formData = {};
    httpRequest.validate = true;
    httpRequest.formData['component'] = 'utils';
    httpRequest.formData['request'] = 'diskspace';
    httpRequest.formData['urlExtn'] = 'read';
    this.messageService.sendMessage(httpRequest);
  }
  //================================================================================
  getConnection() {
    let connection = this.dataService.getProfileData().connection;
    let connectionReq = this.dataService.getProfileData().connectionReq;
    let findConnection = connection.concat(connectionReq);
    let httpRequest: HttpRequest = new HttpRequest();
    httpRequest.event = 'onGetConnection';
    httpRequest.formData = {};
    httpRequest.validate = true;
    httpRequest.formData['component'] = 'rightPanel';
    httpRequest.formData['db'] = this.dataService.getUserMode() === "PAT" ? 'DOCTOR_PROFILE' : 'PATIENT_PROFILE';
    httpRequest.formData['queryField'] = { "userId": { $in: findConnection } };
    httpRequest.formData['ignoreField'] = { userId: 1, fullName: 1, _id: 0 };
    httpRequest.formData['recordLimit'] = 100;
    httpRequest.formData['urlExtn'] = 'read';
    this.messageService.sendMessage(httpRequest);
  }
  //================================================================================
  private onPanelLoaded() {
    this.isActive = true;
    this.messageService.sendMessage({ event: 'onPanelLoaded' });
  }
  //================================================================================

}