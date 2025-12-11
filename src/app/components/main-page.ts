import { Component } from '@angular/core';
import { Navbar } from "../shared/navbar/navbar";
import { Header } from "../shared/header/header";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-main-page',
  imports: [Navbar, Header, RouterOutlet],
  templateUrl: './main-page.html',
  styleUrls: ['./main-page.scss'],
})
export class MainPage {

}