import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, finalize, mergeMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { StreamService } from 'src/app/services/stream.service';

@Component({
	selector: 'app-stream',
	templateUrl: './stream.component.html',
	styleUrls: ['./stream.component.scss'],
})
export class StreamComponent implements OnInit, OnDestroy {
	@ViewChild('player') private player!: ElementRef<HTMLVideoElement>;
	private streamSubscription$?: Subscription;

	constructor(private route: ActivatedRoute, private streamService: StreamService) {}

	ngOnInit(): void {
		let socketId: string;
		this.streamSubscription$ = this.route.params
			.pipe(
				mergeMap((params) => {
					socketId = params['id'];
					return this.streamService.join(socketId);
				}),
				finalize(() => this.streamService.leave(socketId))
			)
			.subscribe((stream) => {
				this.player.nativeElement.srcObject = stream;
			});
	}

	ngOnDestroy(): void {
		if (this.streamSubscription$ !== undefined) {
			this.streamSubscription$.unsubscribe();
		}
	}
}
