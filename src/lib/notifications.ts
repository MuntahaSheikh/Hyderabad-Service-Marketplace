import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Premium custom styling for SweetAlert2 matching Hyderabad Service Marketplace theme
const customSwalClass = {
  popup: "rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl p-6 md:p-8 animate-fade-in",
  title: "font-display font-bold text-slate-800 dark:text-white text-xl md:text-2xl tracking-tight",
  htmlContainer: "font-sans text-slate-600 dark:text-slate-300 text-sm md:text-base mt-2 leading-relaxed",
  confirmButton: "px-6 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-medium rounded-xl transition-all duration-200 outline-none focus:ring-4 focus:ring-blue-500/20 text-sm md:text-base mx-2 shadow-sm font-sans hover:scale-[1.02]",
  cancelButton: "px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all duration-200 outline-none focus:ring-4 focus:ring-slate-500/10 text-sm md:text-base mx-2 font-sans hover:scale-[1.02]",
  actions: "flex justify-center gap-2 mt-6",
  input: "font-mono text-center tracking-widest text-lg rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-white p-3",
};

// Reusable standard modal settings
const defaultSettings = {
  buttonsStyling: false,
  customClass: customSwalClass,
  background: "transparent",
  showClass: {
    popup: "animate-fade-in",
  },
  hideClass: {
    popup: "",
  },
};

// Reusable toast settings
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#ffffff",
  customClass: {
    popup: "rounded-2xl border border-slate-100 shadow-xl p-4 flex items-center bg-white/95 dark:bg-slate-900/95 dark:border-slate-800 dark:text-white",
    title: "font-sans font-medium text-slate-800 dark:text-white text-sm ml-2",
  },
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const showToast = (title: string, icon: "success" | "error" | "warning" | "info" = "success") => {
  Toast.fire({
    icon,
    title,
  });
};

export const showSuccess = async (title: string, text?: string) => {
  return Swal.fire({
    ...defaultSettings,
    icon: "success",
    title,
    text,
    iconColor: "#2563eb", // HSM primary blue
    confirmButtonText: "Perfect",
  });
};

export const showError = async (title: string, text?: string) => {
  return Swal.fire({
    ...defaultSettings,
    icon: "error",
    title,
    text,
    iconColor: "#ef4444",
    confirmButtonText: "Got It",
  });
};

export const showWarning = async (title: string, text?: string) => {
  return Swal.fire({
    ...defaultSettings,
    icon: "warning",
    title,
    text,
    iconColor: "#f59e0b",
    confirmButtonText: "Acknowledge",
  });
};

export const showInfo = async (title: string, text?: string) => {
  return Swal.fire({
    ...defaultSettings,
    icon: "info",
    title,
    text,
    iconColor: "#06b6d4",
    confirmButtonText: "Close",
  });
};

export const showConfirm = async (
  title: string,
  text: string,
  confirmText: string = "Yes, proceed",
  cancelText: string = "Cancel"
): Promise<boolean> => {
  const result = await Swal.fire({
    ...defaultSettings,
    icon: "question",
    title,
    text,
    iconColor: "#6366f1",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
  return result.isConfirmed;
};

export const promptOtpInput = async (
  title: string,
  text: string,
  placeholder: string = "Enter 4-digit code"
): Promise<string | null> => {
  const result = await Swal.fire({
    ...defaultSettings,
    title,
    text,
    input: "text",
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonText: "Verify Completion",
    cancelButtonText: "Go Back",
    inputAttributes: {
      maxlength: "10",
      autocapitalize: "off",
      autocorrect: "off",
    },
    preConfirm: (value) => {
      if (!value || value.trim().length === 0) {
        Swal.showValidationMessage("Please enter a valid verification code");
      }
      return value;
    },
  });
  return result.isConfirmed ? result.value : null;
};
