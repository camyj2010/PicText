import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

	constructor(private router: Router) { }

	handleLogin(){
		this.router.navigate(['/login']);
	}
	
	handleRegister(){
		this.router.navigate(['/register']);
	}
}
