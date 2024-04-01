import { ChangeDetectorRef, Component, ElementRef, inject, Inject, OnInit, ViewChild, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AudioRecorderService } from '../services/audio-recorder.service';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { Record } from '../services/record-word.service';


export interface WordResponse {
  word:string
	// Agrega otras propiedades si es necesario
}

@Component({
	selector: 'app-pronounce-genius',
  standalone: true,
  imports: [RouterLink],
	templateUrl: './pronounce-genius.component.html',
	styleUrls: ['./pronounce-genius.component.css']
})
export class PronounceGeniusComponent implements OnInit{
	userService = inject(UserService)

	ngAfterViewInit() {
	  this.getUserData();
	}
	
	selectedFile: File | null = null;
  displayedText: string = 'Welcome, please select the dificulty';
  correctWords: string[] = [];
  incorrectWords: string[] = [];
  max_streak: number = 0;
  current_streak: number = 0;	
  dificulty: string = '';
	userEmail: string = '';
	private backendURL = 'http://127.0.0.1:8000/api'

	isRecording = false;
  audioURL: string | null = null;
	//@ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
	private audioBlobSubscription: Blob | null = null;

  constructor(
		private http: HttpClient,
		private audioRecordingService: AudioRecorderService, 
		private cd: ChangeDetectorRef,
		@Inject(PLATFORM_ID) private platformId: Object,
		private record: Record) { }

  ngOnInit() {
		this.getUserData()
    this.audioRecordingService.audioBlob$.subscribe(blob => {
			this.audioBlobSubscription = blob
      this.audioURL = window.URL.createObjectURL(blob);
      //this.audioPlayer.nativeElement.src = this.audioURL;
      this.cd.detectChanges();
    });
  }

	changeColor(color: string) {
		if (color === 'hard') {
			this.dificulty = 'hard';
		} else if (color === 'average') {
			this.dificulty = 'average';
		} else {
			this.dificulty = 'easy';
		}
		this.changeWord(color);
	}

	changeWord(dificulty: string) {
		let dificultyWord = {difficulty: ''};
		if (dificulty === 'hard') {
			dificultyWord.difficulty = 'hard';
		} else if (dificulty === 'average') {
			dificultyWord.difficulty = 'medium';
		} else {
			dificultyWord.difficulty = 'easy';
		}

		try {
			console.log('Dificulty:', dificultyWord);
			this.http.post<WordResponse>(this.backendURL+'/random_word/', dificultyWord, { observe: 'response' }).subscribe
			((res) => {
				console.log('Word:', res.body);
				this.displayedText = res.body? res.body.word: 'Error getting word';
				return
			});
		}catch(e) {
			this.displayedText = 'Error getting word';
			console.error('Error:', e);
		}
		this.displayedText = 'Error getting word';
	}

  startRecording() {
    this.isRecording = true;
    this.audioRecordingService.startRecording();
  }

  async stopRecording() {
    this.isRecording = false;
    const blob = await this.audioRecordingService.stopRecording()
			const formData = new FormData();
			formData.append('audio', blob ? blob : new Blob(), 'recorded_audio.webm');
			formData.append('word', this.displayedText);
			formData.append('correo', this.userEmail);
			formData.append('racha', '3');
			this.http.post(this.backendURL+'/audio/', formData)
  .subscribe((response) => {
		this.getUserData()
    console.log('Audio recording uploaded successfully:', response);
  }, (error) => {
    console.error('Error uploading audio recording:', error);
  });
		}


		getUserData() {
			// Get the Email of the user from sessionStorage
			if(isPlatformBrowser(this.platformId)){
			  const userEmail = sessionStorage.getItem('email');
			  this.userEmail = userEmail !== null ? userEmail : '';
			  if(userEmail){
				this.http.get<any>('http://127.0.0.1:8000/api/obtener/')
				  .subscribe((response) => {
					console.log('User data:', response);
		
					 // Find the user by email
					 const userData = response.datos_usuarios.find((user: any) => user.email === userEmail);
					 if(userData){
					   console.log('Found user:', userData);
		
					   // Process userData to get correct and incorrect words
					   const processedData = this.record.fetchWords(userData);
					   this.correctWords = processedData.correctWords;
					   this.incorrectWords = processedData.incorrectWords;
		
					   console.log('Correct words:', this.correctWords);
					   console.log('Incorrect words:', this.incorrectWords);
					   // Updates the divs information with the correct and incorrect words
					   const correctTextBox = document.querySelector('.correct-text-box');
					   const incorrectTextBox = document.querySelector('.incorrect-text-box');
		
					   if (correctTextBox && incorrectTextBox) {
						 correctTextBox.innerHTML = this.correctWords.join('<br>');
						 incorrectTextBox.innerHTML = this.incorrectWords.join('<br>');
					   }
					 } else {
					   console.log('User not found');
					 }
				  }, (error) => {
					console.error('Error fetching user data:', error);
				  });
			  }
			}
		  }
  	
	// 	// const formData = new FormData();
	// 	// formData.append('audio', blob, 'recorded_audio.webm');

	// 	// // Replace 'YOUR_ENDPOINT' with your actual endpoint URL
	// 	// this.http.post('http://127.0.0.1:8000/api/audio/', formData)
	// 	//   .subscribe((response) => {
	// 	//     console.log('Audio recording uploaded successfully:', response);
	// 	//   }, (error) => {
	// 	//     console.error('Error uploading audio recording:', error);
	// 	//   });
	// }
}