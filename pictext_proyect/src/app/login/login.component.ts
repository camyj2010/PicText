import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

	userService = inject(UserService)
	info:string|null = null;

	constructor(private router: Router) { }

  loginForm = new FormGroup({
		email: new FormControl(''),
		password: new FormControl(''),
	});

	submitLogin(){
		this.userService.login( 
			this.loginForm.value.email??'',
			this.loginForm.value.password??''
		).then((response) => {
			if(response == "success"){
				this.router.navigate(['/dashboard']);
			}else{
				this.info = "Error logging in"
			}
		});
	}


}
