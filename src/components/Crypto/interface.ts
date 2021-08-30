export interface ICryptoService {
    signMessage(message: string, userId: string): Promise<any>;
    getMessageSignatureForUser(message: string, userId: string): Promise<string>;
    passFailedMessageToRetryManager(message: string, userId: string): Promise<any>;
};
