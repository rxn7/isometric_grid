export class Texture {
    constructor(path, onLoad) {
        this.isLoaded = false;
        this.IsLoaded = () => this.isLoaded;
        this.image = new Image();
        this.image.onload = () => {
            this.isLoaded = true;
            if (onLoad)
                onLoad();
        };
        this.image.src = path;
    }
}
