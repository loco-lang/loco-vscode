declare module 'mocha' {
    import Mocha = require('mocha');
    export = Mocha;
}

declare module 'glob' {
    function glob(
        pattern: string,
        options: { cwd?: string; sync?: boolean },
        cb: (err: Error | null, files: string[]) => void
    ): void;
    export = glob;
}
