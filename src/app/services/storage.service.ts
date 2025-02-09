import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, filter, fromEvent, map, Observable } from 'rxjs';
import { BROADCAST_CHANNEL_KEY, ChatMessage, Message, MessageType, Reciever, StatusMessage, StatusType } from '../config';
import { UserService } from './user.service';

@Injectable()
export class StorageService {
	private channel = new BroadcastChannel(BROADCAST_CHANNEL_KEY);

	private eventBus$ = fromEvent<MessageEvent>(this.channel, 'message');
	public readonly messages$ = this.getMessages$();
	public readonly statuses$ = this.getStatuses$();

	constructor(private user: UserService) { }

	public chat(content: string, reciever: Reciever = 'all'): void {
		const message: ChatMessage = {
			content,
			reciever,
			sender: this.user.id,
			type: MessageType.Content,
		};

		this.channel.postMessage(message);
	}

	public status(content: StatusType, reciever: Reciever = 'all'): void {
		const message: StatusMessage = {
			content,
			reciever,
			sender: this.user.id,
			type: MessageType.Status,
		};

		this.channel.postMessage(message);
	}

	private getMessages$(): Observable<ChatMessage> {
		return this.eventBus$.pipe(
			map((event) => <ChatMessage>event.data),
			filter((message) => message.type === MessageType.Content),
			filter(
				(message) =>
					message.reciever === this.user.id ||
					message.reciever === 'all'
			)
		);
	}

	private getStatuses$(): Observable<StatusMessage> {
		return this.eventBus$.pipe(
			map((event) => <StatusMessage>event.data),
			filter((message) => message.type === MessageType.Status),
			filter(
				(message) =>
					message.reciever === this.user.id ||
					message.reciever === 'all'
			)
		);
	}
}
