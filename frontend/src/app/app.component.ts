import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Appearance } from './enums/appearance';
import { AppearanceService } from './services/appearance.service';
import { ModalService } from './services/modal.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
	@ViewChild('modalContainer', { read: ViewContainerRef })
	private modalContainer!: ViewContainerRef;
	appearance: Appearance;

	constructor(private modalService: ModalService, private appearanceService: AppearanceService) {
		this.appearance = appearanceService.get();
	}

	ngOnInit(): void {
		this.appearanceService.subscribe((appearance) => (this.appearance = appearance));
	}

	ngAfterViewInit(): void {
		this.modalService.subscribe((modal) => {
			if (modal != null) {
				this.modalContainer.createComponent(modal);
			} else {
				this.modalContainer.clear();
			}
		});
	}
}
