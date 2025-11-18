import { Component } from '@angular/core';
import { Edit } from "./edit/edit";

import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactList } from './contact-list/contact-list';




@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactList, Edit, ContactDetailsComponent],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class Contact {

}
