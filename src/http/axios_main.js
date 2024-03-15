import axios from "axios";
import CustomToast from "../../components/Toast";
import CryptoJS from "crypto-js";

const secretKey = "08090a0b0c0d0e0f"; // Same secret key used for encryption/decryption
const IV_KEY = "18191a1b1c1d1e1f"; // IV key

const axiosMain = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_END_POINT_URL_DEV
      : process.env.REACT_APP_END_POINT_URL_PROD,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${atob(sessionStorage.getItem("argument1"))}`,
    Userid: atob(sessionStorage.getItem("argument2")),
    Trackloginid:
      sessionStorage.getItem("argument7") &&
      atob(sessionStorage.getItem("argument7")),
  },
});

axiosMain.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const data = error.response.data;
      const previewStatusCode = data.statusCode;
      const status = error.response.status;
      const status1 = error.response;
      console.log(status1, data, previewStatusCode, "abc");

      if ("401" == (data && data.statusCode)) {
        CustomToast.error(data && data.message);
        sessionStorage.removeItem("argument1");
        sessionStorage.removeItem("argument2");
        sessionStorage.removeItem("argument3");
        sessionStorage.removeItem("argument4");
        sessionStorage.removeItem("argument5");
        sessionStorage.removeItem("argument6");
        sessionStorage.removeItem("argument7");
        window.location.reload();
        return;
      }

      switch (status) {
        case 400:
          console.log("network error");
          break;
        case 404:
          break;
        case 500:
          CustomToast.error("500 Internal Server Error", {
            position: CustomToast.POSITION.TOP_RIGHT,
          });
          break;
        case 200:
          if (previewStatusCode === 204) {
            CustomToast.error("No Data Found", {
              position: CustomToast.POSITION.TOP_RIGHT,
            });
          }
          break;
        default:
          console.log(status1, data, previewStatusCode, "abc");
      }
    }
    return Promise.reject(error);
  }
);

const encryptData = (data) => {
  try {
    // Convert the data to string if it's not already a string
    const stringData = typeof data === "string" ? data : JSON.stringify(data);

    // Parse the secret key and IV key
    const key = CryptoJS.enc.Utf8.parse(secretKey);
    const iv = CryptoJS.enc.Utf8.parse(IV_KEY);

    // Encrypt the data using AES encryption
    const encryptedValue = CryptoJS.AES.encrypt(stringData, key, {
      iv: iv,
    }).ciphertext.toString(CryptoJS.enc.Base64);

    return encryptedValue;
  } catch (error) {
    console.error("Error encrypting data:", error);
    return null;
  }
};

// const decryptObject = (encryptedObject) => {
//   const decryptedObject = {};
//   try {
//     for (const key in encryptedObject) {
//       const encryptedValue = encryptedObject[key];
//       const decryptedValue = CryptoJS.AES.decrypt(encryptedValue, secretKey, {
//         iv: CryptoJS.enc.Hex.parse(IV_KEY),
//       }).toString(CryptoJS.enc.Utf8);
//       decryptedObject[key] = decryptedValue;
//     }
//   } catch (error) {
//     console.error("Error decrypting object:", error);
//   }
//   return decryptedObject;
// };

// const decryptData = (encryptedData) => {
//   try {
//     // Check if encryptedData is an array
//     if (Array.isArray(encryptedData)) {
//       // If encryptedData is an array, decrypt each object in the array
//       return encryptedData.map((encryptedObject) =>
//         decryptObject(encryptedObject)
//       );
//     } else {
//       // If encryptedData is a single object, decrypt it directly
//       return decryptObject(encryptedData);
//     }
//   } catch (error) {
//     console.error("Error decrypting data:", error);
//     return null;
//   }
// };

axiosMain.interceptors.request.use(
  (config) => {
    if (config.data) {
      config.data = encryptData(config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axiosMain.interceptors.response.use(
//   (response) => {
//     // Check if the response data is encrypted
//     if (
//       response.data &&
//       typeof response.data === "object" &&
//       Object.keys(response.data).length > 0
//     ) {
//       // Assuming if the first value of the response data object is encrypted, we consider it encrypted
//       const firstValue = response.data[Object.keys(response.data)[0]];
//       if (typeof firstValue === "string" && firstValue.length > 0) {
//         // Response data seems encrypted, proceed with decryption
//         response.data = decryptData(response.data);
//       }
//     }
//     return response;
//   },
//   (error) => {
//     console.error("Request error:", error);
//     return Promise.reject(error);
//   }
// );

export default axiosMain;

// Response Interceptor to handle common error codes
// axiosMain.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       const data = error.response.data;
//       const previewStatusCode = data.statusCode;
//       const status = error.response.status;
//       const status1 = error.response;
//       console.log(status1, data, previewStatusCode, "abc");

//       if (status === 400) {
//         console.log("network error");
//         // Show toast notification for 400 error
//         // CustomToast.error("Bad Request - Something went wrong with your request.", {
//         //   position: CustomToast.POSITION.TOP_RIGHT,
//         // });
//         // Do not render any component directly, as it might cause errors
//       }
//       //  else if (status === 404) {
//       //   CustomToast.error("No Data Found", {
//       //     position: CustomToast.POSITION.TOP_RIGHT,
//       //   });
//       // }
//       else if (status === 500) {
//         // Show toast notification for 500 error
//         CustomToast.error("500 Internal Server Error", {
//           position: CustomToast.POSITION.TOP_RIGHT,
//         });
//       } else if (status === 200 && previewStatusCode === 204) {
//         CustomToast.error("No Data Found", {
//           position: CustomToast.POSITION.TOP_RIGHT,
//         });
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// Render the toast container for displaying toast notifications

// const encryptData = (data) => {
//   try {
//       const encryptedData = {};
//       for (const key in data) {
//           let value = data[key];
//           // Convert non-string values to string before encryption
//           if (typeof value !== 'string') {
//               value = String(value);
//           }
//           const encryptedValue = CryptoJS.AES.encrypt(value, secretKey).toString();
//           encryptedData[key] = encryptedValue;
//       }
//       return encryptedData;
//   } catch (error) {
//       console.error('Error encrypting data:', error);
//       return null;
//   }
// };

// const decryptObject = (encryptedObject) => {
//   const decryptedObject = {};
//   try {
//     for (const key in encryptedObject) {
//       const encryptedValue = encryptedObject[key];
//       const decryptedValue = CryptoJS.AES.decrypt(encryptedValue, secretKey).toString(CryptoJS.enc.Utf8);
//       decryptedObject[key] = decryptedValue;
//     }
//   } catch (error) {
//     console.error('Error decrypting object:', error);
//     // You can choose to handle decryption errors for individual objects here
//   }
//   return decryptedObject;
// };

// const decryptData = (encryptedData) => {
//   try {
//     // Check if encryptedData is an array
//     if (Array.isArray(encryptedData)) {
//       // If encryptedData is an array, decrypt each object in the array
//       return encryptedData.map(encryptedObject => decryptObject(encryptedObject));
//     } else {
//       // If encryptedData is a single object, decrypt it directly
//       return decryptObject(encryptedData);
//     }
//   } catch (error) {
//     console.error('Error decrypting data:', error);
//     return null; // or handle decryption error accordingly
//   }
// };

// axiosMain.interceptors.request.use((config) => {
//   if (config.data) {
//       config.data = encryptData(config.data);
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });
// // const decryptObject = (encryptedObject) => {
// //   const decryptedObject = {};
// //   try {
// //     for (const key in encryptedObject) {
// //       const encryptedValue = encryptedObject[key];
// //       const decryptedValue = CryptoJS.AES.decrypt(encryptedValue, secretKey).toString(CryptoJS.enc.Utf8);
// //       decryptedObject[key] = decryptedValue;
// //     }
// //   } catch (error) {
// //     console.error('Error decrypting object:', error);
// //     // You can choose to handle decryption errors for individual objects here
// //   }
// //   return decryptedObject;
// // };
// // const decryptData = (encryptedData) => {
// //   try {
// //     // Check if encryptedData is an array
// //     if (Array.isArray(encryptedData)) {
// //       // If encryptedData is an array, decrypt each object in the array
// //       return encryptedData.map(encryptedObject => decryptObject(encryptedObject));
// //     } else {
// //       // If encryptedData is a single object, decrypt it directly
// //       return decryptObject(encryptedData);
// //     }
// //   } catch (error) {
// //     console.error('Error decrypting data:', error);
// //     return null; // or handle decryption error accordingly
// //   }
// // };

// // axiosMain.interceptors.response.use(
// //   (response) => {
// //       if (response.data) {
// //           response.data = decryptData(response.data);
// //       }
// //       return response;
// //   },
// //   (error) => {
// //       console.error("Request error:", error);
// //       return Promise.reject(error);
// //   }
// // );
// axiosMain.interceptors.response.use(
//   (response) => {
//       // Check if the response data is encrypted
//       if (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0) {
//           // Assuming if the first value of the response data object is encrypted, we consider it encrypted
//           const firstValue = response.data[Object.keys(response.data)[0]];
//           if (typeof firstValue === 'string' && firstValue.length > 0) {
//               // Response data seems encrypted, proceed with decryption
//               response.data = decryptData(response.data);
//           }
//       }
//       return response;
//   },
//   (error) => {
//       console.error("Request error:", error);
//       return Promise.reject(error);
//   }
// );

// export default axiosMain;

// old AXIOS MAIN0 ////////////////////////////////////////

// import axios from "axios";
// import CustomToast from "../../components/Toast";

// const axiosMain = axios.create({
//   baseURL:
//     process.env.NODE_ENV === "development"
//       ? process.env.REACT_APP_END_POINT_URL_DEV
//       : process.env.REACT_APP_END_POINT_URL_PROD,
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${atob(sessionStorage.getItem("argument1"))}`,
//     Userid: atob(sessionStorage.getItem("argument2")),
//     // Rolecode: atob(sessionStorage.getItem("argument6")),
//     Trackloginid:
//       sessionStorage.getItem("argument7") &&
//       atob(sessionStorage.getItem("argument7")),
//   },
// });
// axiosMain.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       const data = error.response.data;
//       const previewStatusCode = data.statusCode;
//       const status = error.response.status;
//       const status1 = error.response;
//       console.log(status1, data, previewStatusCode, "abc");

