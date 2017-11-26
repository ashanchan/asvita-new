import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { HttpRequest } from '../../models/http-request';
import { HttpResponse } from '../../models/http-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {
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
      email: ['ashanchan@yahoo.com', Validators.compose([Validators.required, Validators.email])],
      password: ['Ashtra123', Validators.compose([Validators.required, Validators.minLength(8)])]
    })
  }
  //==============================================================================
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  //==============================================================================
  private onMessageReceived(message: HttpResponse): void {
    switch (message.event) {
      case 'onLoginSubmitResponse':
        if (message.success) {
          this.dataService.setToken(message.responseData.token);
          this.dataService.setUserId(message.responseData.userId);
          this.dataService.setUserMode();
          this.dataService.setSubscription('registeredOn',message.responseData.registeredOn);
          this.dataService.setSubscription('addOn',message.responseData.subscription.addOn);
          this.dataService.setSubscription('startFrom',message.responseData.subscription.startFrom);
          this.dataService.setSubscription('expiresOn',message.responseData.subscription.expiresOn);
          this.dataService.setSubscription('diskSpace',message.responseData.subscription.diskSpace);
          this.messageService.sendMessage({ event: 'onLoginSuccess' });
          this.router.navigate(['./dashboard']);
        }
        else {
          this.hasError = true;
          this.errMsg = message.responseData.message;
        }
        break;
    }
  }
  //==============================================================================
  onSubmit() {
    this.hasError = false;
    let httpRequest: HttpRequest = new HttpRequest();
    httpRequest.event = 'onLoginSubmit';
    httpRequest.formData = this.form._value;
    httpRequest.validate = false;
    httpRequest.formData['component'] = 'login';
    httpRequest.formData['mode'] = 'login';
    httpRequest.formData['db'] = 'user';
    httpRequest.formData['freeEntry'] = true;
    httpRequest.formData['recordLimit'] = 1;
    httpRequest.formData['urlExtn'] = 'read';
    this.messageService.sendMessage(httpRequest);
  }
  //==============================================================================
}