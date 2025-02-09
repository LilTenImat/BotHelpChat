import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chat, Message, MessageType } from '../../config';

@Component({
	selector: 'app-chat',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './chat.component.html',
	styleUrl: './chat.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
	public currentChat = input<Chat | null>(null);

	sendMessage() {}
}
