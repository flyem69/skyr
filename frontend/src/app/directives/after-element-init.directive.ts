import { AfterViewInit, Directive, Input } from '@angular/core';

@Directive({
	selector: '[appAfterViewInit]',
})
export class AfterViewInitDirective implements AfterViewInit {
	@Input()
	appAfterViewInit?: () => void;

	constructor() {}

	ngAfterViewInit(): void {
		this.appAfterViewInit?.();
	}
}
