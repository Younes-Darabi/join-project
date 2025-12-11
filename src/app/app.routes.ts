import { Routes } from '@angular/router';
import { PageOne } from './components/page-one/page-one';
import { LogIn } from './components/log-in/log-in';
import { SignUp } from './components/sign-up/sign-up';
import { MainPage } from './components/main-page';

export const routes: Routes = [
  { path: '', component: PageOne },
  { path: 'log-in', component: LogIn },
  { path: 'sign-up', component: SignUp },
  { 
    path: 'main-page', 
    loadChildren: () => import('./components/main.module').then(m => m.MainModule) 
  }
];