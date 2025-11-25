import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CardComponent } from './card/card.component';

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
  imports: [CommonModule, FormsModule, CdkDropList, CdkDrag, CardComponent],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  drop(event: CdkDragDrop<string[]>) {
    // Moves item in the array when dropped
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
  }

