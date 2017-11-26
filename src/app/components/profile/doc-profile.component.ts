import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs/Subscription';

import { HttpRequest } from '../../models/http-request';
import { HttpResponse } from '../../models/http-response';

@Component({
  selector: 'app-doc-profile',
  templateUrl: './doc-profile.component.html'
})

export class DocProfileComponent implements OnInit, OnDestroy {
  constructor(private formBuilder: FormBuilder, private messageService: MessageService, private dataService: DataService) { }
  //==============================================================================
  private form;
  private readonly: boolean = true;
  private subscription: Subscription = new Subscription();
  private clinic: any[] = [];
  private clinicIdx: number = 0;
  private specialization: {}[] = [];
  private clinicDays: {}[] = [];
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
  private createSpecialization(specialization): void {
    let specializationLabel = ['Anesthesiologist', 'Cardiologist', 'Dentist', 'Dermatologist', 'Endocrinologist', 'ENT Doctor', 'Gastrologist', 'Gen Physician', 'Gen Surgeon', 'Gynecologist', 'Nephrologist', 'Neurologist', 'Oncologist', 'Ophthalmologist', 'Orthopedic', 'Pathologist', 'Pediatrician', 'Physio Therapist', 'Radiologists', 'Urologist'];

    let labelCtr = specializationLabel.length;
    let modelCtr = specialization.length;
    let checked: boolean;
    this.specialization = [];
    for (var i = 0; i < labelCtr; i++) {
      checked = false;
      for (var j = 0; j < modelCtr; j++) {
        if (specializationLabel[i].toLowerCase() === specialization[j].toLowerCase()) checked = true;
      }
      this.specialization.push({ label: specializationLabel[i], checked: checked });
    }
  }
  //=======================================
  private resetForm() {
    let profileData = this.dataService.getProfileData();
    this.form = this.formBuilder.group({
      fullName: [profileData['fullName'], Validators.compose([Validators.required, Validators.minLength(5)])],
      mobile: [profileData['mobile'], Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      qualification: [profileData['qualification'], Validators.compose([Validators.minLength(3)])],
      specialization: [profileData['specialization']],
      specializationOther: [profileData['specializationOther']],
      clinic: this.formBuilder.array([])
    })

    var clinicObj: object = { name: '', address: '', city: '', pin: '', state: '', contact: '', openTime: '', endTime: '', openDay: '' }
    for (let i = 0; i < 6; i++) {
      this.clinic = this.form.get('clinic');
      if (profileData['clinic'][i]) {
        this.clinic.push(this.createClinic(profileData['clinic'][i]));
      }
      else {
        this.clinic.push(this.createClinic(clinicObj));
      }
    }
    this.createSpecialization(profileData['specialization']);
    this.createClincDays();
  }
  //=======================================
  private update(val: boolean) {
    this.readonly = val;
  }
  //=======================================
  private createClinic(clinicObj: object): FormGroup {
    return this.formBuilder.group(clinicObj);
  }
  //=======================================
  private onClinicChange(idx: number) {
    this.clinicIdx = idx;
    this.createClincDays();
  }
  //=======================================
  private onCheckBoxClicked(comp, value, selected) {
    if (selected) {
      if (comp === 'specialization') {
        this.form.value['specialization'].push(value);
      }
      else {
        let days = this.form.value["clinic"][this.clinicIdx]['openDay'].split(',');
        days.push(value);
        this.form.value["clinic"][this.clinicIdx]['openDay'] = String(days);
      }
    }
    else {
      if (comp === 'specialization') {
        let idx = this.form.value['specialization'].indexOf(value);
        this.form.value['specialization'].splice(idx, 1);
      }
      else{
        let days = this.form.value["clinic"][this.clinicIdx]['openDay'].split(',');
        let idx = days.indexOf(value);
        days.splice(idx, 1);
        this.form.value["clinic"][this.clinicIdx]['openDay'] = String(days);
      }
    }
  }
  //=======================================
  private createClincDays() {
    let workingDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let clinicDayData = this.form.value['clinic'][this.clinicIdx]['openDay'].split(',');

    let labelCtr = workingDay.length;
    let modelCtr = clinicDayData.length;
    let checked: boolean;
    this.clinicDays = [];
    for (var i = 0; i < labelCtr; i++) {
      checked = false;
      for (var j = 0; j < modelCtr; j++) {
        if (workingDay[i] === clinicDayData[j]) checked = true;
      }
      this.clinicDays.push({ label: workingDay[i], checked: checked });
    }
  }
  //=======================================

}
