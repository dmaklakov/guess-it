import { Injectable } from '@angular/core';
import { Player } from '../../shared/models/player';
import { Message } from '../../shared/models/message';

/// Global class describing a current game
@Injectable({
  providedIn: 'root',
})
export class GameParamsService {
  player: Player;
  firstMessage: Message;
  players = new Array<Player>();
  gamecode = '';
  host_player = false;
  hostId = '';
  totalRounds = 0;
  creates = true;

  constructor() {}

  // Deleting player by index (f.e. when left)
  deletePlayerArray(id: string): void {
    let index: number = -1;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id == id) {
        index = i;
        break;
      }
    }
    if (index > -1) {
      this.players.splice(index, 1);
    }
  }

  // Check, if this is players if
  isYou(id: string): boolean {
    return id == this.player.id;
  }

  // Clear-function, f.e. when the current player leave
  clear(): void {
    this.player = null;
    this.firstMessage = null;
    this.players = [];
    this.gamecode = '';
    this.host_player = false;
    this.hostId = '';
    this.creates = false;
    this.totalRounds = 0;
  }

  // Update after every round
  clearAfterRound(): void {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].prevPoints = this.players[i].points;
    }
    this.players.forEach((p) => (p.guessedRoundCorrect = false));
  }

  // Get player in the game by id
  getPlayerOnId(id: string): Player {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id == id) {
        return this.players[i];
      }
    }
  }

  // Sorting players for round by points
  getPlayersOrderedByPointsGain(): Player[] {
    let playersCp = [...this.players];
    return playersCp.sort(
      (p1, p2) => p2.points - p2.prevPoints - (p1.points - p1.prevPoints)
    );
  }
 
  // Get current players place (array is sorted)
  getPlaceOnId(id: string): number {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id == id) {
        return i;
      }
    }
  }

  // Update points by player, sort
  setPointsOnId(id: string, points: number): void {
    let player = this.players.find((p) => p.id == id);
    let prevPoints = player.points;
    player.points = points;
    player.prevPoints = prevPoints;
    this.players.sort((n1, n2) => n2.points - n1.points);
  }

  // Player has solved the round
  setGuessCorrectOnId(id: string) {
    let player = this.players.find((p) => p.id == id);
    player.guessedRoundCorrect = true;
  }
}
