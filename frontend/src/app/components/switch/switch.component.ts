import { Component, Input, OnInit } from '@angular/core';
import { Appearance } from 'src/app/enums/appearance';
import { AppearanceService } from 'src/app/services/appearance.service';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'app-switch',
	templateUrl: './switch.component.html',
	styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent implements OnInit {
	@Input()
	subject!: BehaviorSubject<boolean>;
	appearance: Appearance;
	mode: string;

	constructor(private appearanceService: AppearanceService) {
		this.appearance = appearanceService.get();
		this.mode = this.resolveMode(false);
	}

	ngOnInit(): void {
		this.appearanceService.subscribe((appearance) => (this.appearance = appearance));
		this.subject.subscribe((value) => {
			this.mode = this.resolveMode(value);
		});
	}

	toggle(): void {
		const toggledValue: boolean = !this.subject.getValue();
		this.subject.next(toggledValue);
	}

	private resolveMode(value: boolean): string {
		return value ? 'on' : 'off';
	}
}
