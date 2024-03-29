import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pronounce-genius',
  templateUrl: './pronounce-genius.component.html',
  styleUrls: ['./pronounce-genius.component.css']
})
export class PronounceGeniusComponent {
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void { 
    console.log("on file selected")
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0] as File;
    }
  }

  onSubmit(event: Event): void {
    console.log("entre al onSubmit1");
    event.preventDefault(); 

    if (this.selectedFile) {
      console.log("entre al onSubmit");
      const formData = new FormData();
      formData.append('audio', this.selectedFile);

      this.http.post('http://127.0.0.1:8000/api/audio/', formData)
        .subscribe(response => {
          console.log('Archivo enviado correctamente', response); 
        }, error => {
          console.error('Error al enviar el archivo', error); 
        });
    }
  }
}