import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../interfaces/contact/user';
import { ContactService } from '../../../services/contact/contact-service';


@Component({
  selector: 'app-add',
  imports: [FormsModule, CommonModule],
  templateUrl: './add.html',
  styleUrl: './add.scss',
})
export class Add {
  firebaseService = inject(ContactService);

  user: User = {
    name: '',
    email: '',
    phone: ''
  };

  onSubmit() {
    this.firebaseService.addUser(this.user);
    this.user.name='';
    this.user.email='';
    this.user.phone='';
  }


}
