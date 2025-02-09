import {
	ChangeDetectionStrategy,
	Component,
	effect,
	ElementRef,
	input,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Chat, ChatMessage, Reciever, StatusType } from '../../config';
import { ChatService, StorageService, UserService } from '../../services';
import {
	BehaviorSubject,
	debounceTime,
	filter,
	Subject,
	Subscription,
	switchMap,
	takeUntil,
	tap,
} from 'rxjs';
@Component({
	selector: 'app-chat',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatCardModule,
		MatInputModule,
		MatFormFieldModule,
		MatButtonModule,
	],
	templateUrl: './chat.component.html',
	styleUrl: './chat.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, OnDestroy {
	public currentChat = input<Chat | null>(null);
	protected readonly chatStatus = StatusType;
	protected readonly userId;
	protected readonly form = new FormControl<string | null>(null);

	private readonly destroy$ = new Subject<void>();
	@ViewChild('messagesContainer', { read: ElementRef })
	messagesContainer?: ElementRef<HTMLDivElement>;
	constructor(
		private storage: StorageService,
		private user: UserService,
		private chat: ChatService
	) {
		this.userId = this.user.id;
		effect((onCleanup) => {
			const chat = this.currentChat();
			this.form.reset(null);
			let scrollSub: Subscription | null = null;
			if (chat) {
				scrollSub = chat.messages$.subscribe(() => {
					if (this.messagesContainer) {
						const element = this.messagesContainer.nativeElement;
						setTimeout(() =>
							element.scroll({ top: element.scrollHeight })
						);
					}
				});
			}

			onCleanup(() => scrollSub?.unsubscribe());
		});
	}

	public ngOnInit(): void {
		this.chat.currentChat$
			.pipe(
				filter((chat) => chat !== null),
				switchMap((chat) =>
					this.form.valueChanges.pipe(
						filter((value) => value !== null),
						tap(() =>
							this.storage.status(
								StatusType.Typing,
								chat?.reciever
							)
						),
						debounceTime(1000),
						tap(() =>
							this.storage.status(StatusType.Idle, chat.reciever)
						)
					)
				),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	public ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	protected onSendMessage(reciever: Reciever): void {
		const value = this.form.getRawValue();

		if (value?.trim()) {
			this.storage.chat(value, reciever);
			this.form.reset(null);
		}
	}

	protected onSelectChat(reciever: Reciever): void {
		this.chat.selectChat(reciever);
	}
}
