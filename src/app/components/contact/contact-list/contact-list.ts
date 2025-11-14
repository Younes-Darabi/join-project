import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactInterface } from '../../../interfaces/contact/contact-list.interface';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.scss'],
})
export class ContactList {
  @Input() contactList: ContactInterface[] = [
    {
      firstname: 'Alice',
      lastname: 'Johnson',
      email: 'alice.johnson@example.com',
      phone: '123-456-7890',
      type: 'contact'
    },
    {
      firstname: 'Bob',
      lastname: 'Smith',
      email: 'bob.smith@example.com',
      phone: '234-567-8901',
      type: 'contact'
    },
    {
      firstname: 'Charlie',
      lastname: 'Brown',
      email: 'charlie.brown@example.com',
      phone: '345-678-9012',
      type: 'contact'
    },
  ];
}
