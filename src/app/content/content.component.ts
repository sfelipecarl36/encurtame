import { Component } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {

  pageUrl: any
  router: any;

  constructor() {
    this.pageUrl = window.location.pathname.split('/').pop();
    console.log (this.pageUrl)
  }

}
