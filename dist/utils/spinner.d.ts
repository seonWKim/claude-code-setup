import { Ora } from 'ora';
export declare const spinner: {
    start: (message: string) => Ora;
    succeed: (message?: string) => void;
    fail: (message?: string) => void;
    warn: (message?: string) => void;
    info: (message?: string) => void;
    stop: () => void;
    text: (message: string) => void;
};
export default spinner;
//# sourceMappingURL=spinner.d.ts.map