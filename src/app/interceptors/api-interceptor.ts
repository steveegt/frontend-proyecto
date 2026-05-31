import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {

  const apiUrl = 'https://backend-proyecto-production-f013.up.railway.app';

  let newReq = req;

  if (req.url.startsWith('http://localhost:8080')) {
    newReq = req.clone({
      url: req.url.replace('http://localhost:8080', apiUrl)
    });
  }

  return next(newReq);
};