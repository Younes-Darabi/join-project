import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-page-one',
  imports: [],
  templateUrl: './page-one.html',
  styleUrl: './page-one.scss',
})
export class PageOne {
  isMobile = window.innerWidth <= 480;
  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 480;
  }
}
