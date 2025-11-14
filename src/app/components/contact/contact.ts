import { Component } from '@angular/core';
import { Edit } from "./edit/edit";
import { Add } from "./add/add";

@Component({
  selector: 'app-contact',
  imports: [Edit, Add],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {

}
