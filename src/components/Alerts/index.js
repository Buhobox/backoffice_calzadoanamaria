import { toast } from "react-toastify";
export const MSJPROMISE = (resolveAfter3Sec) => {
  toast.configure();
  toast.promise(resolveAfter3Sec, {
    pending: "Promise is pending",
    success: "Promise resolved 👌",
    error: "Promise rejected 🤯",
  });
};
