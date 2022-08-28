// THIS FILE LOCATION IS IMPORTANT
import path from "path";

export class Properties {
	public static readonly SERVER_PORT: number = 443;
	public static readonly ROOT_PATH: string = this.resolveRootPath();
	public static readonly FRONTEND_BUILD_PATH: string = this.resolveFrontendBuildPath(this.ROOT_PATH);

	private static resolveRootPath(): string {
		const currentPath = __dirname;
		const currentDirs = currentPath.split(path.sep);
		const rootDirs = currentDirs.slice(0, -2);
		return rootDirs.join(path.sep);
	}

	private static resolveFrontendBuildPath(rootPath: string): string {
		return rootPath + '/frontend/build';
	}
}
