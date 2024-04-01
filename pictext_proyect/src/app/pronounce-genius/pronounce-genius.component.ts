import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AudioRecorderService } from '../services/audio-recorder.service';
import { Subscription } from 'rxjs';


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
  selectedFile: File | null = null;
  displayedText: string = 'Welcome, please select the dificulty';
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
		@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
		this.getData()
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
			this.http.post<WordResponse>(this.backendURL+'/audio/random_word', dificultyWord, { observe: 'response' }).subscribe
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
    this.audioRecordingService.stopRecording().then(() => {
			const formData = new FormData();
			formData.append('audio', this.audioBlobSubscription ? this.audioBlobSubscription : new Blob(), 'recorded_audio.webm');
			formData.append('word', this.displayedText);
			formData.append('email', this.userEmail);
			this.http.post(this.backendURL+'/audio/', formData)
  .subscribe((response) => {
    console.log('Audio recording uploaded successfully:', response);
  }, (error) => {
    console.error('Error uploading audio recording:', error);
  });
		})
  }

	getData(){
    if (isPlatformBrowser(this.platformId)) {
			const userEmail = sessionStorage.getItem('email');
    	this.userEmail = userEmail !== null ? userEmail : '';
		}else{
			this.userEmail = '';
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