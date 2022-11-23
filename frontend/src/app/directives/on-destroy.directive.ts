import { Directive, Input, OnDestroy } from '@angular/core';

@Directive({
	selector: '[appOnDestroy]',
})
export class OnDestroyDirective implements OnDestroy {
	@Input()
	appOnDestroy?: () => void;

	constructor() {}

	ngOnDestroy(): void {
		this.appOnDestroy?.();
	}
}
