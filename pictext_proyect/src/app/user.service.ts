import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	backendUrl = 'http://localhost:3001';
	constructor(private  http: HttpClient) {
		// This service can now make HTTP requests via `this.http`.
	}

	async register(name: string, email: string, password: string):Promise<string> {

		const data = {
			name: name,
			email: email,
			password: password
		}
		console.log("name: " + name + " email: " + email + " password: " + password)
		try{
			const response = await this.http.post(this.backendUrl + '/register',data).subscribe((response) => {
			return response
		});
		console.log(response)
		return "success"
		}catch(e){
			return "error"
		}
		
	}

}
