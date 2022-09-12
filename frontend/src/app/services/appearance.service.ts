import { BehaviorSubject, Observable } from 'rxjs';
import { Appearance } from '../enums/appearance';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class AppearanceService {
	private appearance$: BehaviorSubject<Appearance>;

	constructor() {
		this.appearance$ = new BehaviorSubject<Appearance>(Appearance.LIGHT);
	}

	get(): Appearance {
		return this.appearance$.getValue();
	}

	getSubject(): BehaviorSubject<Appearance> {
		return this.appearance$;
	}

	subscribe(onAppearanceChange: (appearance: Appearance) => void): void {
		this.appearance$.subscribe(onAppearanceChange);
	}
}
