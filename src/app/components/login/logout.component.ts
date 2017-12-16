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
  constructor(private messageService: MessageService, private dataService: DataService) { }
  //==============================================================================
  public ngOnInit() {
    this.dataService.destroyToken();
    this.messageService.sendMessage({ event: 'onSelfDestroy' });
  }
  //==============================================================================
}

