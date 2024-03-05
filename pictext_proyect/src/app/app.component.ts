import { Component } from '@angular/core';
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

  uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      if (file) {
        console.log('File selected:', file);
        // Aquí se agrega la logica para cargar el archivo

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    input.click();
  }

  showText() {
    console.log('Texto ingresado:', this.textImput);
  }
}