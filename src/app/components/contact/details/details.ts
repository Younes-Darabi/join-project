import { Component, ElementRef, EventEmitter, HostListener, Input, Output, inject, signal } from '@angular/core';
import { ContactService } from '../../../services/contact/contact-service';
import { ContactInterface } from '../../../interfaces/contact/contact-list.interface';
import { Edit } from '../edit/edit';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [Edit],
  templateUrl: './details.html',
  styleUrls: ['./details.scss'],
})
export class Details {
  firebaseService = inject(ContactService);
  isClicked: boolean = false;
  menuOpen = signal(false);
  // Input vom Parent
  @Input() contact!: ContactInterface;

  // Events
  @Output() close = new EventEmitter<void>();
 

  // Getter für Initialen
  get shortName(): string {
    return this.contact
      ? (this.contact.firstname?.charAt(0) || '') +
      (this.contact.lastname?.charAt(0) || '')
      : '';
  }

  constructor(private elementRef: ElementRef) {

  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Prüfen ob der Klick innerhalb des Components war
    if (!this.elementRef.nativeElement.contains(target)) {
      this.menuOpen.set(false); // Menü schließen
    }
  }

  // Delete
  deleteContact() {
    if (!this.contact?.id) return;
    this.firebaseService.deleteContact(this.contact);
    this.close.emit();
  }

  // Edit
  showEdit() {
    this.isClicked = true;
  }

  // Optional: Clear, falls du Details zurücksetzen willst
  clear() {
    this.contact = {
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      type: '',
    };
  }

  handleClose() {
    this.isClicked = false;
  }
}
