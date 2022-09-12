import { AfterViewInit, Component, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Appearance } from 'src/app/enums/appearance';
import { AppearanceService } from 'src/app/services/appearance.service';
import { DefaultModalComponent } from '../default-modal/default-modal.component';
import { ModalService } from 'src/app/services/modal.service';

@Component({
	selector: 'app-modal-core',
	templateUrl: './modal-core.component.html',
	styleUrls: ['./modal-core.component.scss'],
})
export class ModalCoreComponent implements OnInit, AfterViewInit {
	private modal: Type<any>;
	@ViewChild('content', { read: ViewContainerRef })
	private modalContainer!: ViewContainerRef;
	appearance: Appearance;

	constructor(public modalService: ModalService, private appearanceService: AppearanceService) {
		this.modal = modalService.getCurrentModal() ?? DefaultModalComponent;
		this.appearance = appearanceService.get();
	}

	ngOnInit(): void {
		this.appearanceService.subscribe((appearance) => (this.appearance = appearance));
	}

	ngAfterViewInit(): void {
		this.modalContainer.createComponent(this.modal);
	}
}
