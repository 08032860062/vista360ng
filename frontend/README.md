# Frontend (Angular) — minimal setup

This folder describes how to create a minimal Angular app for the project. You can skip this and keep using the simple static `public/` pages.

Quick start (create an Angular app in `frontend/`):

1. Install Angular CLI and scaffold (uses npx to avoid global install):

   ```powershell
   npx @angular/cli new frontend --directory frontend --routing=false --style=css --skip-install
   cd frontend
   npm install
   npm start    # or npx ng serve --port 4200
   ```

2. Minimal `AppComponent` (paste into `frontend/src/app/app.component.ts`):

   ```ts
   import { Component } from '@angular/core';

   @Component({
     selector: 'app-root',
     template: `
       <div class="container">
         <h1>Vista360 NG — Angular Pilot</h1>
         <p>Minimal Angular app. Fetch tours from <code>/api/tours</code>.</p>
         <ul>
           <li *ngFor="let t of tours">{{ t.title }} — <a [href]="'/tour/'+t.id">view</a></li>
         </ul>
       </div>
     `
   })
   export class AppComponent {
     tours: any[] = [];
     constructor() {
       fetch('/api/tours').then(r => r.json()).then(d => this.tours = d);
     }
   }
   ```

3. Build and deploy once ready:

   ```powershell
   npm run client:build
   ```

Then copy the contents of `frontend/dist/...` into `public/` or serve the Angular app separately.
