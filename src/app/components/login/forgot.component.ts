import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs/Subscription';

import { HttpRequest } from '../../models/http-request';
import { HttpResponse } from '../../models/http-response';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html'
})

export class ForgotComponent implements OnInit, OnDestroy {
  constructor(private formBuilder: FormBuilder, private messageService: MessageService, private dataService: DataService) { }
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
      email: ['ashanchan@yahoo.com', Validators.compose([Validators.required, Validators.email])]
    })
  }
  //==============================================================================
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  //==============================================================================
  private onMessageReceived(message: HttpResponse): void {
    switch (message.event) {
      case 'onLoginForgotSubmitResponse':
        this.hasError = true;
        this.errMsg = message.responseData.message;
        break;
    }
  }
  //==============================================================================
  onSubmit() {
    this.hasError = false;
    let httpRequest: HttpRequest = new HttpRequest();
    httpRequest.event = 'onLoginForgotSubmit';
    httpRequest.formData = this.form._value;
    httpRequest.validate = false;
    httpRequest.formData['component'] = 'login';
    httpRequest.formData['mode'] = 'fyp';
    httpRequest.formData['db'] = 'user';
    httpRequest.formData['freeEntry'] = true;
    httpRequest.formData['recordLimit'] = 1;
    httpRequest.formData['urlExtn'] = 'read';
    this.messageService.sendMessage(httpRequest);
  }
  //==============================================================================
}
