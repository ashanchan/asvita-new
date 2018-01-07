import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs/Subscription';

import { HttpRequest } from '../../models/http-request';
import { HttpResponse } from '../../models/http-response';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  constructor(private formBuilder: FormBuilder, private messageService: MessageService, private dataService: DataService) { }
  //==============================================================================
  private records: Array<any> = [];
  private form;
  private hasError: boolean = false;
  private errMsg: string = '';
  private subscription: Subscription = new Subscription();
  private searchRecord: Array<any> = [];
  private connectionMode:string = '';
  //==============================================================================
  public ngOnInit() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });

    this.form = this.formBuilder.group({
      userId: [''],
      fullName: [''],
      mobile: ['9320069001'],
      email: ['']
    })
  }
  //==============================================================================
  public ngOnDestroy() {
  }
  //==============================================================================
  private onMessageReceived(message: HttpResponse): void {
    switch (message.event) {
      case 'onSearchSubmitResponse':
        this.searchRecord = message.responseData.data[0];
        if (this.searchRecord) {
          this.searchRecord['profileUrl'] = this.dataService.getRootPath() + this.searchRecord['userId'] + '/profile.jpg';
          let isConnected = this.dataService.findConnection(this.searchRecord['userId']).length > 0;
          this.connectionMode = isConnected ? 'connected': 'not-connected';
        }
        break;
    }
  }
  //==============================================================================
  onSubmit() {
    this.createQuery();
    if (!this.hasError) {
      let httpRequest: HttpRequest = new HttpRequest();
      httpRequest.event = 'onSearchSubmit';
      httpRequest.formData = {};
      httpRequest.validate = true;
      httpRequest.formData['component'] = 'search';
      httpRequest.formData['urlExtn'] = 'read';
      httpRequest.formData['db'] = this.dataService.getUserMode() !== "DOC" ? 'DOCTOR_PROFILE' : 'PATIENT_PROFILE';
      httpRequest.formData['queryField'] = { $or: [{ userId: this.form._value.userId.trim() }, { mobile: this.form._value.mobile.trim() }] };
      httpRequest.formData['ignoreField'] = { userId: 1, fullName: 1, address: 1, pin: 1, state: 1, city: 1, clinic: 1, _id: 0 };
      httpRequest.formData['recordLimit'] = 1;
      this.messageService.sendMessage(httpRequest);
    }

  }
  //==============================================================================
  createQuery() {
    this.hasError = false;
    if (this.form._value.userId.trim() === '' && this.form._value.mobile.trim() === '') {
      this.hasError = false;
      this.errMsg = 'Enter Part of Query String';
    }
  }
  //==============================================================================
}
