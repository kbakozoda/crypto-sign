export interface ICryptoService {
    signMessage(message: string): Promise<void>;
};
