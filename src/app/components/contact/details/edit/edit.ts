import { Component, EventEmitter, HostBinding, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../../services/contact/contact-service';
import { ContactInterface } from '../../../../interfaces/contact/contact-list.interface';

@Component({
  selector: 'app-edit',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.scss'],
})

export class Edit {
  firebaseService = inject(ContactService);

  // WICHTIG: Input für die Daten vom Parent
  @Input() user!: ContactInterface;
  @Output() closeing = new EventEmitter();
  @Output() closeEditContact = new EventEmitter();
  shortName: string = '';
  editUser!: ContactInterface;

  ngOnChanges() {
    if (this.user) {
      this.editUser = { ...this.user }; // Kopie erstellen
      this.shortName =
        (this.editUser.firstname?.substring(0, 1) || '') +
        (this.editUser.lastname?.substring(0, 1) || '');
    }
  }

  editContact() {
    this.firebaseService.updateContact(this.editUser); // nur hier übernehmen
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