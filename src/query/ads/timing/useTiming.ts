import { useMutation, useQuery } from "@tanstack/react-query";
import timingApi from "@/api/timingApi"; // 👈 rename from authApi to adsApi for clarity

// ✅ Update Advertisement
export const useCreateTiming = () =>
  useMutation({
    mutationFn: (data: { id: string; data: any }) =>
      timingApi.createTiming(data),
  });
