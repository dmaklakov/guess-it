import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GameParamsService } from 'src/app/core/services/game-params.service';

// Class for an animated timer at a game page 
@Component({
  selector: 'app-game-timer',
  templateUrl: './game-timer.component.html',
  styleUrls: ['./game-timer.component.scss']
})
export class GameTimerComponent implements OnInit, OnChanges {
  @Input()
  time: number;
  timeLeft: number;
  dashArray: String;
  pauseTransition: boolean;
  
  private readonly treshHold = 40;
  private readonly radius = 45;
  private timerIntervalSubscription: Subscription;
  private fullCirclePath: number;

  constructor(public game: GameParamsService) { 
    this.fullCirclePath = 2 * this.radius * Math.PI;
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void{
    this.reset();
    this.pauseTransition = true;
    this.timerIntervalSubscription = timer(1, 1000).subscribe((val) => {
      if(val !== 0 && this.timeLeft !== 0) {
        this.timeLeft--;
      } else {      
        this.pauseTransition = false;
      }
        
      this.dashArray = `${this.calculatePathOfRemainingTime()} ${this.fullCirclePath}`;
    });
  }

  get treshHoldReached(): boolean {
    return (this.timeLeft / this.time) * 100 < this.treshHold;
  }

  private reset(): void {
    this.timerIntervalSubscription?.unsubscribe();
    this.timeLeft = this.time-1;
    this.dashArray = `${this.fullCirclePath} ${this.fullCirclePath}`;
  }

  private calculatePathOfRemainingTime(): number {
    let rawTimeFraction =  this.timeLeft / this.time;
    rawTimeFraction = rawTimeFraction - (1 / this.time) * (1 - rawTimeFraction);
    return this.fullCirclePath * rawTimeFraction;
  }

  ngOnDestroy(): void {
    this.timerIntervalSubscription?.unsubscribe();
  }

}
