import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import {
	BehaviorSubject,
	filter,
	map,
	Observable,
	scan,
	switchMap,
} from 'rxjs';
import { Chat, ChatMessage, Reciever, Sender, StatusType } from '../config';

@Injectable()
export class ChatService {
	private readonly chatIds = new Set();
	private readonly chatStore$;
	private readonly selectedChatId$ = new BehaviorSubject<Reciever | null>(
		null
	);
	private readonly userId;

	constructor(private storage: StorageService, private user: UserService) {
		this.userId = this.user.id;
		this.chatStore$ = new BehaviorSubject<Chat[]>([
			this.getBroadcastChannel(),
		]);
	}

	public get chats$(): Observable<Chat[]> {
		return this.chatStore$.asObservable();
	}

	public get currentChat$(): Observable<Chat | null> {
		return this.selectedChatId$.pipe(
			switchMap((chatId) =>
				this.chats$.pipe(
					map(
						(chats) =>
							chats.find((chat) => chat.reciever === chatId) ??
							null
					)
				)
			)
		);
	}

	public createChat(reciever: Reciever): void {
		if (this.chatIds.has(reciever)) return;
		this.chatIds.add(reciever);
		this.storage.status(StatusType.Idle, reciever);
		this.chatStore$.next([
			...this.chatStore$.value,
			this.getChannel(reciever),
		]);
	}

	public selectChat(reciever: Reciever | null = 'all'): void {
		this.selectedChatId$.next(reciever);
	}

	private getBroadcastChannel(): Chat {
		const messages$ = this.storage.messages$.pipe(
			filter((message) => message.reciever === 'all'),
			scan((acc, curr) => [curr, ...acc], <ChatMessage[]>[])
		);

		const status$ = this.storage.statuses$.pipe(
			filter((message) => message.reciever === 'all'),
			map((message) => message.content)
		);

		return {
			status$,
			messages$,
			reciever: 'all',
		};
	}

	private getChannel(sender: Sender): Chat {
		const messages$ = this.storage.messages$.pipe(
			filter((message) => message.reciever !== 'all'),
			filter(
				(message) =>
					message.sender === sender || message.sender === this.userId
			),
			scan((acc, curr) => [curr, ...acc], <ChatMessage[]>[])
		);

		const status$ = this.storage.statuses$.pipe(
			filter((message) => message.reciever !== 'all'),
			filter(
				(message) =>
					message.sender === sender || message.sender === this.userId
			),
			map((message) => message.content)
		);

		return {
			status$,
			messages$,
			reciever: sender,
		};
	}
}
