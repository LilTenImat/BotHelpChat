import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
@Component({
	selector: 'app-layout',
	imports: [
		MatSidenavModule,
		MatButtonModule,
		MatIconModule,
		MatToolbarModule,
	],
	standalone: true,
	templateUrl: './layout.component.html',
	styleUrl: './layout.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
