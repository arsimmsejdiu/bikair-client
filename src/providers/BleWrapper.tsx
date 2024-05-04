import {useAppSelector} from "@hooks/index";
import BleProvider from "@providers/BleProvider";
import BleProviderV2 from "@providers/BleProviderV2";



const BleWrapper = ({children}: { children: React.ReactNode; }) => {
    // const functionalities = useAppSelector(state => state.auth.functionalities);
    
    // if(functionalities?.functionalities?.includes("BLE_PROVIDER_V2")){
    //     console.log("Using new file for BLE-PROVIDER");
    return <BleProviderV2>{children}</BleProviderV2>;
    // }else{
    //     console.log("Using Old version of BLE Provider");
    //     return <BleProvider>{children}</BleProvider>;
    // }
};

export default BleWrapper;
