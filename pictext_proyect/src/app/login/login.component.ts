import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = new FormGroup({
		email: new FormControl(''),
		password: new FormControl(''),
	});


}
