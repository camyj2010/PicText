import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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

	applyForm = new FormGroup({
		name: new FormControl(''),
		email: new FormControl(''),
		password: new FormControl(''),
	});

	submitRegister() {
		this.userService.register( 
			this.applyForm.value.name??'',
			this.applyForm.value.email??'',
			this.applyForm.value.password??''
		);
	}
}

