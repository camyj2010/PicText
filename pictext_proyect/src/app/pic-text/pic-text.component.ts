import { Component, AfterViewInit, inject} from '@angular/core';
import {PDFDocument, rgb} from 'pdf-lib'
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { CommonModule } from '@angular/common'; // Importa CommonModule
import {MatTableModule,MatTableDataSource} from '@angular/material/table';
import { UserService } from '../user.service';
import { SendCloudinaryService } from '../services/send-cloudinary.service';
import { SendPictTextService } from '../services/send-pict-text.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pic-text',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatTableModule, RouterLink],
  templateUrl: './pic-text.component.html',
  styleUrl: './pic-text.component.css'
})

export class PicTextComponent implements AfterViewInit {

  displayedColumns: string[] = ['position', 'image', 'text'];
  dataSource = new MatTableDataSource<recordElement>(RECORD_DATA);

  ngAfterViewInit() {
    this.getUserData();
  }

  userService = inject(UserService)

  textImput: string = '';
  
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
    try {
      // 
      const userId = sessionStorage.getItem('id')
      if(userId){
        await this.userService.updateUserRecord(userId, { image: this.imageUrl || '', text: this.textImage });
        console.log('Historial del usuario actualizado correctamente.');

        this.getUserData()
      }
    } catch (error) {
      console.error('Error al actualizar el historial del usuario:', error);

    }
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

  getUserData() {
    // Get the ID of the user from sessionStorage
    const userId = sessionStorage.getItem('id');
    if (userId) {
      this.userService.getUserRecords(userId).subscribe(
        (response: any) => {
          console.log('Datos del usuario:', response.record);

          if (response.record) {
            if(response.record.length == 0){

            }else{
              this.updateRecordData(response.record);
            }
          }
        },
        error => {
          console.error('Error al obtener los datos del usuario:', error);
        }
      );
    } else {
      console.error('ID de usuario no encontrado en el almacenamiento.');
    }
  }

  updateRecordData(recordHistory: Array<{ image: string, text: string }>) {
    // Cleans de dataset to add the new elements
    RECORD_DATA.length = 0;
    console.log('Entre a la funcion')
  
    // Iterate the record of the user and add each entry
    recordHistory.forEach((record, index) => {
      RECORD_DATA.push({
        position: index + 1, 
        image: record.image,
        text: record.text
      });
      console.log('He añadido un elemento')
    });
  
    this.dataSource.data = RECORD_DATA;
  }
}

export interface recordElement {
  position: number;
  image: string;
  text: string;
}

const RECORD_DATA: recordElement[] = [
  
];
