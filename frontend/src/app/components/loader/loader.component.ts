import { Component, OnInit } from '@angular/core';
import { Appearance } from 'src/app/enums/appearance';
import { AppearanceService } from 'src/app/services/appearance.service';

@Component({
	selector: 'app-loader',
	templateUrl: './loader.component.html',
	styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
	appearance: Appearance;

	constructor(private appearanceService: AppearanceService) {
		this.appearance = appearanceService.get();
	}

	ngOnInit(): void {
		this.appearanceService.subscribe((appearance) => (this.appearance = appearance));
	}
}
