import { Component, input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-user-info-mock',
	standalone: true,
	imports: [MatCardModule],
	template: `
		<mat-card
			appearance="outlined"
			class="user-info-mock"
			title="{{ userName() }}"
		>
			<mat-card-content>
				<div class="user-avatar-mock"></div>
				<div class="user-name-mock">
					{{ userName() }}
				</div>
			</mat-card-content>
		</mat-card>
	`,
	styles: `
	:host {
		min-width: 0;
		flex: 0 1 50%;
	}

	.user-info-mock {
		mat-card-content {
			display: flex;
			gap: 20px;
			align-items: center;
		}
	}

	.user-avatar-mock {
		border-radius: 50%;
		width: 40px;
		height: 40px;
		flex: 0 0 40px;
		background: grey;
	}

	.user-name-mock {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	`,
})
export class UserInfoMockComponent {
	public userName = input<string>('');
}
