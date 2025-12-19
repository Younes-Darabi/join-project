import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-one',
  imports: [],
  templateUrl: './page-one.html',
  styleUrl: './page-one.scss',
})
export class PageOne {
  isMobile = window.innerWidth <= 700;
  animation: boolean = false;

  constructor(private router: Router) {
    setTimeout(() => {
      this.animation = true;
    }, 2000);
    setTimeout(() => {
      this.router.navigate(['log-in']);
    }, 3000);
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 480;
  }

}
