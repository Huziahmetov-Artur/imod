import { Component } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { EMPTY } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
	public serverMessages = new Array<Object>();

	public clientMessage = '';
	public isBroadcast = false;
	public sender = 'client';

	private socket$: WebSocketSubject<Object>;

	constructor() {
		this.socket$ = new WebSocketSubject('ws://localhost:8080');

		this.socket$
			.pipe(
				catchError((error) => {
					console.error(error);
					return EMPTY;
				})
			)
			.subscribe((message) => this.serverMessages.push(message));
	}

	public send(): void {
		const message = {
			sender: this.sender,
			content: this.clientMessage,
			isBroadcast: this.isBroadcast
		};

		this.serverMessages.push(message);
		this.socket$.next(message);
		this.clientMessage = '';
	}

	public isMine(message: { sender: string }): boolean {
		return message && message.sender === this.sender;
	}
}
