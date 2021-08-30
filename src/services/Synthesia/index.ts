import { ISynthesiaService } from "./interface";
import axios from "axios";
import config from "../../config/env/index";

const REQUEST_TIMEOUT_MS = 1500;
const REQUEST_OPTIONS = {
    timeout: REQUEST_TIMEOUT_MS,
    headers: {
        "Authorization": "6e283f4c54309ccd008f87e478ad7553"
    }
};

export interface ISynthesiaActionResult {
    success: boolean;
    data?: string;
}; 

const SynthesiaService: ISynthesiaService = {
    async getSignature(message: string): Promise<ISynthesiaActionResult> {
        console.log("SYNTHESIA: signging a message", message);
        try {
            const response = await axios.get(`${config.synthesiaBase}/sign?message=${message}`, REQUEST_OPTIONS);
            const result: ISynthesiaActionResult = {
                success: true,
                data: response.data
            };

            return result;
        } catch(err) {
            console.log("SYNTHESIA: signing error:", err.response.data);
            const result: ISynthesiaActionResult = {
                success: false
            };

            return result;
        }
    },

    async verifySignature(message: string, signature: string): Promise<ISynthesiaActionResult> {
        console.log("SYNTHESIA: verifying signature msg & signature =", message, signature);
        try {
            const response = await axios.get(`${config.synthesiaBase}/verify?message=${message}&signature=${signature}`, REQUEST_OPTIONS);
            const result: ISynthesiaActionResult = {
                success: true
            };
            console.log("synthesia verification result:", response.data);

            return result;
        } catch(err) {
            console.log("SYNTHESIA: verification response status", err.response.status);
            console.log("SYNTHESIA: verification error:", err.response.data);

            // NOTE: bug - in case of 429 we assume that the signature verification failed
            const result: ISynthesiaActionResult = {
                success: false
            };

            return result;
        }        
    }
}

export default SynthesiaService;
