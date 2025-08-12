import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { TokenResponse } from '../../auth/auth.interface';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  authService = inject(AuthService);
  router = inject(Router);

  isPasswordVisible = signal<boolean>(false);

  form = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required)
  });

  onSubmit() {
    this.isPasswordVisible.set(false); // Обычно скрываем пароль при отправке

    if (this.form.valid) {
      const { username, password } = this.form.value;

      if (username && password) {
        this.authService.login({ username, password })
          .subscribe({
            next: (res: TokenResponse) => {
              this.router.navigate(['/']);
              console.log('Login successful', res);
            },
            error: (err) => {
              console.error('Login failed', err);
              this.form.setErrors({ invalidCredentials: true });
            }
          });
      }
    }
  }
}
