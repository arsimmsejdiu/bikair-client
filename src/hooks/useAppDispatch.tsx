import {AppDispatch} from "@redux/store";
import {useDispatch} from "react-redux";

export const useAppDispatch = (): any => useDispatch<AppDispatch>();
