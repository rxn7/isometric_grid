export namespace StringHelper {
	export function basename(path: string): string {
		return path.substring(path.lastIndexOf('/') + 1)
	}

	export function stripExtension(path: string): string {
		return path.substring(0, path.lastIndexOf('.'))
	}
}
