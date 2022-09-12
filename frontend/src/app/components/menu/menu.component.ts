import { Component, OnInit } from '@angular/core';
import { Appearance } from 'src/app/enums/appearance';
import { AppearanceService } from 'src/app/services/appearance.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
	appearance: Appearance;

	constructor(private appearanceService: AppearanceService) {
		this.appearance = appearanceService.get();
	}

	ngOnInit(): void {
		this.appearanceService.subscribe((appearance) => (this.appearance = appearance));
	}
}
