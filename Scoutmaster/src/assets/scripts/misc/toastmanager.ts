import { Bounce, toast } from "react-toastify";

export function successToast(message: string, time: number) {
    toast.success(message, {
        position: "bottom-right",
        autoClose: time,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    });
}

export function errorToast(message: string, time: number) {
    toast.error(message, {
        position: "bottom-right",
        autoClose: time,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    });
}
