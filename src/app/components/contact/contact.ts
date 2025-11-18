import { Component, ViewChild } from '@angular/core';
import { Edit } from "./edit/edit";
import { Add } from "./add/add";
import { CommonModule } from '@angular/common';
import { ContactList } from './contact-list/contact-list';
import { Details } from "./details/details";
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [Edit, Add, ContactList, CommonModule, Details],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})

export class Contact {
  @ViewChild(Edit) Edit!: Edit;

  showEdit($event:ContactInterface) {
    this.Edit.showEdit($event);
  }

}
