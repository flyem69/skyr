import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { Injectable, Type } from '@angular/core';
import { Modal } from '../enums/modal';
import { StreamTitleModalComponent } from '../components/modals/stream-title-modal/stream-title-modal.component';

@Injectable({
	providedIn: 'root',
})
export class ModalService {
	private currentModal$: BehaviorSubject<Type<any> | null>;
	private modalResult$: BehaviorSubject<any> | null;

	constructor() {
		this.currentModal$ = new BehaviorSubject<Type<any> | null>(null);
		this.modalResult$ = null;
	}

	open(modalType: Modal): Promise<any> {
		this.modalResult$ = new BehaviorSubject<any>(null);
		this.currentModal$.next(this.map(modalType));
		return lastValueFrom(this.modalResult$);
	}

	setResult(result: any): void {
		this.modalResult$?.next(result);
	}

	close(): void {
		this.currentModal$.next(null);
		this.modalResult$?.next(null);
		this.modalResult$?.complete();
	}

	finish(): void {
		this.currentModal$.next(null);
		this.modalResult$?.complete();
	}

	setResultAndFinish(result: any): void {
		this.setResult(result);
		this.finish();
	}

	subscribe(onModalChange: (currentModal: Type<any> | null) => void): void {
		this.currentModal$.subscribe(onModalChange);
	}

	private map(modalType: Modal): Type<any> {
		switch (modalType) {
			case Modal.STREAM_TITLE:
				return StreamTitleModalComponent;
		}
	}
}
