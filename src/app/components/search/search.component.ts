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
  private records:Array<any> = [];
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
      userId: ['', Validators.compose([Validators.minLength(8)])],
      name: ['', Validators.compose([Validators.minLength(3)])],
      location: ['', Validators.compose([Validators.minLength(3)])]
    })
  }
  //==============================================================================
  public ngOnDestroy() {
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
    httpRequest.component = 'login';
    httpRequest.event = 'onLoginForgotSubmit';
    httpRequest.urlExtn = 'login';
    httpRequest.formData = this.form._value;
    httpRequest.validate = false;
    httpRequest.formData['mode'] = 'fyp';
    this.messageService.sendMessage(httpRequest);
  }
  //==============================================================================
}
