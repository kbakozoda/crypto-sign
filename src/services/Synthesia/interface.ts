import { ISynthesiaActionResult } from ".";

export interface ISynthesiaService {
    getSignature(message: string): Promise<ISynthesiaActionResult>;
    verifySignature(message: string, signature: string): Promise<ISynthesiaActionResult>;
}
