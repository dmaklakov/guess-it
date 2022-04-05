import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Message } from '../../shared/models/message';

// Service for connection between frontend app and backend server
@Injectable({
    providedIn: 'root',
})
export class WebsocketService {

    public received: Observable<Message>;

    private ws: WebSocket;
    private receivedSubject: Subject<Message>;
    private messages: Array<Message>;

    constructor() {
        this.receivedSubject = new Subject();
        this.received = this.receivedSubject.asObservable();
    }

	// Create connection as a joined player
    public join(gameId: string) {
      this.connect("join", gameId);
    }
  
	// Create connection as a first player
    public create(gameId: string) {
      this.connect("create", gameId);
    }
  
    // Making a connection to a server with gamecode
    private connect(prefix: string, gameId: string) {
        this.messages = [];
        this.ws = new WebSocket("wss://guessit-backend.1up.kiwi/" + prefix + "/" + gameId);

        this.ws.onmessage = ev => this.receivedSubject.next(JSON.parse(ev.data));
        this.ws.onerror = ev => this.receivedSubject.error(ev);
        this.ws.onopen = () => {
            this.messages.forEach(m => {
                this.send(m);
            });
            this.messages = [];
        };
    }

	// Destroying a connection to server
    public disconnect() {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.close();
        }
    }

	// Function for sending messages to a server
    public send(message: Message) {
        if (!this.ws.readyState || this.ws.readyState !== this.ws.OPEN) {
            this.messages.push(message);
        } else {
            this.ws.send(JSON.stringify(message));
        }
    }
}
