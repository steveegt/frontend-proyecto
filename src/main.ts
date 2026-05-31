import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { authInterceptor } from './app/auth-interceptor';
import { apiInterceptor } from './app/interceptors/api-interceptor';

bootstrapApplication(App, {
  providers: [

    provideRouter(routes),
    provideAnimations(),

    provideHttpClient(
      withInterceptors([
        apiInterceptor,   // ✅ función
        authInterceptor
      ])
    )

  ]
});