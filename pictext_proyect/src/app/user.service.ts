import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface LoginResponse {
  user:{
		id: string;
		name: string;
  		email: string;
		//record: Array<string>;
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

	saveData(id: string, name: string, email: string) {
	sessionStorage.setItem('id', id);
    sessionStorage.setItem('name', name);
    sessionStorage.setItem('email', email);
	//sessionStorage.setItem('record', JSON.stringify(record));
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

			(res.body?.user.name) ? this.saveData(res.body?.user.id, res.body?.user.name, res.body?.user.email):null
			//,res.body?.user.record
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

	getUserRecords(id: string) : Observable<LoginResponse> {
		return this.http.get<LoginResponse>(`${this.backendUrl}/one/:${id}`);
	} 

}
