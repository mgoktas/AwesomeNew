import RNFetchBlob from "rn-fetch-blob";
import {Constants, Platform} from 'react-native'
import { API_URL } from "../Data";

export const putImage = async (file, email) => {


    const customBlobName = email
     
    const sasContainerUri = 'https://csb10032003198f8088.blob.core.windows.net/avatarcontainer'

    const sasToken =
      "sp=racwdli&st=2023-11-22T07:56:50Z&se=2025-11-22T15:56:50Z&sip=0.0.0.0-255.255.255.255&sv=2022-11-02&sr=c&sig=rL0Kq4gM7ozXwnva2EYIKgY78k9WdPWgu1I4SBt7QOk%3D"; // you may need to play with other html verbs in this string e.g., `sp`, `ss` e.t.c.
    
    const localUri = file.uri.replace('file://', '')
    
    const assetPath = `${sasContainerUri}/${customBlobName}`;
    
        try {
          await RNFetchBlob.fetch(
            "PUT",
            `${assetPath}?${sasToken}`,
            {
              "x-ms-blob-type": "BlockBlob",
              "content-type": "application/octet-stream",
              "x-ms-blob-content-type": file.type
            },
            RNFetchBlob.wrap(localUri)
          );
        } catch (e) {
        }

}

// export const setPasswordToServer = async (
//   email: any, password: any
// ) => {
//   try{
//     const response = await fetch(`${API_URL}/set-password?email=${email}&password=${password}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

    

//     console.log('resuaslt',await response.json())
//   }
//   catch(err){
//     console.log('err:e ')
//     console.log('err:e ',err)
//   }

// }

// export const updatePasswordToServer = async (
//   email: any, password: any
// ) => {
//   try{
//     const response = await fetch(`${API_URL}/get-password`, {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: email,
//         password: password,
//       }),
//     });

//     const {result} = await response.json()

//     console.log('result',result)
//   }
//   catch(err){
//     console.log('err: ')
//     console.log('err: ',err)
//   }

// }

// export const getPasswordFromServer = async (
//   email: any
// ) => {
//   try{
//     const response = await fetch(`${API_URL}/get-password`, {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: email,
//       }),
//     });

//     const {result} = await response.json()

//     console.log('result',result)
//   }
//   catch(err){
//     console.log('err: ')
//     console.log('err: ',err)
//   }

// }