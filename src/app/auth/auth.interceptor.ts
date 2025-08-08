import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http"
import { inject } from "@angular/core"
import { catchError, from, mergeMap, throwError } from "rxjs"
import { AuthService } from "./auth.service"

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    const excludedUrls = ['/auth/token', '/auth/refresh'];

    // Пропускаем запросы аутентификации
    if (excludedUrls.some(url => req.url.includes(url))) {
        return next(req);
    }

    // Если нет токена, пропускаем запрос
    if (!authService.token) {
        return next(req);
    }

    const authReq = addTokenToRequest(req, authService.token);

    return next(authReq).pipe(
        catchError(error => {
            if (error.status === 401 && authService.refreshToken) {
                return handleUnauthorizedError(authService, authReq, next);
            }
            return throwError(() => error)
        })
    )
}

const handleUnauthorizedError = (
    authService: AuthService,
    req: HttpRequest<any>,
    next: HttpHandlerFn
) => {
    // Проверяем наличие refreshToken перед вызовом
    if (!authService.refreshToken){
        authService.logout();
        return throwError(() => new Error('No refresh token available'));
    }

    return from(authService.refreshAuthToken()).pipe(
        mergeMap(() => {
            if (!authService.token) {
                authService.logout();
                return throwError(() => new Error('Token refresh failed'));
            }

            const newRequest = addTokenToRequest(req, authService.token);
            return next(newRequest);
        }),
        catchError(err => {
            authService.logout();
            return throwError(() => err);
        })
    );
};

const addTokenToRequest = (req: HttpRequest<any>, token: string): HttpRequest<any> => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
};