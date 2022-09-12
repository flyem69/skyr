import { Component, OnInit } from '@angular/core';
import { Appearance } from './enums/appearance';
import { AppearanceService } from './services/appearance.service';
import { ModalService } from './services/modal.service';
import { ModalType } from './enums/modal-type';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	modalEnabled: boolean;
	appearance: Appearance;

	constructor(private modalService: ModalService, private appearanceService: AppearanceService) {
		this.modalEnabled = false;
		this.appearance = appearanceService.get();
	}

	ngOnInit(): void {
		this.modalService.subscribe((modalType) => (this.modalEnabled = modalType != null));
		this.appearanceService.subscribe((appearance) => (this.appearance = appearance));
	}
}