//       if ("401" == (data && data.statusCode)) {
//         CustomToast.error(data && data.message);
//         sessionStorage.removeItem("argument1");
//         sessionStorage.removeItem("argument2");
//         sessionStorage.removeItem("argument3");
//         sessionStorage.removeItem("argument4");
//         sessionStorage.removeItem("argument5");
//         sessionStorage.removeItem("argument6");
//         sessionStorage.removeItem("argument7");
//         window.location.reload();
//         return;
//       }

//       switch (status) {
//         case 400:
//           console.log("network error");
//           // CustomToast.error("No Data Found", {
//           //   position: CustomToast.POSITION.TOP_RIGHT,
//           // });
//           // Show toast notification for 400 error
//           // Do not render any component directly, as it might cause errors
//           break;
//         case 404:
//           // CustomToast.error("404 Not Found", {
//           //   position: CustomToast.POSITION.TOP_RIGHT,
//           // });
//           break;
//         case 500:
//           // Show toast notification for 500 error
//           CustomToast.error("500 Internal Server Error", {
//             position: CustomToast.POSITION.TOP_RIGHT,
//           });
//           break;
//         case 200:
//           if (previewStatusCode === 204) {
//             CustomToast.error("No Data Found", {
//               position: CustomToast.POSITION.TOP_RIGHT,
//             });
//           }
//           break;
//         default:
//           console.log(status1, data, previewStatusCode, "abc");
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // Response Interceptor to handle common error codes
// // axiosMain.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     if (error.response) {
// //       const data = error.response.data;
// //       const previewStatusCode = data.statusCode;
// //       const status = error.response.status;
// //       const status1 = error.response;
// //       console.log(status1, data, previewStatusCode, "abc");

// //       if (status === 400) {
// //         console.log("network error");
// //         // Show toast notification for 400 error
// //         // CustomToast.error("Bad Request - Something went wrong with your request.", {
// //         //   position: CustomToast.POSITION.TOP_RIGHT,
// //         // });
// //         // Do not render any component directly, as it might cause errors
// //       }
// //       //  else if (status === 404) {
// //       //   CustomToast.error("No Data Found", {
// //       //     position: CustomToast.POSITION.TOP_RIGHT,
// //       //   });
// //       // }
// //       else if (status === 500) {
// //         // Show toast notification for 500 error
// //         CustomToast.error("500 Internal Server Error", {
// //           position: CustomToast.POSITION.TOP_RIGHT,
// //         });
// //       } else if (status === 200 && previewStatusCode === 204) {
// //         CustomToast.error("No Data Found", {
// //           position: CustomToast.POSITION.TOP_RIGHT,
// //         });
// //       }
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// // Render the toast container for displaying toast notifications

// export default axiosMain;
