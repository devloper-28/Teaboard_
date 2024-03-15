import axios from "axios";
import CustomToast from "../../components/Toast";

const axiosMain = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_END_POINT_URL_DEV
      : process.env.REACT_APP_END_POINT_URL_PROD,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${atob(sessionStorage.getItem("argument1"))}`,
    Userid: sessionStorage.getItem("argument2")
      ? atob(sessionStorage.getItem("argument2"))
      : 0,
    // Rolecode: atob(sessionStorage.getItem("argument6")),
    Trackloginid: sessionStorage.getItem("argument7")
      ? atob(sessionStorage.getItem("argument7"))
      : 0,
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
          // CustomToast.error("No Data Found", {
          //   position: CustomToast.POSITION.TOP_RIGHT,
          // });
          // Show toast notification for 400 error
          // Do not render any component directly, as it might cause errors
          break;
        case 404:
          // CustomToast.error("404 Not Found", {
          //   position: CustomToast.POSITION.TOP_RIGHT,
          // });
          break;
        case 500:
          // Show toast notification for 500 error
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

export default axiosMain;
