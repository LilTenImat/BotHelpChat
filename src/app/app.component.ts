import {
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { StorageService, UserService, ChatService } from './services';
import { SidebarComponent, LayoutComponent, ChatComponent } from './components';
import { StatusType } from './config';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-root',
	imports: [CommonModule, LayoutComponent, SidebarComponent, ChatComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	providers: [StorageService, UserService, ChatService],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
	public title = 'BotHelpChatApp';

	protected chatList$;
	protected currentChat$;
	private destroy$ = new Subject<void>();

	constructor(private storage: StorageService, private chat: ChatService) {
		this.chatList$ = this.chat.chats$;
		this.currentChat$ = this.chat.currentChat$;
	}

	public ngOnInit(): void {
		this.storage.status(StatusType.Idle);
		this.chat.createChat('all');
		this.chat.selectChat('all');

		this.storage.statuses$
			.pipe(takeUntil(this.destroy$))
			.subscribe((status) => this.chat.createChat(status.sender));
	}

	public ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
