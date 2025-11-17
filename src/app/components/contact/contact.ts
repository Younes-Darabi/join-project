import { Component, OnInit } from '@angular/core';
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';
import { ContactService } from '../../services/contact/contact-service';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class Contact implements OnInit {
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
