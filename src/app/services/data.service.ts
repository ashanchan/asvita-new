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
  //=======================================
  //=======================================
  public setToken(token): void {
    this.jwtToken = token;
    this.isAuthenticated = true;
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
    return monthNames[monthIndex] + ' '+ day + ', '  + year;
  }
  //=======================================
  //=======================================

}

