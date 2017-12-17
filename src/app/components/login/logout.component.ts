import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  private message:string = ''
  constructor(private messageService: MessageService, private dataService: DataService) { }
  //==============================================================================
  public ngOnInit() {
    this.message = 'Bye bye '+this.dataService.getProfileData()['fullName']+'<br>You have been logged out successfully.<br>Refresh the browser or relogin Later.'
    this.dataService.destroyToken();
    this.messageService.sendMessage({ event: 'onSelfDestroy' });
  }
  //==============================================================================
}

