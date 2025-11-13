import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-add',
  imports: [FormsModule, CommonModule],
  templateUrl: './add.html',
  styleUrl: './add.scss',
})
export class Add {
  user = {
    name: '',
    email: '',
    phone: ''
  };

  onSubmit(user: any) {

  }
}
