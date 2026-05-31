import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {

  const apiUrl = 'https://backend-proyecto-production-f013.up.railway.app';

  let newReq = req;

  // ✅ si NO es https y ES localhost → reemplazar
  if (req.url.includes('localhost')) {
    newReq = req.clone({
      url: req.url.replace('http://localhost:8080', apiUrl)
    });
  }

  // ✅ si usas rutas relativas (/api/...)
  else if (req.url.startsWith('/')) {
    newReq = req.clone({
      url: apiUrl + req.url
    });
  }

  return next(newReq);
};