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
  private specialization = [];
  private days = [];

  private subscription: Subscription = new Subscription();
  private clinic: any[] = [];
  private clinicIdx: number = 0;
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
    let box: Array<any> = Array.from(document.getElementsByName('special'));
    let newSpecialization = [];
    let checked = box.filter(function (val) {
      if (val.checked) {
        newSpecialization.push(val.value)
        return val.value;
      }
    })
    //===================================
    /*
    for(var x=0; x<6; x++)
    {
      let clinicDay:any = document.getElementById('clinic'+x);
      let days:Array<any> = Array.from(clinicDay.getElementsByClassName('day')); 
      let newDays =[];
      let checked = days.filter(function (val) {
        if (val.checked) {
          newDays.push(val.value)
          return val.value;
        }
      })
      this.form.value.clinic[x]['openDay'] = newDays;
    }
    */
    
    this.form.value.specialization = newSpecialization;

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
  private createSpecialization(specialization, clinic): void {
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

    /*
    for (var x = 0; x < 6; x++) {
      let workingDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      let clinicDay = clinic[x]['openDay'].split(',');
      this.days = [];
      for (var y = 0; y < 6; y++) {
        checked = workingDay[y] == clinicDay[y];
        this.days.push({ label: workingDay[y], checked: checked });
      }
    }
*/
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
      clinic: this.formBuilder.array([]),
    })

    var clinicObj: object = { name: '', address: '', city: '', pin: '', state: '', contact: '', openTime: '', endTime: '', openDay: 'Sun,Mon,,,,Fri,' }
    for (let i = 0; i < 6; i++) {
      this.clinic = this.form.get('clinic');
      if (profileData['clinic'][i]) {
        this.clinic.push(this.createClinic(profileData['clinic'][i]));
      }
      else {
        this.clinic.push(this.createClinic(clinicObj));
      }
    }
    this.createSpecialization(profileData['specialization'], profileData['clinic']);

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
  }
  //=======================================
}
