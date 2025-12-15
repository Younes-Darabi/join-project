import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "join-f1979", appId: "1:736216917449:web:f234c0dc422382891cf418", storageBucket: "join-f1979.firebasestorage.app", apiKey: "AIzaSyCewJLxvkjIQ_cxyETz84VI1MlGgJKA2-w", authDomain: "join-f1979.firebaseapp.com", messagingSenderId: "736216917449", measurementId: "G-RHNTBLV4WN" })), provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ]
};
