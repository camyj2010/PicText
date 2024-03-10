import { Component, inject  } from '@angular/core';
import {PDFDocument, rgb} from 'pdf-lib'
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { SendCloudinaryService } from '../services/send-cloudinary.service';
import { SendPictTextService } from '../services/send-pict-text.service';

@Component({
  selector: 'app-pic-text',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './pic-text.component.html',
  styleUrl: './pic-text.component.css'
})
export class PicTextComponent {
  text: string = '';

  imageUrl: string | undefined;

  textImage: string = '';
  
  selectedFile: File | undefined;
  imagePath:string | undefined;

  sendPictTextService = inject(SendPictTextService)
	info:string|null = null;

  constructor(private sendCloudinaryService:SendCloudinaryService){}

//SUBIR IMAGEN A COULDINARY Y MOSTRARLA  
  uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', (event: any) => {
      this.selectedFile = event.target.files[0]; // Store the selected file
      if (this.selectedFile) {
        console.log('File selected:', this.selectedFile);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile);
        
        // Logic to send the image to the cloudinary service
        const data = new FormData();
        data.append('file', this.selectedFile);
        data.append('upload_preset', 'angular_cloudinary');
        data.append('cloud_name', 'vikingr-saga');

        this.sendCloudinaryService.sendImage(data).subscribe({
          next: (response: any) => {
            console.log(response);
            this.imagePath = response.url;
            console.log(response.url);
          },
          error: (e: any) => {
            console.log(e);
          }
        });
      }
    });

    input.click();
  }
  //ENVIAR IMAGEN Y TEXTO AL BACKEND
  sendImage() {
    console.log("holllaaaaaaaaaaaaaaaa", this.text);
  
    this.sendPictTextService.pictTextAI(
      this.text ?? '',
      this.imagePath ?? ''
    ).then((response) => {
      if (response.status === "success" && response.generatedText) {
        console.log("nice");
        this.textImage = response.generatedText;
      } else {
        console.log("error sending");
        this.info = "Error sending";
      }
    }).catch(error => {
      console.error("Error sending image and text:", error);
      this.info = "Error sending";
    });
  }
  //Function to save the text into a PDF and downloads it
  async downloadPDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;

    const lines = this.splitText(this.textImage, width - 100, fontSize); // Split text into lines that fit within page width

    const startY = height - 50; // Starting y-coordinate for drawing text

    let currentY = startY;
    for (const line of lines) {
      page.drawText(line, {
        x: 50,
        y: currentY,
        size: fontSize,
        color: rgb(0, 0, 0)
      });
      currentY -= fontSize + 5; // Move to next line
    }

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'text.pdf';
    link.click();

    window.URL.revokeObjectURL(url);
  }

  //Auxiliary function to split the text to fit in the document
  splitText(text: string, maxWidth: number, fontSize: number): string[] {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
  
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = this.getTextWidth(word, fontSize); // Obtain the width of the text
  
      if (this.getTextWidth(currentLine + ' ' + word, fontSize) < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }
  
  //Auxiliary function to obtain the max width of the text
  getTextWidth(text: string, fontSize: number): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      return 0;
    }
    context.font = `${fontSize}px Arial`;
    const width = context.measureText(text).width;
    return width;
  }
//MOSTRAR TEXTO AL DAR ENTER
  showText() {
    console.log('Texto ingresado:', this.text);
  }
}
