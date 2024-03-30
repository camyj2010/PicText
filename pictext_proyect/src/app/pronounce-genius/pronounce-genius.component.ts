import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { isPlatformBrowser } from '@angular/common';
import { stringify } from 'querystring';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioRecorderService } from '../services/audio-recorder.service';

@Component({
	selector: 'app-pronounce-genius',
  standalone: true,
  imports: [RouterLink],
	templateUrl: './pronounce-genius.component.html',
	styleUrls: ['./pronounce-genius.component.css']
})
export class PronounceGeniusComponent implements OnInit{
  selectedFile: File | null = null;
  displayedText: string = 'Your word will appear here';

 isRecording = false;
  audioURL: string | null = null;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor(
		private http: HttpClient,
		private audioRecordingService: AudioRecorderService, 
		private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.audioRecordingService.audioBlob$.subscribe(blob => {
      this.audioURL = window.URL.createObjectURL(blob);
      this.audioPlayer.nativeElement.src = this.audioURL;
      this.cd.detectChanges();
    });
  }

  startRecording() {
    this.isRecording = true;
    this.audioRecordingService.startRecording();
  }

  async stopRecording() {
    this.isRecording = false;
    await this.audioRecordingService.stopRecording();
		this.audioRecordingService.audioBlob$.subscribe(blob => {
			const formData = new FormData();
			formData.append('audio', blob, 'recorded_audio.wav');
			this.http.post('http://127.0.0.1:8000/api/audio/', formData)
  .subscribe((response) => {
    console.log('Audio recording uploaded successfully:', response);
  }, (error) => {
    console.error('Error uploading audio recording:', error);
  });
		})
  }

	// selectedFile: File | undefined;
	// isRecording: boolean = false;
	// mediaRecorder: any;
	// recordedChunks: any[] = [];
	// audioUrl: any = null;

	// constructor(
	// 	private http: HttpClient,
	// 	@Inject(PLATFORM_ID) private platformId: Object,
	// 	private readonly sanitizer: DomSanitizer
	// ) { }

	// startRecording() {
	// 	this.recordedChunks = [];
	// 	if (isPlatformBrowser(this.platformId)) {
	// 		navigator.mediaDevices.getUserMedia({ audio: true })
	// 			.then((stream) => {
	// 				this.mediaRecorder = new MediaRecorder(stream);
	// 				this.mediaRecorder.start();
	// 				console.log(this.mediaRecorder.state);
	// 				this.mediaRecorder.addEventListener("dataavailable", (e: any) => {
	// 					console.log('Data available:', e.data);
	// 					this.recordedChunks.push(e.data);
	// 				});
	// 			})
	// 			.catch((err) => {
	// 				console.error('Error accessing microphone:', err);
	// 			});
	// 		this.isRecording = true;
	// 	}
	// }

	// stopRecording() {
	// 	if (this.isRecording) {
	// 		this.mediaRecorder.stop();
	// 		this.isRecording = false;
	// 		this.saveRecording();
	// 	}
	// }

	// saveRecording() {
	// 	console.log('Tamaño de recordedChunks:', this.recordedChunks.length);
	// 	const blob = new Blob(this.recordedChunks, { type: "audio/ogg; codecs=opus" });
	// 	const audioUrl = window.URL.createObjectURL(blob);
	// 	const audio = new Audio(audioUrl);
	//   audio.play();

	// 	// const downloadLink = document.createElement('a');
	// 	// downloadLink.href = this.audioUrl;
	// 	// downloadLink.download = 'recorded_audio.mp3';
	// 	// downloadLink.click();

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