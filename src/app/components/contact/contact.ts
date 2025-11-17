import { Component } from '@angular/core';
import { ContactList } from './contact-list/contact-list';
import { CommonModule } from '@angular/common';
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';
import { ContactService } from '../../services/contact/contact-service';
import { Edit } from "./edit/edit";
import { Add } from "./add/add";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-contact',
  imports: [Edit, Add, ContactList, CommonModule, RouterLink],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class Contact {
  contactlist: ContactInterface[] = [];
  constructor(public contactService: ContactService) {}

  
}


