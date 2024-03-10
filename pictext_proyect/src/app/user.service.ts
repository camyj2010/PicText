import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	backendUrl = 'http://localhost:3001';
	constructor(private http: HttpClient) {
		// This service can now make HTTP requests via `this.http`.
	}

	async login(email: string, password: string): Promise<string> {
		const data = {
			email: email,
			password: password
		}
		console.log("data",data)
		try {
			this.http.post(this.backendUrl + '/login', data, {observe:'response'}).subscribe(res => {
				console.log('Response status:', res.status);
  			console.log('Body:', res.body);
			});
			return "success"
		} catch (e) {
			return "error"
		}
	}

	async register(name: string, email: string, password: string): Promise<string> {

		const data = {
			name: name,
			email: email,
			password: password
		}

		try {
			this.http.post(this.backendUrl + '/register', data).subscribe(response => {
				console.log("userCreated",response)
				return response
			});
			return "success"
		} catch (e) {
			return "error"
		}

	}

}
