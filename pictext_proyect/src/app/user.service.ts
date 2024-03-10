import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface LoginResponse {
  user:{
		name: string;
  	email: string;
	}
	// Agrega otras propiedades si es necesario
}

@Injectable({
	providedIn: 'root',
})
export class UserService {
	backendUrl = 'http://localhost:3001';
	constructor(private http: HttpClient) {
		// This service can now make HTTP requests via `this.http`.
	}

	saveData(name: string, email: string) {
    sessionStorage.setItem('name', name);
    sessionStorage.setItem('email', email);
  }

	async login(email: string, password: string): Promise<string> {
		const data = {
			email: email,
			password: password
		}
		try {
			this.http.post<LoginResponse>(this.backendUrl + '/login', data, { observe: 'response' }).subscribe(res => {
				console.log('Response status:', res.status);
				console.log('Body:', res.body);

			(res.body?.user.name) ? this.saveData(res.body?.user.name, res.body?.user.email):null
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
				console.log("userCreated", response)
				return response
			});
			return "success"
		} catch (e) {
			return "error"
		}

	}

	

}
