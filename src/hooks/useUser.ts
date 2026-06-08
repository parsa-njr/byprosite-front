import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { checkLoginUrlAsp } from "@/constants/apiUrls";

export interface User {
    id: string;
    firstName: string;
    lastName?: string;
    phoneNumber: string;
    email?: string;

}

export function useUser() {
  return useQuery<User>({
    queryKey: ["userInfo"],
    queryFn: async () => {
         const token = localStorage.getItem("accessToken");
         if (!token) throw new Error("کاربر وارد نشده");
         
       const res = await axios.post(
        checkLoginUrlAsp,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );

      
      

      return res.data.detail.user;
    },
    staleTime: 1000 * 60 * 5, // 5 دقیقه
    refetchOnWindowFocus: false,
  });
}
