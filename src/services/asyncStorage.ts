import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (key: string, value: string) => {
    try {
        // if(value && value.length > 500) {
        //     console.log(`-- STORE --- ${key} => too long...`);
        // } else {
        //     console.log(`-- STORE --- ${key} => ${value}`);
        // }
        await AsyncStorage.setItem(key, value);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

const loadData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        // if(value && value.length > 500) {
        //     console.log(`-- LOAD --- ${key} => too long...`);
        // } else {
        //     console.log(`-- LOAD --- ${key} => ${value}`);
        // }
        if (value !== null) {
            // value previously stored
            return value;
        }
        return null;
    } catch (e) {
        console.log(e);
        // error reading value
    }
};

const removeValue = async (key: string) => {
    try {
        // console.log(`-- REMOVE --- ${key} `);
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.log(e);
    }
};

export {
    storeData,
    loadData,
    removeValue
};
