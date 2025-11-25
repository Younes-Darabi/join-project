import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Injectable} from '@angular/core';
import { Firestore } from 'firebase/firestore';
import { BoardService } from '../../../services/board/board-service';



/**
 * @component CardComponent
 * 
 * This component represents a task card within the task management system.
 * It allows task editing, deletion, and status updates.
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
 
  
}