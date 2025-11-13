import { Component } from '@angular/core';
import { ContactList } from './contact-list/contact-list';
import { CommonModule } from '@angular/common';
import { ContactInterface } from '../../interfaces/contact-list.interface';
import { ContactService } from '../../services/contact-service';



@Component({
  selector: 'app-contact',
  imports: [CommonModule, ContactList],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  constructor(private ContactService: ContactService) {}

  getList(): ContactInterface[] {
      return this.ContactService.contactList;
  }
}
