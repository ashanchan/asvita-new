import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  private mode:string = '';

  constructor(private dataService: DataService) { }
  //==============================================================================
  ngOnInit() {
    this.mode = this.dataService.getUserMode()
  }
  //==============================================================================
  public ngOnDestroy() {
  }
  //==============================================================================
}
