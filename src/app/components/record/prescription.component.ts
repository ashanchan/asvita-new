import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs/Subscription';

import { HttpRequest } from '../../models/http-request';
import { HttpResponse } from '../../models/http-response';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})

export class PrescriptionComponent implements OnInit, OnDestroy {
  constructor(private formBuilder: FormBuilder, private messageService: MessageService, private dataService: DataService) { }
  //==============================================================================
  private form;
  private readonly: boolean = true;
  private addMode: boolean = false;
  private subscription: Subscription = new Subscription();
  private record: any[] = [];
  private medicineList: any[] = [];
  private recordIdx: number = 0;
  private profileData: any[] = [];
  private hasError: boolean = false;
  private errMsg: string = '';
  private showDropDown: boolean = true;
  private doctorId: string = '';
  private patientId: string = '';
  //==============================================================================
  public ngOnInit() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
    this.profileData = this.dataService.getProfileData();
    this.record = this.dataService.getPrescriptionData();
    this.resetForm();
  }
  //==============================================================================
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  //==============================================================================
  private onMessageReceived(message: HttpResponse): void {
    switch (message.event) {
      case 'onPrescriptionSubmitResponse':
        this.readonly = true;
        this.dataService.UpdatePrescriptionData(message.responseData.data)
        this.record = this.dataService.getPrescriptionData();
        this.recordIdx = 0;
        this.resetForm();
        break;
    }
  }
  //==============================================================================
  onSubmit() {
    this.hasError = false;
    this.getPrescriptionList();
    if (!this.hasError) {
      let httpRequest: HttpRequest = new HttpRequest();
      httpRequest.event = 'onPrescriptionSubmit';
      httpRequest.formData = this.form._value;
      httpRequest.validate = true;
      httpRequest.formData['component'] = 'prescription';
      httpRequest.formData['db'] = 'PRESCRIPTION';
      httpRequest.formData['urlExtn'] = 'create';
      this.messageService.sendMessage(httpRequest);
    }
  }
  //=======================================
  private resetForm() {
    var tDate = this.dataService.formatDate(new Date());
    var hasRecord = this.record.length > 1;

    if (!hasRecord) {
      this.record.push ({doctorId: '', patientId:'', prescriptionId: '', recordDate:tDate, referred: '', medicine : [], diagnosis: '', followUp: '', invAdvised: '', notes: ''});
    }

    this.form = this.formBuilder.group({
      doctorId: [this.readonly ? this.record[this.recordIdx]['doctorId'] : this.doctorId],
      patientId: [this.readonly ? this.record[this.recordIdx]['patientId'] : this.patientId],
      prescriptionId: [this.readonly ? this.record[this.recordIdx]['prescriptionId'] : '-'],
      recordDate: [this.readonly ? this.record[this.recordIdx]['recordDate'] : tDate],
      referred: [this.readonly ? this.record[this.recordIdx]['referred'] : ''],
      medicine: [this.readonly ? this.record[this.recordIdx]['medicine'] : []],
      diagnosis: [this.readonly ? this.record[this.recordIdx]['diagnosis'] : ''],
      followUp: [this.readonly ? this.record[this.recordIdx]['followUp'] : ''],
      invAdvised: [this.readonly ? this.record[this.recordIdx]['invAdvised'] : ''],
      notes: [this.readonly ? this.record[this.recordIdx]['notes'] : '']
    })

    var medicineObj: object = { medName: '', bbf: '', abf: '', bl: '', al: '', eve: '', bd: '', ad: '', day: '' };
    this.medicineList = [];
    for (let i = 0; i < 10; i++) {
      if (this.readonly && this.record[this.recordIdx]['medicine'][i]) {
        this.medicineList.push(this.record[this.recordIdx]['medicine'][i]);
      }
      else {
        this.medicineList.push(medicineObj);
      }
    }
  }
  //=======================================
  private createMedcineList(medicineObj): FormGroup {
    return this.formBuilder.group(medicineObj);
  }
  //=======================================
  private onRecordChange(idx: number) {
    this.recordIdx = idx;
    this.readonly = true;
    this.resetForm();
  }
  //=======================================
  private update(val: boolean) {
    this.readonly = val;
  }
  //=======================================
  private getPrescriptionList() {
    let medicine: any = document.getElementsByName('medName');
    let bbf: any = document.getElementsByName('bbf');
    let abf: any = document.getElementsByName('abf');
    let bl: any = document.getElementsByName('bl');
    let al: any = document.getElementsByName('al');
    let eve: any = document.getElementsByName('eve');
    let bd: any = document.getElementsByName('bd');
    let ad: any = document.getElementsByName('ad');
    let day: any = document.getElementsByName('day');
    let val: number = 0;
    let ctr = medicine.length;
    let x = 0;
    let dataObj;
    this.errMsg = 'Improper dosage. Error @ row# ';

    this.form.value['medicine'] = [];

    for (let i = 0; i < ctr; i++) {
      if (String(medicine[i].value).trim() !== '') {
        val = Number(bbf[i].value) + Number(abf[i].value) + Number(bl[i].value) + Number(al[i].value) + Number(eve[i].value) + Number(bd[i].value) + Number(ad[i].value);
        if (val !== 0 && !isNaN(val)) {
          dataObj = {
            medName: medicine[i].value,
            bbf: Number(bbf[i].value) > 0 ? Number(bbf[i].value) : '',
            abf: Number(abf[i].value) > 0 ? Number(abf[i].value) : '',
            bl: Number(bl[i].value) > 0 ? Number(bl[i].value) : '',
            al: Number(al[i].value) > 0 ? Number(al[i].value) : '',
            eve: Number(eve[i].value) > 0 ? Number(eve[i].value) : '',
            bd: Number(bd[i].value) > 0 ? Number(bd[i].value) : '',
            ad: Number(ad[i].value) > 0 ? Number(ad[i].value) : '',
            day: Number(day[i].value) > 0 ? Number(day[i].value) : ''
          };
          this.form.value['medicine'].push(dataObj);
          x++;
        }
        else {
          this.hasError = true;
          this.errMsg += i + ', ';
        }
      }
    }

    if (this.form.value['medicine'].length === 0) {
      this.hasError = true;
      this.errMsg = 'Please fill Prescription form';
    }
  }
  //=======================================
  private onAddRecord() {
    this.addMode = true;
  }
  //=======================================
  onConnectionSelected(idx: string): void {
    this.addMode = false;
    this.readonly = false;
    this.doctorId = this.dataService.getUserMode() === 'DOC' ? this.profileData['userId'] : idx;
    this.patientId = this.dataService.getUserMode() === 'PAT' ? this.profileData['userId'] : idx;
    this.resetForm();
  }
  //=======================================
}
