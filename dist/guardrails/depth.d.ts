import type { SaveMyTokensConfig } from '../config/schema.js';
export declare function validateDependencyDepth(depth: number, config: SaveMyTokensConfig): {
    allowed: boolean;
    code?: undefined;
    message?: undefined;
} | {
    allowed: boolean;
    code: "DEPENDENCY_DEPTH_TOO_HIGH";
    message: string;
};
