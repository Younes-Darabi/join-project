import { Component } from '@angular/core';
import { Contact } from "./contact/contact";

@Component({
  selector: 'app-main-page',
  imports: [Contact],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {

}
