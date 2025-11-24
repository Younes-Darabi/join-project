import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

import { Router } from '@angular/router';

import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-board',
  imports: [CdkDropList, CdkDrag],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {

}
