import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs/Subscription';

import { HttpRequest } from '../../models/http-request';
import { HttpResponse } from '../../models/http-response';

@Component({
  selector: 'app-pat-profile',
  templateUrl: './pat-profile.component.html'
})

export class PatProfileComponent implements OnInit, OnDestroy {
  constructor(private formBuilder: FormBuilder, private messageService: MessageService, private dataService: DataService) { }
  //==============================================================================
  private form;
  private readonly: boolean = true;
  private medicalHistory = [];
  private subscription: Subscription = new Subscription();

  //==============================================================================
  public ngOnInit() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
    this.resetForm();
  }
  //==============================================================================
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  //==============================================================================
  private onMessageReceived(message: HttpResponse): void {
    switch (message.event) {
      case 'onProfileSubmitResponse':
        this.dataService.setProfileData(message.responseData.data);
        this.update(true);
        break;
    }
  }
  //==============================================================================
  onSubmit() {
    let httpRequest: HttpRequest = new HttpRequest();
    httpRequest.event = 'onProfileSubmit';
    httpRequest.formData = this.form._value;
    httpRequest.validate = true;
    httpRequest.formData['component'] = 'profile';
    httpRequest.formData['db'] = this.dataService.getUserMode() === "DOC" ? 'DOCTOR_PROFILE' : 'PATIENT_PROFILE';
    httpRequest.formData['queryField'] = { "userId": this.dataService.getUserId() };
    httpRequest.formData['recordLimit'] = 1;
    httpRequest.formData['urlExtn'] = 'update';
    this.messageService.sendMessage(httpRequest);
  }
  //=======================================
  private createMedicalHistory(medHistory): void {
    let medicalHistoryLabel = ['LBP', 'HBP', 'Diabetic', 'Heart', 'Liver', 'Kidney', 'Brain', 'Psycho', 'Lungs'];
    let labelCtr = medicalHistoryLabel.length;
    let modelCtr = medHistory.length;
    let checked: boolean;
    this.medicalHistory = [];
    for (var i = 0; i < labelCtr; i++) {
      checked = false;
      for (var j = 0; j < modelCtr; j++) {
        if (medicalHistoryLabel[i].toLowerCase() === medHistory[j].toLowerCase()) checked = true;
      }
      this.medicalHistory.push({ label: medicalHistoryLabel[i], checked: checked });
    }
  }
  //=======================================
  private resetForm() {
    let profileData = this.dataService.getProfileData();
    this.form = this.formBuilder.group({
      fullName: [profileData['fullName'], Validators.compose([Validators.required, Validators.minLength(5)])],
      address: [profileData['address'], Validators.compose([Validators.required, Validators.minLength(10)])],
      city: [profileData['city'], Validators.compose([Validators.required, Validators.minLength(3)])],
      pin: [profileData['pin'], Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
      state: [profileData['state'], Validators.compose([Validators.required, Validators.minLength(3)])],
      mobile: [profileData['mobile'], Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      sosPerson: [profileData['sosPerson'], Validators.compose([Validators.minLength(3)])],
      sosMobile: [profileData['sosMobile'], Validators.compose([Validators.minLength(10), Validators.maxLength(10)])],

      gender: [profileData['gender'], Validators.compose([Validators.required])],
      dob: [profileData['dob'], Validators.compose([])],
      height: [profileData['height'], Validators.compose([Validators.minLength(3), Validators.maxLength(3)])],
      weight: [profileData['weight'], Validators.compose([Validators.minLength(2), Validators.maxLength(3)])],

      medicalHistory: [profileData['medicalHistory']],
      lifeStyle: [profileData['lifeStyle']],
      medicalHistoryOther: [profileData['medicalHistoryOther']],
      notes: [profileData['notes']]
    })
    this.createMedicalHistory(profileData['medicalHistory']);
    this.update(this.readonly);
  }
  //=======================================
  private update(val: boolean) {
    this.readonly = val;
    if (this.readonly) {
      this.form.controls.gender.disable();
    }
    else {
      this.form.controls.gender.enable();
    }
  }
  //=======================================
  private onCheckBoxClicked(value, selected) {
    if (selected) {
      this.form.value['medicalHistory'].push(value);
    }
    else {
      let idx = this.form.value['medicalHistory'].indexOf(value);
      this.form.value['medicalHistory'].splice(idx, 1);
    }
  }
  //=======================================
}