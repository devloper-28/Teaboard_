import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomToast = {
  success: (
    message,
    options = { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 }
  ) => {
    toast.success(message, options);
  },
  error: (
    message,
    options = { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 }
  ) => {
    toast.error(message, options);
  },
  warning: (
    message,
    options = { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 }
  ) => {
    toast.warn(message, options);
  },
  info: (
    message,
    options = { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 }
  ) => {
    toast.info(message, options);
  },
};

export default CustomToast;
