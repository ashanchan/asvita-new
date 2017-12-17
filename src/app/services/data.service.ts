import { Injectable } from '@angular/core';

@Injectable()

export class DataService {
  public isAuthenticated: boolean = false;
  public jwtToken: string = '';
  public userId: string = '';
  public profileData: any;
  public serverPath: string;
  public subscription: any = {};
  public userMode: string;
  public userTip: object = {};
  public connectionList: any = [];
  public prescriptionData: Array<any> = [];
  public graphRecord: Array<any> = [];
  //=======================================
  //=======================================
  public setToken(token): void {
    this.jwtToken = token;
    this.isAuthenticated = true;
  }
  //=======================================
  //=======================================
  public destroyToken(): void {
    this.jwtToken = null;
    this.isAuthenticated = false;
  }
  //=======================================
  //=======================================
  public getToken(): any {
    return this.jwtToken;
  }
  //=======================================
  //=======================================
  public setUserId(id: string): void {
    this.userId = id;
  }
  //=======================================
  //=======================================
  public getUserId(): string {
    return this.userId;
  }
  //=======================================
  //=======================================
  public setUserMode(): void {
    this.userMode = this.userId.substr(0, 3);
  }
  //=======================================
  //=======================================
  public getUserMode(): string {
    return this.userMode;
  }
  //=======================================
  //=======================================
  public setProfileData(val): void {
    this.profileData = val;
  }
  //=======================================
  //=======================================
  public getProfileData(): any {
    return this.profileData;
  }
  //=======================================
  //=======================================
  public setServerPath(val): void {
    this.serverPath = val;
  }
  //=======================================
  //=======================================
  public getServerPath(): any {
    return this.serverPath;
  }
  //=======================================
  //=======================================
  public getRootPath(): any {
    return this.serverPath + 'uploads/';
  }
  //=======================================
  //=======================================
  public getFolderPath(): any {
    return this.serverPath + 'uploads/' + this.userId + '/';
  }
  //=======================================
  //=======================================
  public setSubscription(key, val): any {
    this.subscription[key] = val;
  }
  //=======================================
  //=======================================
  public getSubscription(): any {
    return this.subscription;
  }
  //=======================================
  //=======================================
  public getPrescriptionData(): any {
    return this.prescriptionData;
  }
  //=======================================
  //=======================================
  public setPrescriptionData(val): any {
    this.prescriptionData = val;
  }
  //=======================================
  //=======================================
  public UpdatePrescriptionData(val): any {
    this.prescriptionData.unshift(val);
  }
  //=======================================
  //=======================================
  public setConnectionList(val): any {
    let ctr = val.length;

    val.sort(function (a, b) {
      var nameA = a.fullName.toUpperCase(); // ignore upper and lowercase
      var nameB = b.fullName.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });


    for (let i = 0; i < ctr; i++) {
      val[i]['profileUrl'] = this.getRootPath() + val[i].userId + '/profile.jpg';
    }
    this.connectionList = val;
  }
  //=======================================
  //=======================================
  public getGraphData(db): any {
    return this.graphRecord[db];
  }
  //=======================================
  //=======================================
  public setGraphData(db, val): any {
    if (db === "WEIGHT") {
      val = this.computeBMI(val);
    }
    else if (db === "BP") {
      val = this.computeBP(val);
    }
    else if (db == "TEMPERATURE") {
      val = this.computeTemp(val);
    }

    this.graphRecord[db] = val;
  }
  //=======================================
  //=======================================
  public getConnectionList(): any {
    return this.connectionList;
  }
  //=======================================
  //=======================================
  public getRandomExt(): any {
    return Math.random();
  }
  //=======================================
  //=======================================
  public getUserTip(): any {
    return this.userTip;
  }
  //=======================================
  //=======================================
  public findConnection(id): any {
    return this.connectionList.filter(function (val) {
      return val.userId === id;
    })
  }
  //=======================================
  //=======================================
  public getPrescriptionForm(): any {

  }
  //=======================================
  //=======================================
  public formatDate(date) {
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
    return monthNames[monthIndex] + ' ' + day + ', ' + year;
  }
  //=======================================
  //=======================================
  public getStringDate() {
    let curDate = new Date();
    let dd = curDate.getDate() > 9 ? curDate.getDate() : '0' + curDate.getDate();
    let mm = curDate.getMonth() + 1 > 9 ? curDate.getMonth() + 1 : '0' + Number(curDate.getMonth() + 1);
    let hh: any = curDate.getHours();
    let mt: any = curDate.getMinutes();
    hh = Number(hh) > 9 ? hh : '0' + hh;
    mt = Number(mt) > 9 ? mt : '0' + mt;
    return curDate.getFullYear() + '-' + mm + '-' + dd + 'T' + hh + ':' + mt;
  }
  //=======================================
  //=======================================
  private computeBMI(val) {
    let ctr = val.length;
    let bmi: any = 0;
    let status = '';
    for (let i = 0; i < ctr; i++) {
      bmi = val[i].weight / ((val[i].height / 100) * (val[i].height / 100))
      if (bmi <= 18.5) {
        status = '<font color="yellow"><b>Underweight</b></font>';
      }
      else if (bmi <= 24.9) {
        status = '<font color="green"><b>Normal</b></font>';
      }
      else if (bmi <= 29.9) {
        status = '<font color="blue"><b>Overweight</b></font>';
      }
      else if (bmi <= 34.9) {
        status = '<font color="orange"><b>Obese Class I</b></font>';
      }
      else if (bmi <= 40) {
        status = '<font color="red"><b>Obese Class II</b></font>';
      }
      else {
        status = '<font color="maroon"><b>Obese Class III</b></font>';
      }
      val[i].BMI = bmi;
      val[i].status = status;
    }
    return val;
  }
  //=======================================
  //=======================================
  private computeBP(val) {
    let ctr = val.length;
    let status = '';
    for (let i = 0; i < ctr; i++) {
      if (val[i].systolic <= 120 || val[i].diastolic <= 80) {
        status = '<font color="green"><b>Normal</b></font>';
      }
      else if (val[i].systolic <= 139 || val[i].diastolic <= 89) {
        status = '<font color="orange"><b>prehypertension</b></font>';
      }
      else if (val[i].systolic <= 140 || val[i].diastolic <= 90) {
        status = '<font color="red"><b>High Bp</b></font>';
      }
      val[i].status = status;
    }
    return val;
  }
  //=======================================
  //=======================================
  private computeTemp(val) {
    let ctr = val.length;
    let status = '';
    for (let i = 0; i < ctr; i++) {
      if (val[i].temperature <= 97) {
        status = '<font color="blue"><b>Cold</b></font>';
      }
      else if (val[i].temperature <= 98.6) {
        status = '<font color="green"><b>Normal</b></font>';
      }
      else if (val[i].temperature <= 100) {
        status = '<font color="orange"><b>Hot</b></font>';
      }
      else if (val[i].temperature >= 101) {
        status = '<font color="red"><b>Fever</b></font>';
      }
      val[i].status = status;
    }
    return val;
  }
  //=======================================
  //=======================================
  public titleCase(str) {
    if (str !== str.toUpperCase()) {
      return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })
    }
    else {
      return str;
    }
  }
  //=======================================
  //=======================================

}

