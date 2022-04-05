import { Component, OnInit } from '@angular/core';
import { GameParamsService } from '../../core/services/game-params.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  showModal = false;
  constructor(public game: GameParamsService, private router: Router) {}

  ngOnInit(): void {}

  // On Create-Button: form a new gamecode (6 letters)
  public clickCreate(): void {
    let code = '';
    let letters = 'ABCDEFGHJKMNOPQRSTUVWXYZ';
    for (let i = 0; i < 6; i++) {
      code = code + letters.charAt(Math.floor(Math.random() * letters.length));
    }
    this.game.gamecode = code;
    this.game.creates = true;
    this.router.navigate(['lobby']);
  }

  public toggleModal(): void {
    this.showModal = !this.showModal;
  }

  // Getting event from clicking in Join-Button
  handleModalEvent(event: string | boolean): void {
    if (event === true) {
      this.toggleModal();
    } else {
      this.game.gamecode = String(event).toUpperCase();
      this.game.creates = false;
      this.router.navigate(['lobby']);
    }
  }
}
