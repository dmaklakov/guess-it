import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameParamsService } from 'src/app/core/services/game-params.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { Command } from 'src/app/shared/models/command.enum';
import { Player } from 'src/app/shared/models/player';

// Class for a game chat
@Component({
  selector: 'app-game-chat',
  templateUrl: './game-chat.component.html',
  styleUrls: ['./game-chat.component.scss'],
})
export class GameChatComponent implements OnInit {
  @ViewChild('chatContainer') chatContainer: ElementRef;
  wsSubscription: Subscription;
  messages = new Array<ChatMessage>();
  threshHold = 250;

  private automaticScrolling = true;
  constructor(public ws: WebsocketService, public game: GameParamsService) {
  }

  ngOnInit(): void {
	// Subscriptio on updates for chat (suggesstions from players)
    this.wsSubscription = this.ws.received.subscribe((message) => {
      if (message.cmd === Command.GUESSED_CORRECT) {
        this.messages.push(
          new ChatMessage(
            ' guessed correctly',
            this.game.getPlayerOnId(message.parameters.playerId),
            false
          )
        );
      }
      if (message.cmd === Command.GUESSED_WRONG) {
        this.messages.push(
          new ChatMessage(
            message.parameters.guess,
            this.game.getPlayerOnId(message.parameters.playerId)
          )
        );
      }
      if (message.cmd === Command.GUESSED_WRONG || Command.GUESSED_CORRECT) {
        this.scrollToBottom();
      }
    });
  }

  private scrollToBottom(): void {
    let element = this.chatContainer.nativeElement;
    this.automaticScrolling =
      element.scrollHeight - element.scrollTop - this.threshHold <=
      element.clientHeight;

    if (!this.automaticScrolling) return;

    try {
      setTimeout(() => {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }, 0);
    } catch (error) {}
  }

  ngOnDestroy(): void {
    this.wsSubscription.unsubscribe();
  }

}

// Class describing messages from chat
class ChatMessage {
  public player: Player;
  public message: string;
  public isRealPlayer: boolean;

  constructor(message: string, player?: Player, isRealPlayer = true) {
    this.player = player;
    this.message = message;
    this.isRealPlayer = isRealPlayer;
  }
}
