import { Component } from '@angular/core';
import { Edit } from "./edit/edit";
import { Add } from "./add/add";
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { CommonModule } from '@angular/common';
import { ContactList } from './contact-list/contact-list';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [Edit, Add, ContactList, CommonModule, ContactDetailsComponent],
  templateUrl: './contact.html',
  
  styleUrls: ['./contact.scss'],
})
export class Contact {

}
