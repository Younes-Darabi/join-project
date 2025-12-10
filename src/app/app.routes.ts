import { Routes } from '@angular/router';
import { Contact } from './components/contact/contact';
import { Board } from './components/board/board';
import { AddTask } from './components/add-task/add-task';
import { Summary } from './components/summary/summary';
import { PrivacyPolicy } from './components/privacy-policy/privacy-policy';

export const routes: Routes = [
    { path: 'Summary', component: Summary},
    { path: 'AddTask', component: AddTask},
    { path: 'Board', component: Board},
    { path: 'Contact', component: Contact},
    { path: 'PrivacyPolicy', component: PrivacyPolicy}
];