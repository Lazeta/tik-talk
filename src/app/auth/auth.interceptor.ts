import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http"
import { inject } from "@angular/core"
import { catchError, from, mergeMap, throwError } from "rxjs"
import { AuthService } from "./auth.service"
// import { Router } from "@angular/router"

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    // const router = inject(Router);
    const excludedUrls = ['/auth/token', '/auth/refreshToken'];

    // Пропускаем запросы аутентификации и запросы без токена
    if (excludedUrls.some(url => req.url.includes(url)) || !authService.token) {
        return next(req);
    }

    // Если нет токена, пропускаем запрос
    if (!authService.token) {
        return next(req);
    }

    // Клонируем запрос с токеном
    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${authService.token}`,
            'Content-Type': 'application/json'
        }
    });

    return next(authReq).pipe(
        // catchError((error: HttpErrorResponse) => {
        //     console.error('HTTP Error:', error);

        //     // Обработка 401 ошибки (истёкший токен)
        //     if (error.status === 401 && authService.refreshToken) {
        //         return handleUnauthorizedError(authService, authReq, next);
        //     }

        //     // Перенаправление на /login при других ошибках (опционально)
        //     if (error.status === 403) {
        //         router.navigate(['/login']);
        //     }
        //     return throwError(() => error)
        // })
    )
}

const handleUnauthorizedError = (
    authService: AuthService,
    req: HttpRequest<any>,
    next: HttpHandlerFn
) => {
    // Проверяем наличие refreshToken перед вызовом
    if (!authService.refreshToken) {
        authService.logout();
        // return throwError(() => new Error('No refresh token available'));
    }

    return from(authService.refreshAuthToken()).pipe(
        mergeMap(() => {
            // if (!authService.token) {
            //     authService.logout();
            //     return throwError(() => new Error('Token refresh failed'));
            // }

            const newRequest = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${authService.token}`
                }
            });
            return next(newRequest);
        }),
        // catchError(err => {
        //     authService.logout();
        //     return throwError(() => err);
        // })
    );
};