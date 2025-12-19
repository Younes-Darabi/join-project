import { Routes } from '@angular/router';
import { PageOne } from './components/page-one/page-one';
import { LogIn } from './components/log-in/log-in';
import { SignUp } from './components/sign-up/sign-up';
import { Summary } from './components/summary/summary';
import { AddTask } from './components/add-task/add-task';
import { Board } from './components/board/board';
import { Contact } from './components/contact/contact';
import { PrivacyPolicy } from './components/privacy-policy/privacy-policy';
import { LegalNotice } from './components/legal-notice/legal-notice';
import { AuthGuard } from './services/auth/auth-guard';
import { HelpComponent } from './components/help-component/help-component';


export const routes: Routes = [
  { path: '', component: PageOne },
  { path: 'log-in', component: LogIn },
  { path: 'sign-up', component: SignUp },
  { path: 'summary', component: Summary, canActivate: [AuthGuard] },
  { path: 'add-task', component: AddTask, canActivate: [AuthGuard] },
  { path: 'board', component: Board, canActivate: [AuthGuard] },
  { path: 'contact', component: Contact, canActivate: [AuthGuard] },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'legal-notice', component: LegalNotice },
  { path: 'help', component: HelpComponent },
];