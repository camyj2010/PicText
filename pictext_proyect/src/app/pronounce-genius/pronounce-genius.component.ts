import { Component, AfterViewInit, inject, PLATFORM_ID, Inject, OnInit} from '@angular/core';
import {PDFDocument, rgb} from 'pdf-lib'
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { CommonModule } from '@angular/common'; // Importa CommonModule
import {MatTableModule,MatTableDataSource} from '@angular/material/table';
import { UserService } from '../user.service';
import { SendCloudinaryService } from '../services/send-cloudinary.service';
import { SendPictTextService } from '../services/send-pict-text.service';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pronounce-genius',
  templateUrl: './pronounce-genius.component.html',
  styleUrls: ['./pronounce-genius.component.css']
})
export class PronounceGeniusComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
