import { Component, AfterViewInit, inject} from '@angular/core';
import {PDFDocument, rgb} from 'pdf-lib'
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { CommonModule } from '@angular/common'; // Importa CommonModule
import {MatTableModule,MatTableDataSource} from '@angular/material/table';
import { UserService } from '../user.service';

@Component({
  selector: 'app-pic-text',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatTableModule],
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

  imageUrl: string | undefined;

  textImage: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis, justo nec aliquam aliquet, nunc nunc tincidunt nunc, nec aliquam nunc nunc nec.';

  //Function to upload the image to the page
  uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      if (file) {
        console.log('File selected:', file);
        // Logic to load the image on the box

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    input.click();
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

  showText() {
    console.log('Texto ingresado:', this.textImput);
  }

  getUserData() {
    // Obtener el ID del usuario desde sessionStorage o localStorage, como sea necesario
    // const userId = sessionStorage.getItem('id');
    const userId = '65ed2051fe0962e8b1f5641c';
    if (userId) {
      this.userService.getUserRecords(userId).subscribe(
        (response: any) => {
          // Aquí puedes hacer lo que necesites con los datos del usuario
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
    // Limpiar el array RECORD_DATA antes de agregar los nuevos datos del historial del usuario
    RECORD_DATA.length = 0;
    console.log('Entre a la funcion')
  
    // Iterar sobre el historial del usuario y agregar cada entrada a RECORD_DATA
    recordHistory.forEach((record, index) => {
      RECORD_DATA.push({
        position: index + 1, // Asegúrate de asignar la posición correcta basada en el índice
        image: record.image,
        text: record.text
      });
      console.log('He añadido un elemento')
    });
  
    // Actualizar la fuente de datos de la tabla
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
