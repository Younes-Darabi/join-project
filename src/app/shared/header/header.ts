import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private ignoreDocumentClick = false;

  constructor(private elementRef: ElementRef) {}

  toggleMenu() {
    let menu = document.querySelector('.burgermenu') as HTMLElement;
    this.ignoreDocumentClick = true;
    setTimeout(() => this.ignoreDocumentClick = false, 0);
    if (window.innerWidth < 1000) {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.ignoreDocumentClick) return;
    let target = event.target as Node;
    let menu = document.querySelector('.burgermenu') as HTMLElement | null;
    if (!menu) return;
    if (!menu.contains(target) && menu.style.display === 'block') {
      menu.style.display = 'none';
    }
  }
}