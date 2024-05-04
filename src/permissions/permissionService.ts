import {check, Permission, request} from "react-native-permissions";
export const requestPermission = async (permission: Permission) => {
    let perm = await check(permission);
    if (perm === "denied") {
        perm = await request(permission);
        if (perm === "blocked" || perm === "denied") {
            console.log(`Permission ${permission} is ${perm}`);
            return false;
        }
    } else if (perm === "blocked") {
        console.log(`Permission ${permission} is ${perm}`);
        return false;
    }
    console.log(`Permission ${permission} is ${perm}`);
    return true;
};


