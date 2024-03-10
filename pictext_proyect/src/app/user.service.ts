import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	backendUrl = 'http://localhost:3001';
	constructor(private http: HttpClient) {
		// This service can now make HTTP requests via `this.http`.
	}

	register(name: string, email: string, password: string) {
		
		const data = {
			name: name,
			email: email,
			password: password
		}
		console.log("name: " + name + " email: " + email + " password: " + password)
		this.http.post(this.backendUrl + '/register',data).subscribe((response) => {
			console.log(response);
		});
	}

}
