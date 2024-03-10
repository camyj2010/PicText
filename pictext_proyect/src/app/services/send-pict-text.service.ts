import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SendPictTextService {
  backendUrl = 'http://localhost:3001';
  
  constructor(private http: HttpClient) {}

  async pictTextAI(text: string, imagePath: string): Promise<{ status: string; generatedText?: string }> {
    const data = {
      text: text,
      imagePath: imagePath
    };

    try {
      const response = await this.http.post<any>(this.backendUrl + '/response', data, { observe: 'response' }).toPromise();
      return { status: 'success', generatedText: response?.body?.generatedText };
    } catch (e) {
      console.error('Error:', e);
      return { status: 'error' };
    }
}
}
