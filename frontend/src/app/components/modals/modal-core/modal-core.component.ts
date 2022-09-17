import { Component, OnInit } from '@angular/core';
import { Appearance } from 'src/app/enums/appearance';
import { AppearanceService } from 'src/app/services/appearance.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
	selector: 'app-modal-core',
	templateUrl: './modal-core.component.html',
	styleUrls: ['./modal-core.component.scss'],
})
export class ModalCoreComponent implements OnInit {
	appearance: Appearance;

	constructor(public modalService: ModalService, private appearanceService: AppearanceService) {
		this.appearance = appearanceService.get();
	}

	ngOnInit(): void {
		this.appearanceService.subscribe((appearance) => (this.appearance = appearance));
	}
}
