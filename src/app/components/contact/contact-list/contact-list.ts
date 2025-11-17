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
  @Input() contactList: ContactInterface[] = [];
}
