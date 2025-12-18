import { Routes } from '@angular/router';
import { MainPage } from './main-page';
import { Summary } from './summary/summary';
import { AddTask } from './add-task/add-task';
import { Board } from './board/board';
import { Contact } from './contact/contact';
import { PrivacyPolicy } from './privacy-policy/privacy-policy';
import { LegalNotice } from './legal-notice/legal-notice';
import { HelpComponent } from './help-component/help-component';

export const MainRoutes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      { path: '', redirectTo: 'summary', pathMatch: 'full' },
      { path: 'summary', component: Summary },
      { path: 'add-task', component: AddTask },
      { path: 'board', component: Board },
      { path: 'contact', component: Contact },
      { path: 'privacy_policy', component: PrivacyPolicy },
      { path: 'legal_notice', component: LegalNotice },
      { path: 'help', component: HelpComponent }
    ]
  }
];