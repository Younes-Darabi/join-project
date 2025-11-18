import { Component, ViewChild } from '@angular/core';
import { Edit } from "./edit/edit";

import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactList } from './contact-list/contact-list';
import { Details } from "./details/details";
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactList, Edit, ContactDetailsComponent],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})

export class Contact {
  @ViewChild(Edit) Edit!: Edit;

  showEdit($event:ContactInterface) {
    this.Edit.showEdit($event);
  }

}
