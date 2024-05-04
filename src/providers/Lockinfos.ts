import { Ekey } from "@models/dto/Ekey";
import { loadData, removeValue, storeData } from "@services/asyncStorage";
import { instanceApi } from "@services/axiosInterceptor";
import { GET_KEYSAFE_OTP_BY_ID } from "@services/endPoint";

class LockInfos {
    public serviceUUID: any;
    public characteristicUUID: any;
    public stateUUID: any;
    public bikeId: number | null;

    constructor(bikeid: number | null) {
        this.bikeId = bikeid;
    }

    private async setNewServiceUUID(serviceUUID: string | null) {
        if (!serviceUUID) {
            await removeValue("@serviceUUID");
            this.serviceUUID = null;
        } else {
            await storeData("@serviceUUID", serviceUUID);
            this.serviceUUID = serviceUUID;
        }
    }

    private async getServiceUUID() {
        if (!this.serviceUUID) {
            const localStorageServiceUUID = await loadData("@serviceUUID");
            const newServiceUUID = localStorageServiceUUID ?? null;
            this.serviceUUID = newServiceUUID;
            return newServiceUUID;
        }
        return this.serviceUUID;
    }

    private async setNewCharacteristicUUID(characteristicUUID: string | null) {
        if (!characteristicUUID) {
            await removeValue("@characteristicUUID");
            this.characteristicUUID = null;
        } else {
            await storeData("@characteristicUUID", characteristicUUID);
            this.characteristicUUID = characteristicUUID;
        }
    }

    private async getCharacteristicUUID() {
        if (!this.characteristicUUID) {
            const localStorageCharacteristicUUID = await loadData("@characteristicUUID");
            const newCharacteristicUUID = localStorageCharacteristicUUID ?? null;
            this.characteristicUUID = newCharacteristicUUID;
            return newCharacteristicUUID;
        }
        return this.characteristicUUID;
    }

    private async setNewStateUUID(stateUUID: string | null) {
        if (!stateUUID) {
            await removeValue("@stateUUID");
            this.stateUUID = null;
        } else {
            await storeData("@stateUUID", stateUUID);
            this.stateUUID = stateUUID;
        }
    }

    private async getStateUUID() {
        if (!this.stateUUID) {
            const localStorageStateUUID = await loadData("@stateUUID");
            const newStateUUID = localStorageStateUUID ?? null;
            this.setNewStateUUID(newStateUUID);
            this.stateUUID = newStateUUID;
            return newStateUUID;
        }
        return this.stateUUID;
    }

    public async setLockInfo() {
        const lockKeysString = await loadData("@lockKeys");
        const lockKeys = !lockKeysString ? { passKey: [] } : JSON.parse(lockKeysString);
        const serviceUUID = await this.getServiceUUID();
        const characteristicUUID = await this.getCharacteristicUUID();
        const stateUUID = await this.getStateUUID();

        const missingLockKey = !lockKeys || lockKeys.passKey.length === 0 || typeof lockKeys.passKey[0] === "undefined" || typeof lockKeys.eKey === "undefined";
        const missingUUID = !serviceUUID || !characteristicUUID || !stateUUID;
        if ((missingLockKey || missingUUID) && this.bikeId) {
            const otpResponse = await instanceApi.get<Ekey>(GET_KEYSAFE_OTP_BY_ID(this.bikeId));
            const data = otpResponse.data;

            await this.setNewServiceUUID(data.serviceUUID);
            await this.setNewCharacteristicUUID(data.characteristicUUID);
            await this.setNewStateUUID(data.stateUUID);

            const eKey = data.eKey;
            const passKey = data.passKey;

            await storeData("@lockKeys", JSON.stringify({
                eKey: eKey,
                passKey: passKey,
            }));
        } else {
            console.log("[setLockInfo] no missing info");
        }
    }
}


export default LockInfos;
