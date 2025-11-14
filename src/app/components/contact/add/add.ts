import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirebaseService } from './../../../service/firebase/firebase';
import { User } from '../../../interfaces/user';


@Component({
  selector: 'app-add',
  imports: [FormsModule, CommonModule],
  templateUrl: './add.html',
  styleUrl: './add.scss',
})
export class Add {
  firebaseService = inject(FirebaseService);

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
