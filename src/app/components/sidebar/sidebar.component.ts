import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat } from '../../config';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss',
	imports: [CommonModule],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
	public chatList = input<Chat[]>([]);
	constructor() {
		effect(() => {
			console.log(this.chatList());
		})
	}
}
