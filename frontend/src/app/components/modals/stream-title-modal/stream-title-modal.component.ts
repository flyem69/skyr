import { BehaviorSubject } from 'rxjs';
import { Component } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
	selector: 'app-stream-title-modal',
	templateUrl: './stream-title-modal.component.html',
	styleUrls: ['./stream-title-modal.component.scss'],
})
export class StreamTitleModalComponent {
	title$: BehaviorSubject<string>;
	titleInputWidth$: BehaviorSubject<string>;

	constructor(private modalService: ModalService) {
		this.title$ = new BehaviorSubject<string>('');
		this.titleInputWidth$ = new BehaviorSubject<string>('200px');
	}

	cancel(): void {
		this.modalService.close();
	}

	apply(): void {
		this.modalService.setResultAndFinish(this.title$.getValue());
	}
}
