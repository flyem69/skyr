import { Component, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { Appearance } from 'src/app/enums/appearance';
import { StreamData } from 'src/app/models/stream-data';
import { AppearanceService } from 'src/app/services/appearance.service';
import { ViewedStreamService } from 'src/app/services/viewed-stream.service';

@Component({
	selector: 'app-stream-card',
	templateUrl: './stream-card.component.html',
	styleUrls: ['./stream-card.component.scss'],
})
export class StreamCardComponent implements OnInit {
	@Input()
	streamData!: StreamData;
	previewed: boolean;
	appearance: Appearance;

	constructor(
		private viewedStreamService: ViewedStreamService,
		private appearanceService: AppearanceService
	) {
		this.previewed = false;
		this.appearance = appearanceService.get();
	}

	ngOnInit(): void {
		this.appearanceService.subscribe((appearance) => (this.appearance = appearance));
	}

	preview(preview: HTMLVideoElement): () => void {
		return () => {
			this.viewedStreamService
				.preview(this.streamData.socketId)
				.pipe(finalize(() => console.log('DONE')))
				.subscribe((stream) => {
					preview.srcObject = stream;
				});
		};
	}

	closePreview(): () => void {
		return () => {
			this.viewedStreamService.closePreview(this.streamData.socketId);
		};
	}
}
