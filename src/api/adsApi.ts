import { advertisementUrl, exploreAdvertisementUrl } from "@/constants/apiUrls";
import { apiClient } from "./axiosClient";
interface Filters {
  categories?: number[];
  groups?: number[];
  search?: string;
  fromDate?: string;
  toDate?: string;
}

const adsApi = {
  // this is for editing oporations
  getSingleAd: ({ id }: { id: string }) =>
    apiClient.post(`${advertisementUrl}/${id}`),
  // getSingleAd: ({ id }: { id: string }) =>
  //   apiClient.get(`${advertisementUrl}/${id}`),

  getAllAds: ({ page, per_page }, { filters }: { filters: Filters }) =>
    apiClient.post(
      page
        ? `${exploreAdvertisementUrl}?page=${page}&per_page=${per_page}`
        : `${exploreAdvertisementUrl}`,
      filters
    ),

  updateAdvertisement: ({ id, data }: { id: string; data: any }) =>
    apiClient.put(`${advertisementUrl}/${id}`, data),

  // delete advertisement
  deleteAdvertisement: ({ id }: { id: string }) =>
    apiClient.delete(`${advertisementUrl}/${id}`),

  // this is for showing a single add
  getSingleAdToShow: ({ id }: { id: string }) =>
    apiClient.get(`${advertisementUrl}/${id}`),

 getUserAds: async ({ page, per_page }, { status }: { status?: number }) => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("توکن یافت نشد. لطفاً وارد حساب شوید.");

    // ساخت query string
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page.toString());
    if (per_page) queryParams.append('per_page', per_page.toString());
    if (status !== undefined && status !== null) queryParams.append('status', status.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `${advertisementUrl}?${queryString}` : advertisementUrl;

    const res = await apiClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // بررسی ساختار پاسخ API
    // اگر response.data یک آرایه است، مستقیماً برگردان
    if (Array.isArray(res.data)) {
      return res.data;
    }
    
    // اگر response.data.data یک آرایه است (ساختار pagination)
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    
    // اگر response.data یک object با property data است
    if (res.data?.data) {
      return res.data.data;
    }
    
    // fallback
    console.warn('Unexpected API response format:', res.data);
    return [];
  },
  
};

export default adsApi;
