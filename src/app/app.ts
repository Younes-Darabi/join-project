import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./shared/header/header";
import { Navbar } from "./shared/navbar/navbar";
import { SignUp } from "./components/sign-up/sign-up";
import { PageOne } from "./components/page-one/page-one";
import { LogIn } from "./components/log-in/log-in";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Navbar, SignUp, PageOne, LogIn],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Join');
}
