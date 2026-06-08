import {
  checkLoginUrl,
  firstSignUpUrl,
  forgetPasswordUrl,
  loginWithPasswordUrl,
  sendCodeUrl,
  signUpLevelTwoUrl,
  verifyOtpUrl,
  updateUserProfileUrl,
} from "@/constants/apiUrls";
import { authClient, apiClient } from "./axiosClient";

const authApi = {
  validatePhoneNumber: (data: { phoneNumber; sendActiveCodeType }) =>
    authClient.post(sendCodeUrl, data),

  verifyOtp: (data: { phoneNumber; code; checkActiveCodeType }) =>
    authClient.post(verifyOtpUrl, data),

  firstSignUp: (data: any) => authClient.post(firstSignUpUrl, data),

  loginWithPassword: (data) => authClient.post(loginWithPasswordUrl, data),

  forgetPassword: (data) => authClient.post(forgetPasswordUrl, data),

  signUpLevelTwo: (data) => authClient.post(signUpLevelTwoUrl, data),

  checkLogin: (data) => authClient.post(checkLoginUrl, data),

  updateUserProfile: (data: { firstName?: string; lastName?: string; email?: string; phoneNumber?: string }) =>
    apiClient.put(updateUserProfileUrl, data),
};

export default authApi;
