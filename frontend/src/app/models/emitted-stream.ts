enum State {
	EMPTY,
	INITIATED,
	EMITTING,
}

export class EmittedStream {
	static readonly State = State;

	private state: State;
	private stream: MediaStream | null;

	constructor() {
		this.state = State.EMPTY;
		this.stream = null;
	}

	initiate(): void {
		if (this.state !== State.EMPTY) {
			throw 'Error when initiating stream emission';
		}
		this.state = State.INITIATED;
	}

	set(stream: MediaStream) {
		if (this.state !== State.INITIATED) {
			throw 'Error when setting stream to emit';
		}
		this.stream = stream;
		this.state = State.EMITTING;
	}

	empty(): void {
		this.stream = null;
		this.state = State.EMPTY;
	}

	get(): MediaStream | null {
		return this.stream;
	}

	getNonNull(): MediaStream {
		if (this.stream === null) {
			throw 'error';
		}
		return this.stream;
	}

	isEmpty(): boolean {
		return this.state === State.EMPTY;
	}
}
