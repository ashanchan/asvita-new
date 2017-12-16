import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-top',
  templateUrl: './panel-top.component.html',
  styleUrls: ['./panel-top.component.css']
})

export class PanelTopComponent implements OnInit, OnDestroy {
  constructor(private messageService: MessageService, private dataService: DataService, private router: Router) { }
  //==============================================================================
  private subscription: Subscription = new Subscription();
  private isActive: boolean = false;
  private mode: string;
  private showLoader: boolean = false;
  //==============================================================================
  public ngOnInit() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
  }
  //==============================================================================
  public ngOnDestroy() {
    alert('top destroyed');
   
    //this.subscription.unsubscribe();
  }
  //==============================================================================
  private onMessageReceived(message): void {
    switch (message.event) {
      case 'onPanelLoaded':
        this.mode = this.dataService.getUserMode();
        this.isActive = true;
        break;

      case 'onToggleLoader':
        this.showLoader = message.mode;
        break;

      case 'onSelfDestroy':
        //this.isActive = false;
        //this.ngOnDestroy();
        break;
    }
  }
  //==============================================================================
  private routePath(url: string) {
    this.router.navigate(['url'], { skipLocationChange: true });
  }
}