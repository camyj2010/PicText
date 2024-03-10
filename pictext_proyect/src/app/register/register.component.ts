import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
	userService = inject(UserService)
	info:string|null = null;

	constructor(private router: Router) { }

	applyForm = new FormGroup({
		name: new FormControl(''),
		email: new FormControl(''),
		password: new FormControl(''),
	});

	submitRegister(){
		this.userService.register( 
			this.applyForm.value.name??'',
			this.applyForm.value.email??'',
			this.applyForm.value.password??''
		).then((response) => {
			if(response == "success"){
				this.router.navigate(['/login']);
			}else{
				this.info = "Error registering"
			}
		});
	}
}

