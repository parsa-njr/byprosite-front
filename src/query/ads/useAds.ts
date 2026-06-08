import { useMutation, useQuery } from "@tanstack/react-query";
import adsApi from "@/api/adsApi"; // 👈 rename from authApi to adsApi for clarity

// ✅ Get single Ad for Edditing oporations
export const useGetSingleAd = (id: string) =>
  useQuery({
    queryKey: ["singleAd", id], // cache key
    queryFn: () => adsApi.getSingleAd({ id }), // API call
    enabled: !!id, // only run if id is provided
  });

// ✅ Update Advertisement
export const useUpdateAdvertisement = () =>
  useMutation({
    mutationFn: (data: { id: string; data: any }) =>
      adsApi.updateAdvertisement(data),
  });

// ✅ Delete Advertisement
export const useDeleteAdvertisement = () =>
  useMutation({
    mutationFn: ({ id }: { id: string }) =>
      adsApi.deleteAdvertisement({ id }),
  });

// ✅ get all Advertisements for explore

export const useGetAdvertisements = ({ page, per_page, filters }) => {
  return useQuery({
    queryKey: ["advertisements", page, per_page, filters],
    queryFn: () => adsApi.getAllAds({ page, per_page }, { filters }),
  });
};

// this is for showing the advertisement
export const useGetSingleAdToShow = (id: string) =>
  useQuery({
    queryKey: ["singleAd", id], // cache key
    queryFn: () => adsApi.getSingleAdToShow({ id }), // API call
    enabled: !!id, // only run if id is provided
  });

export const useGetUserAds = ({ 
  page, 
  per_page, 
  status 
}: { 
  page?: number; 
  per_page?: number; 
  status?: number;
}) => {
  return useQuery({
    queryKey: ["userAds", page, per_page, status],
    queryFn: async () => {
      const response = await adsApi.getUserAds({ page, per_page }, { status });
      
      // ✅ تضمین برگرداندن آرایه
      if (Array.isArray(response)) {
        return response;
      }
      
      // اگر response یک object با property data است
      if (response?.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      // اگر response یک object با property advertisements است
      if (response?.advertisements && Array.isArray(response.advertisements)) {
        return response.advertisements;
      }
      
      console.warn('Unexpected API response format:', response);
      return [];
    },
    staleTime: 5 * 60 * 1000,
  });
};
