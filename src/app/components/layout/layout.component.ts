import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-layout',
	imports: [],
	standalone: true,
	templateUrl: './layout.component.html',
	styleUrl: './layout.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {}
