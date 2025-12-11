import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [NgStyle, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  menu : boolean = false ;

}