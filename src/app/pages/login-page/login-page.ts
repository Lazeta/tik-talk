import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

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
  form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit(){
    console.log(this.form.value)
  }
}
