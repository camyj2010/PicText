import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Record {

  constructor() { }

  fetchWords(userData: any): { correctWords: string[], incorrectWords: string[] } {
    const correctWords: string[] = [];
    const incorrectWords: string[] = [];

    if(userData && userData.trys) {
      userData.trys.forEach((tryData: any) => {
        if(tryData.correct) {
          correctWords.push(tryData.word);
        } else {
          incorrectWords.push(tryData.word);
        }
      });
    }

    return {
      correctWords,
      incorrectWords
    };
  }

}