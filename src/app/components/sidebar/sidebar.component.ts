import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat, Reciever, StatusType } from '../../config';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { UserService } from '../../services';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss',
	imports: [CommonModule, MatCardModule, MatDividerModule, MatListModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
	public chatList = input<Chat[]>([]);
	public chatSelected = output<Reciever | null>();
	protected readonly chatStatus = StatusType;
	protected readonly userName;
	constructor(private user: UserService) {
		this.userName = this.user.id;
	}

	protected onSelectChat(reciever?: Reciever): void {
		this.chatSelected.emit(reciever ?? null);
	}
}
