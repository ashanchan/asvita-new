import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { HttpRequest } from '../../models/http-request';
import { HttpResponse } from '../../models/http-response';

@Component({
  selector: 'app-change',
  templateUrl: './change.component.html'
})
export class ChangeComponent implements OnInit, OnDestroy {
  constructor(private formBuilder: FormBuilder, private messageService: MessageService, private dataService: DataService, private router: Router) { }
  //==============================================================================
  private form;
  private hasError: boolean = false;
  private errMsg: string = '';
  private subscription: Subscription = new Subscription();
  //==============================================================================
  public ngOnInit() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });

    this.form = this.formBuilder.group({
      password: ['Ashtra123', Validators.compose([Validators.required, Validators.minLength(8)])],
      newpassword: ['Ashtra123', Validators.compose([Validators.required, Validators.minLength(8)])],
      conpassword: ['Ashtra123', Validators.compose([Validators.required, Validators.minLength(8)])],
      email: [this.dataService.getProfileData().email]
    })
  }
  //==============================================================================
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  //==============================================================================
  private onMessageReceived(message: HttpResponse): void {
    switch (message.event) {
      case 'onResetSubmitResponse':
          this.hasError = true;
          this.errMsg = message.responseData.message;
        break;
    }
  }
  //==============================================================================
  onSubmit() {
    this.hasError = false;
    if (this.form._value.newpassword !== this.form._value.conpassword) {
      this.hasError = true;
      this.errMsg = "New Password and Confirm Password doesn't match"
    }
    else {
      let httpRequest: HttpRequest = new HttpRequest();
      httpRequest.event = 'onResetSubmit';
      httpRequest.formData = this.form._value;
      httpRequest.validate = true;
      httpRequest.formData['component'] = 'login';
      httpRequest.formData['mode'] = 'reset';
      httpRequest.formData['db'] = 'user';
      httpRequest.formData['freeEntry'] = false;
      httpRequest.formData['recordLimit'] = 1;
      httpRequest.formData['urlExtn'] = 'read';
      this.messageService.sendMessage(httpRequest);
    }
  }
  //==============================================================================
}
