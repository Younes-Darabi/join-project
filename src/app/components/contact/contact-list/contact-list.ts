import { Component, DOCUMENT, EventEmitter, Inject, OnInit, Output, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactInterface } from '../../../interfaces/contact/contact-list.interface';
import { ContactService } from '../../../services/contact/contact-service';
import { Add } from '../add/add';



@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, Add],
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.scss'],
})
export class ContactList implements OnInit {
  @Output() detailClicked = new EventEmitter<ContactInterface>();
  groupedContacts: Record<string, ContactInterface[]> = {};
  groupedKeys: string[] = [];
  isClicked: boolean = false;
  constructor(public contactService: ContactService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.contactService.subContactsList();
  }

  ngDoCheck() {
    this.updateGrouping();
  }

  updateGrouping() {
    this.groupedContacts = this.contactService.getGroupedContacts();
    this.groupedKeys = Object.keys(this.groupedContacts);
  }

  getInitials(firstname: string, lastname: string): string {
    const firstInitial = firstname?.charAt(0).toUpperCase() || '';
    const lastInitial = lastname?.charAt(0).toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  }

  openAddContact() {
    this.isClicked = true;
    this.renderer.addClass(this.document.body, 'contact_open')
  }

  handleClose() {
    this.isClicked = false;
    this.renderer.removeClass(this.document.body, 'contact_open');
  }

  showDetails(item: ContactInterface) {
    this.detailClicked.emit(item);
  }
}

