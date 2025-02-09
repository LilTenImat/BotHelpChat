import {
	ChangeDetectionStrategy,
	Component,
	HostListener,
	OnInit,
} from '@angular/core';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { UserInfoMockComponent } from '../sidebar/user-info-mock.component';
import { UserService } from '../../services';
@Component({
	selector: 'app-layout',
	imports: [
		CommonModule,
		MatSidenavModule,
		MatButtonModule,
		MatIconModule,
		MatToolbarModule,
		UserInfoMockComponent,
	],
	standalone: true,
	templateUrl: './layout.component.html',
	styleUrl: './layout.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
	private readonly pageWidth$ = new BehaviorSubject<number>(0);
	protected readonly drawerMode$: Observable<MatDrawerMode> =
		this.pageWidth$.pipe(map((width) => (width > 500 ? 'side' : 'over')));
	protected readonly userName;
	constructor(private user: UserService) {
		this.userName = this.user.id;
	}
	@HostListener('window:resize')
	private onResize(): void {
		this.pageWidth$.next(window.innerWidth);
	}
	public ngOnInit(): void {
		this.onResize();
	}
}
