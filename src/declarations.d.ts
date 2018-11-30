declare module 'npm-install-package' {
    export interface Options {
        save?: boolean;
        saveDev?: boolean;
        cache?: boolean;
        silent?: boolean;
    }

    export default function install(dependencies: string[], options?: Options, cb?: (err?: Error) => any): void;
}

declare module 'install-packages' {
    export interface Options {
        packages?: string[];
        cwd?: string[];
        installPeers?: boolean;
        peerFilter?: (name: string, version: string) => boolean;
        saveDev?: boolean;
        packageManager?: 'npm' | 'yarn';
    }

    export default function install(options?: Options): Promise<void>;
}