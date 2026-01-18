import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import { ContactService } from '../../../services/contact/contact-service';
import { ContactInterface } from '../../../interfaces/contact/contact-list.interface';
import { Edit } from './edit/edit';

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
  @Input() contact!: ContactInterface;
  @Input() contactClicked: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() contactDeleted = new EventEmitter<ContactInterface>();

  showDetail: boolean = false;
  contactTitleShow: boolean = false;

  get shortName(): string {
    return this.contact
      ? (this.contact.firstname?.charAt(0) || '') + (this.contact.lastname?.charAt(0) || '')
      : '';
  }

  constructor(private elementRef: ElementRef) {}

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.menuOpen.set(false);
    }
  }

  deleteContact() {
    if (!this.contact?.id) return;
    this.firebaseService.deleteContact(this.contact);
    this.close.emit();
  }

  // Edit
  showEdit() {
    this.isClicked = true;
  }

  handleClose() {
    this.isClicked = false;
  }

  showDetailRes() {
    this.showDetail = true;
    this.contactTitleShow = true;
  }

  back() {
    this.close.emit();
    this.contactTitleShow = false;
  }

  deleteContactFromParent(contact: ContactInterface) {
    // Weiterleiten an Parent
    this.contactDeleted.emit(contact);

    // Details-Fenster schließen
    this.close.emit();

    // Edit schließen
    this.handleClose();
  }
}
