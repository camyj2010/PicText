import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../user.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
	userService = inject(UserService)

	constructor(
		private router: Router,
		@Inject(PLATFORM_ID) private platformId: Object	
	) { }

	getData() {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('name');
    }
		return null;
  }

	deleteData() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.clear();
    }
  }

	handleLogin(){
		this.router.navigate(['/login']);
	}
	
	handleRegister(){
		this.router.navigate(['/register']);
	}
}
