import { Routes } from '@angular/router';
import { Contact } from './components/contact/contact';
import { Add } from './components/contact/add/add';

export const routes: Routes = [
    { path: '', component: Contact},
    {path: 'add', component: Add},
];
