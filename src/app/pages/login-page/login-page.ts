import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { from, map, skip, take, tap } from 'rxjs';
import { Router } from '@angular/router';

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

  form = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required)
  });

  onSubmit() {
    if (this.form.valid) {
      console.log('Form data:', this.form.value);
      //@ts-ignore
      this.authService.login(this.form.value)
        .subscribe(res => {
          this.router.navigate(['']),
          console.log(res); 
          // next: (response) => console.log('Response:', response),
          // error: (error) => console.log('Error:', error)
      })
    }
  }
}
