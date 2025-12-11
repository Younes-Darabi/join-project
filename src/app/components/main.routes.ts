import { Routes } from '@angular/router';
import { MainPage } from './main-page';
import { Summary } from './summary/summary';
import { AddTask } from './add-task/add-task';
import { Board } from './board/board';
import { Contact } from './contact/contact';

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
    ]
  }
];