enum State {
	EMPTY,
	INITIATED,
	PREVIEW,
	VIEW,
}

export class ViewedStream {
	static readonly State = State;

	private state: State;
	private stream: MediaStream | null;

	constructor() {
		this.state = State.EMPTY;
		this.stream = null;
	}

	initiate(): void {
		if (this.state !== State.EMPTY) {
			throw 'Error when initiating stream view';
		}
		this.state = State.INITIATED;
	}

	setPreview(stream: MediaStream): void {
		if (this.state !== State.INITIATED) {
			throw 'Error when setting stream preview';
		}
		this.stream = stream;
		this.state = State.PREVIEW;
	}

	setView(stream: MediaStream): void {
		if (this.state !== State.INITIATED) {
			throw 'Error when setting stream view';
		}
		this.stream = stream;
		this.state = State.VIEW;
	}

	empty(): void {
		this.stream = null;
		this.state = State.EMPTY;
	}

	isEmpty(): boolean {
		return this.state === State.EMPTY;
	}

	isInitiated(): boolean {
		return this.state === State.INITIATED;
	}

	getState(): State {
		return this.state;
	}
}
