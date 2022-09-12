import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { Injectable, Type } from '@angular/core';
import { DefaultModalComponent } from '../components/modals/default-modal/default-modal.component';
import { ModalType } from '../enums/modal-type';

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

	open(modalType: ModalType): Promise<any> {
		this.modalResult$ = new BehaviorSubject<any>(null);
		this.currentModal$.next(this.map(modalType));
		return lastValueFrom(this.modalResult$);
	}

	getCurrentModal(): Type<any> | null {
		return this.currentModal$.getValue();
	}

	setResult(result: any): void {
		this.modalResult$?.next(result);
	}

	close(): void {
		this.currentModal$.next(null);
		this.modalResult$?.complete();
	}

	subscribe(onModalChange: (currentModal: Type<any> | null) => void): void {
		this.currentModal$.subscribe(onModalChange);
	}

	private map(modalType: ModalType): Type<any> {
		switch (modalType) {
			case ModalType.DEFAULT:
				return DefaultModalComponent;
		}
	}
}
