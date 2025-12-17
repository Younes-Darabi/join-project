import { Routes } from '@angular/router';
import { MainPage } from './main-page';
import { Summary } from './summary/summary';
import { AddTask } from './add-task/add-task';
import { Board } from './board/board';
import { Contact } from './contact/contact';
import { PrivacyPolicy } from './privacy-policy/privacy-policy';
import { LegalNotice } from './legal-notice/legal-notice';
import { AuthGuard } from '../services/auth/auth-guard';

export const MainRoutes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      { path: '', redirectTo: 'summary', pathMatch: 'full' },
      { path: 'summary', component: Summary, canActivate: [AuthGuard] },
      { path: 'add-task', component: AddTask, canActivate: [AuthGuard] },
      { path: 'board', component: Board, canActivate: [AuthGuard] },
      { path: 'contact', component: Contact, canActivate: [AuthGuard] },
      { path: 'privacy-policy', component: PrivacyPolicy },
      { path: 'legal-notice', component: LegalNotice },
    ]
  }
];