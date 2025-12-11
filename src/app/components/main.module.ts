import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainRoutes } from './main.routes';
import { MainPage } from './main-page';
import { Navbar } from './../shared/navbar/navbar';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MainRoutes),
    MainPage,
    Navbar
  ],
  exports: [Navbar]
})
export class MainModule { }