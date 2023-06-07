import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

interface Image {
  id: number;
  webformatURL: string;
}

interface APODImage{
  url:string;
}

@Component({
  selector: 'app-root',
  template: `
    <h1>Pixabay Gallery</h1>
    <button mat-raised-button color="primary" (click)="loadImages('motorcycles')">Motorcycles</button>
    <button mat-raised-button color="primary" (click)="loadImages('nature')">Nature</button>
    <button mat-raised-button color="primary" (click)="loadImages('space')">Space</button>
    <button mat-raised-button color="primary" (click)="loadImages('architecture')">Architecture</button>
    <button mat-raised-button color="warn" (click)="openSettings()">Login</button>

    <div *ngIf="currentTab === 'settings'" class="setting">
      <h2>LOGIN</h2>
      <mat-form-field class="example-full-width">
        <mat-label>API Key Settings</mat-label>
        <input [(ngModel)]="apiKey" matInput placeholder="Enter your API Key">
      </mat-form-field>
      <button mat-raised-button style="max-width: 500px" (click)="saveApiKey()">Save</button>
      <h2>If you don't have api key follow the <a href="https://pixabay.com/ru/service/about/api/">link</a></h2>
    </div>

    <div *ngIf="currentTab !== 'settings'" >
      <h2>{{ currentTab | uppercase }}</h2>
      <div class="img-container">
        <div *ngFor="let image of images" >
          <img [src]="image.webformatURL" alt="Image"/>
        </div>
      </div>

    </div>
  `,
  styles: [`
    button {
      margin-right: 10px;
    }

    img {
      width: 200px;
      height: 200px;
      object-fit: cover;
      margin: 5px;
    }

    .example-full-width {
      min-width: 150px;
      max-width: 500px;
      width: 100%;
    }

    .setting{
      display: flex;
      flex-direction: column;
    }

    .img-container{
      display: flex;
      flex-wrap: wrap;
        hight:'100px';
    }
  `]
})
export class AppComponent {
  currentTab: string = '';
  images: Image[] = [];
  APODImages: APODImage[] = [];
  apiKey: string = '';

  constructor(private http: HttpClient) {
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
      this.apiKey = savedApiKey;
    }
  }

  openSettings() {
    this.currentTab = 'settings';
  }

  loadImages(category: string) {
    this.currentTab = category;
    console.log("Category: " + category);
    console.log("Current Tab: " + this.currentTab);
    const timestamp = new Date().getTime();
    const url = `https://pixabay.com/api/?key=${this.apiKey}&q=${category}&per_page=100`;
    console.log("UR: " + url);
    this.http.get<any>(url).subscribe(response => {
      this.images = response.hits;
      console.log("Response: " + response.hits);
    });
  }

  saveApiKey() {
    localStorage.setItem('apiKey', this.apiKey);
    console.log("API Key: " + this.apiKey);
  }
}
