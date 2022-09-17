import { Component, Input, OnInit } from '@angular/core';
import { Appearance } from 'src/app/enums/appearance';
import { AppearanceService } from 'src/app/services/appearance.service';

@Component({
	selector: 'app-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
	@Input()
	text!: string;
	appearance: Appearance;

	constructor(private appearanceService: AppearanceService) {
		this.appearance = appearanceService.get();
	}

	ngOnInit(): void {
		this.appearanceService.subscribe((appearance) => (this.appearance = appearance));
	}
}
