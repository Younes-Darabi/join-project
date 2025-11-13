import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
})

export class Edit {
  user = {
    name: '',
    email: '',
    phone: ''
  };
  
  onSubmit(user:any) {

  }
}
