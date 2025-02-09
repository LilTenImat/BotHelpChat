import { Injectable, Inject } from '@angular/core';
import {
	BehaviorSubject,
	filter,
	fromEvent,
	map,
	merge,
	Observable,
	ReplaySubject,
	Subject,
	tap,
} from 'rxjs';
import {
	BROADCAST_CHANNEL_KEY,
	ChatMessage,
	MessageType,
	Reciever,
	StatusMessage,
	StatusType,
} from '../config';
import { UserService } from './user.service';

@Injectable()
export class StorageService {
	private readonly channel = new BroadcastChannel(BROADCAST_CHANNEL_KEY);
	private eventBus$ = fromEvent<MessageEvent>(this.channel, 'message');

	private readonly localMessage$ = new Subject<ChatMessage>();
	public readonly messages$ = this.getMessages$();
	public readonly statuses$ = this.getStatuses$();

	constructor(private user: UserService) {
		this.messages$.subscribe(console.log);
	}

	public chat(content: string, reciever: Reciever): void {
		const message: ChatMessage = {
			content,
			reciever,
			id: crypto.randomUUID(),
			sender: this.user.id,
			type: MessageType.Content,
		};

		this.localMessage$.next(message);
		this.channel.postMessage(message);
	}

	public status(content: StatusType, reciever: Reciever): void {
		const message: StatusMessage = {
			content,
			reciever,
			id: crypto.randomUUID(),
			sender: this.user.id,
			type: MessageType.Status,
		};

		this.channel.postMessage(message);
	}

	private getMessages$(): Observable<ChatMessage> {
		const contentSource$ = this.eventBus$.pipe(
			map((event) => <ChatMessage>event.data),
			filter((message) => message.type === MessageType.Content),
			filter(
				(message) =>
					message.reciever === 'all' ||
					message.reciever === this.user.id
			)
		);

		const messagesSource$ = new ReplaySubject<ChatMessage>();

		merge(contentSource$, this.localMessage$).subscribe(messagesSource$);

		return messagesSource$;
	}

	private getStatuses$(): Observable<StatusMessage> {
		return this.eventBus$.pipe(
			map((event) => <StatusMessage>event.data),
			filter((message) => message.type === MessageType.Status),
			filter(
				(message) =>
					message.reciever === 'all' ||
					message.reciever === this.user.id
			)
		);
	}
}
