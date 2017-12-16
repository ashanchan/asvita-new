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
  private searchCtr:number = 0;
  //==============================================================================
  public ngOnInit() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });

    this.form = this.formBuilder.group({
      userId: ['', Validators.compose([Validators.minLength(3)])],
      fullName: ['', Validators.compose([Validators.minLength(3)])],
      location: ['', Validators.compose([Validators.minLength(3)])]
    })
  }
  //==============================================================================
  public ngOnDestroy() {
  }
  //==============================================================================
  private onMessageReceived(message: HttpResponse): void {
    switch (message.event) {
      case 'onSearchSubmitResponse':
        if(this.searchCtr == 0){
          this.searchCtr++;
          this.onSubmit();
        }
        break;
    }
  }
  //==============================================================================
  onSubmit() {
    this.hasError = false;
    let httpRequest: HttpRequest = new HttpRequest();
    httpRequest.event = 'onSearchSubmit';
    httpRequest.formData = {};
    httpRequest.validate = true;
    httpRequest.formData['component'] = 'search';
    httpRequest.formData['urlExtn'] = 'read';
    httpRequest.formData['db'] = this.searchCtr == 0 ?'PATIENT_PROFILE' : 'DOCTOR_PROFILE';
    httpRequest.formData['queryField'] = { } ;
    httpRequest.formData['ignoreField'] = { userId: 1, fullName: 1, address:1, pin:1, state:1, city: 1, clinic: 1, _id: 0 };
    httpRequest.formData['recordLimit'] = 100;
    this.messageService.sendMessage(httpRequest);
  }
  //==============================================================================
}
