import { useMutation } from "@tanstack/react-query";
import authApi from "@/api/authApi";

// ✅ Send active code (validate phone number)
export const useValidatePhoneNumber = () =>
  useMutation({
    mutationFn: (data: {
      phoneNumber: string | null;
      sendActiveCodeType: string;
    }) => authApi.validatePhoneNumber(data),
  });

// ✅ Verify OTP
export const useVerifyOtp = () =>
  useMutation({
    mutationFn: (data: {
      phoneNumber: string | null;
      code: string;
      checkActiveCodeType: string;
    }) => authApi.verifyOtp(data),
  });

// ✅ First signup
export const useFirstSignUp = () =>
  useMutation({
    mutationFn: (data: any) => authApi.firstSignUp(data),
  });

// ✅ Login with password
export const useLoginWithPassword = () =>
  useMutation({
    mutationFn: (data: { phoneNumber: string | null; password: string }) =>
      authApi.loginWithPassword(data),
  });

// ✅ Forget password
export const useForgetPassword = () =>
  useMutation({
    mutationFn: (data: {
      phoneNumber: string | null;
      newPassword: string;
      reNewPassword: string;
    }) => authApi.forgetPassword(data),
  });

// ✅ Second step of signup
export const useSignUpLevelTwo = () =>
  useMutation({
    mutationFn: (data: any) => authApi.signUpLevelTwo(data),
  });

// ✅ check Login
export const useCheckLogin = () =>
  useMutation({
    mutationFn: (data?: any) => authApi.checkLogin(data),
  });
