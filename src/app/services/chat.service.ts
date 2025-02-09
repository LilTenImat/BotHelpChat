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
import { Chat, ChatMessage, Reciever, StatusType } from '../config';

@Injectable()
export class ChatService {
	private readonly chatIds = new Set();
	private readonly chatStore$ = new BehaviorSubject<Chat[]>([]);
	private readonly selectedChatId$ = new BehaviorSubject<Reciever | null>(
		null
	);

	constructor(private storage: StorageService) {}

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

	public selectChat(reciever: Reciever | null): void {
		this.selectedChatId$.next(reciever);
	}

	private getChannel(reciever: Reciever): Chat {
		const messages$ = this.storage.messages$.pipe(
			filter((message) => message.reciever === reciever),
			scan((acc, curr) => [...acc, curr], <ChatMessage[]>[])
		);

		const status$ = this.storage.statuses$.pipe(
			filter((message) => message.reciever === reciever),
			map((message) => message.content)
		);

		return {
			messages$,
			status$,
			reciever,
		};
	}
}
