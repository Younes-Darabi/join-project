import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactInterface } from '../../../interfaces/contact/contact-list.interface';
import { ContactService } from '../../../services/contact/contact-service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.scss'],
})
export class ContactList implements OnInit {
  groupedContacts: Record<string, ContactInterface[]> = {};
  groupedKeys: string[] = [];

  constructor(public contactService: ContactService) { }

   ngOnInit() {
    this.contactService.subContactsList();
    setTimeout(() => {
      this.updateGrouping();
    }, 500);
  }

  updateGrouping() {
    this.groupedContacts = this.contactService.getGroupedContacts();
    this.groupedKeys = Object.keys(this.groupedContacts);
  }
}

