import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'encurtame';
  pageUrl = window.location.pathname.split('/').pop();
  urls: any;

  constructor(private firestore: AngularFirestore) {
    interface interUrl {
      longUrl: String,
      shortUrl: String
    }

  if(this.pageUrl!='') {
    this.urls = this.firestore.collection('urls', ref => ref.where('shortUrl','==',this.pageUrl)).valueChanges()
    this.urls.subscribe((res: interUrl[]) => {
      res.forEach(url => {
          if(this.pageUrl==url.shortUrl) {
            window.location.href = String(url.longUrl);
          }
      });
    })
  }
  }
}
