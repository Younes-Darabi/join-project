import { Component } from '@angular/core';
import { ContactList } from './contact-list/contact-list';
import { CommonModule } from '@angular/common';
import { ContactInterface } from '../../interfaces/contact-list.interface';
import { ContactService } from '../../services/contact-service';
import { Edit } from "./edit/edit";
import { Add } from "./add/add";

@Component({
  selector: 'app-contact',
  imports: [Edit, Add, ContactList, CommonModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class Contact {
  constructor(private ContactService: ContactService) {}

  getList(): ContactInterface[] {
      return this.ContactService.contactList;
  }
}
