import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./shared/header/header";
import { Navbar } from "./shared/navbar/navbar";
import { MainPage } from "./components/main-page";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Navbar, MainPage],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Join');
}
