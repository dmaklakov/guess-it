import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { WebsocketService } from './core/services/websocket.service';
import { GameParamsService } from './core/services/game-params.service';
import { NavigationStart, Router } from '@angular/router';

import { filter } from 'rxjs/operators';

// The main component class
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'guess-it';
  leaveInvisible: boolean;
  headerVisible: boolean;

  constructor(private readonly ws: WebsocketService, private game: GameParamsService, public router: Router) { }
  
  ngOnInit(): void { 
    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((nav:NavigationStart) => {
      this.leaveInvisible = (nav.url === '/' || nav.url === "/home");
      this.headerVisible = (nav.url !== "/game");
    });
  }
  
  // Function by pressing leave button - destroy connenction
  public leave(): void {
	  //this.game.subscription.unsubscribe();
	  this.game.clear();
	  this.ws.disconnect();  
	  this.router.navigate(['']);
  }
  
  ngOnDestroy() {
	  this.leave();
  }
}
