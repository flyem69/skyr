import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StreamData } from 'src/app/models/stream-data';

@Component({
	selector: 'app-stream-card',
	templateUrl: './stream-card.component.html',
	styleUrls: ['./stream-card.component.scss'],
})
export class StreamCardComponent implements OnInit {
	@Input() streamData!: StreamData;
	preview$: BehaviorSubject<boolean>;

	constructor() {
		this.preview$ = new BehaviorSubject<boolean>(false);
	}

	ngOnInit(): void {}

	enterPreview(): void {
		this.preview$.next(true);
	}

	leavePreview(): void {
		this.preview$.next(false);
	}

	afterPreviewInit(preview: HTMLVideoElement): void {
		preview.src = 'https://www.w3schools.com/html/mov_bbb.mp4#t=0.5';
	}
}
