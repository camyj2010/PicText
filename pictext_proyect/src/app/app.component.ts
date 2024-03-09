import { Component } from '@angular/core';
import {PDFDocument, rgb} from 'pdf-lib'
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule // Agrega FormsModule aquí
  ]
})
export class AppComponent {
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
}