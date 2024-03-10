import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
	userService = inject(UserService)

	constructor(private router: Router) { }

	getData() {
    return sessionStorage.getItem('name');
  }

	deleteData() {
    sessionStorage.clear();
  }

	handleLogin(){
		this.router.navigate(['/login']);
	}
	
	handleRegister(){
		this.router.navigate(['/register']);
	}
}
