import { Component, EventEmitter, HostBinding, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../services/contact/contact-service';
import { ContactInterface } from '../../../interfaces/contact/contact-list.interface';

@Component({
  selector: 'app-edit',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
})

export class Edit {
  firebaseService = inject(ContactService);

  // WICHTIG: Input für die Daten vom Parent
  @Input() user!: ContactInterface;
  @Output() closeing = new EventEmitter<void>();
  @Output() closeEditContact = new EventEmitter<void>();

  shortName: string = '';


  ngOnChanges() {
    if (this.user) {
      this.shortName =
        (this.user.firstname?.substring(0, 1) || '') +
        (this.user.lastname?.substring(0, 1) || '');
    }
  }

  editContact() {
    this.firebaseService.updateContact(this.user);
    this.close();
  }

  deleteContact() {
    this.firebaseService.deleteContact(this.user);
    this.closeing.emit();
  }

  close() {
    this.closeEditContact.emit();
  }
}