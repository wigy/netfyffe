import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'my-app',
  template: `<h1>{{name}}</h1>`,
})
export class AppComponent  {
  name = 'netFyffe';

  constructor() {
    fetch('http://localhost:9000/quote/')
      .then((resp: any) => resp.json().then((str: string) => console.log(str)));
  }
}
