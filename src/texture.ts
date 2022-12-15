export class Texture {
	public image: HTMLImageElement
	private isLoaded: boolean = false

	constructor(path: string, onLoad?: () => void) {
		this.image = new Image()

		this.image.onload = () => {
			this.isLoaded = true
			if (onLoad) onLoad()
		}

		this.image.src = path
	}

	public IsLoaded = (): boolean => this.isLoaded
}
