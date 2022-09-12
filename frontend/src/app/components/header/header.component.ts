import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { Appearance } from 'src/app/enums/appearance';
import { AppearanceService } from 'src/app/services/appearance.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('toolbar') private toolbar!: ElementRef<HTMLDivElement>;
	appearance: Appearance;
	darkMode$: BehaviorSubject<boolean>;

	constructor(private appearanceService: AppearanceService) {
		this.appearance = appearanceService.get();
		this.darkMode$ = new BehaviorSubject(this.resolveDarkMode(this.appearance));
	}

	ngOnInit(): void {
		this.appearanceService.subscribe((appearance) => (this.appearance = appearance));
		this.adaptDarkModeToAppearance(this.appearanceService.getSubject());
	}

	ngAfterViewInit(): void {
		this.toolbar.nativeElement.addEventListener('wheel', (event) => this.scrollToolbar(event));
	}

	ngOnDestroy(): void {
		this.toolbar.nativeElement.removeEventListener('wheel', (event) =>
			this.scrollToolbar(event)
		);
	}

	private scrollToolbar(event: WheelEvent) {
		event.preventDefault();
		this.toolbar.nativeElement.scrollLeft += event.deltaY;
	}

	private adaptDarkModeToAppearance(appearance$: BehaviorSubject<Appearance>) {
		appearance$.pipe(distinctUntilChanged()).subscribe((appearance) => {
			this.darkMode$.next(this.resolveDarkMode(appearance));
		});
		this.darkMode$.pipe(distinctUntilChanged()).subscribe((darkMode) => {
			appearance$.next(this.resolveAppearance(darkMode));
		});
	}

	private resolveDarkMode(appearance: Appearance): boolean {
		return appearance === Appearance.DARK;
	}

	private resolveAppearance(darkMode: boolean): Appearance {
		return darkMode ? Appearance.DARK : Appearance.LIGHT;
	}
}
