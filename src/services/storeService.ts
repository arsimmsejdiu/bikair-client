import {EndPhotoData} from "@models/data/EndPhotoData";
import axios from "axios";
import RNFS from "react-native-fs";

import {loadData, removeValue, storeData} from "./asyncStorage";
import { instanceApi } from "./axiosInterceptor";
import {CREATE_SIGNED_URL, PUT_TRIP_END_PHOTO} from "./endPoint";
import {
    PostSaveTripPhotoInput,
    PostSaveTripPhotoOutput,
    PreSignedUrlInput,
    PreSignedUrlOutput
} from "@bikairproject/shared";

let savingPhoto = false;

export const saveEndPhoto = async () => {
    let photoSaved = false;
    if (!savingPhoto) {
        console.log("--- SAVING PHOTO ---");
        try {
            savingPhoto = true;
            const endPhotoSaved = await saveEndPhotoToS3("@fileEndPhoto", false, "EndTrip");
            photoSaved = endPhotoSaved;
            const lockPhotoSaved = await saveEndPhotoToS3("@fileLockPhoto", true, "Validation");
            photoSaved = endPhotoSaved || lockPhotoSaved;
        } catch (error) {
            console.log("Error while saving photo : ", error);
            throw error;
        } finally {
            savingPhoto = false;
            console.log("--- PHOTO SAVED ---");
        }
        return photoSaved;
    }
};

const saveEndPhotoToS3 = async (storeKey: string, validation = false, tag?: string | null) => {
    const dataString = await loadData(storeKey);
    if (dataString) {
        const fileData = JSON.parse(dataString) as EndPhotoData;
        console.log(fileData);
        const fileExist = await RNFS.exists(fileData.path);
        if(fileExist) {
            const postEndPhotoOutput: PreSignedUrlInput = {
                bucket_name: "end-trip-photo", // S3 bucket name here (DO NOT USE '/' IN THE NAME)
                type: "image/jpg",
                tags: {
                    trip_uuid: fileData?.trip ?? "Unknown",
                    bike_name: fileData?.bike ?? "Unknown",
                    info: tag ?? "Unknown"
                }
            };
            const presignedResponse = await instanceApi.post<PreSignedUrlOutput>(CREATE_SIGNED_URL, postEndPhotoOutput);
            const {data} = presignedResponse;
            const fileName = data.fields["key"];
            console.log("fileName = ", fileName);
            if (fileName) {
                fileData.fileName = fileName;
                await uploadToS3Bucket(data.fields, fileData.path, data.url);
                await storeData("@fileName" + storeKey, JSON.stringify(fileData));
                await removeValue(storeKey);
            }
        } else {
            console.log("This file doesn't exist : ", fileData.path);
            await removeValue(storeKey);
        }
    } else {
        console.log("No data file");
    }
    const fileNameString = await loadData("@fileName" + storeKey);
    if (fileNameString) {
        const fileName = JSON.parse(fileNameString) as EndPhotoData;
        const postSaveTripPhotoInput: PostSaveTripPhotoInput = {
            fileName: fileName.fileName,
            trip: fileName.trip,
            bike: fileName.bike,
            lat: fileName.lat,
            lng: fileName.lng,
            validation: validation,
        };
        await instanceApi.put<PostSaveTripPhotoOutput>(PUT_TRIP_END_PHOTO, postSaveTripPhotoInput);
        await removeValue("@fileName" + storeKey);
        return true;
    } else {
        console.log("No File Name");
    }
    return false;
};


export const uploadToS3Bucket = async (fields: { [key: string]: string }, path: string, url: string) => {
    console.log("Uploading file to aws s3 bucket....");

    const formData = new FormData();
    Object.keys(fields).forEach(key => {
        formData.append(key, fields[key]);
    });
    formData.append("file",
        JSON.parse(JSON.stringify({uri: path, type: fields["Content-Type"] ?? "image/jpeg", name: fields["key"] ?? "Unknown"}))
    );

    try {
        await axios.post(url,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            }
        );
        console.log("Uploaded to s3 succesful !");
    } catch (error: any) {
        console.log("uploadToS3Bucket error : ", error);
        console.log("uploadToS3Bucket error : ", error.message);
        console.log("uploadToS3Bucket error : ", JSON.stringify(error.response));
    }
};
