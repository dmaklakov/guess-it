import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from "@angular/common/http";

// Component for rounds with text
@Component({
  selector: 'app-game-round-text',
  templateUrl: './game-round-text.component.html',
  styleUrls: ['./game-round-text.component.scss']
})
export class GameRoundTextComponent implements OnInit, OnChanges {
  @Input() 
  url: string;
  text: string;

  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
    this.loadText();
  }

  ngOnChanges(): void {
    this.loadText();
  }

  loadText(): void {
    this.http.get(this.url, { responseType: 'text' }).subscribe(data => {
      this.text = data;
    });
  }

}
