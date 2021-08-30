export interface ICryptoService {
    signMessage(message: string, userId: string): Promise<any>;
    passFailedMessageToRetryManager(message: string, userId: string): Promise<any>;
};
