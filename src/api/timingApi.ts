import { advertisementUrl  } from "@/constants/apiUrls";
import { apiClient } from "./axiosClient";

const timingApi = {
  createTiming: ({ id, data }: { id: string; data: any }) =>
    apiClient.post(`${advertisementUrl}/${id}/timing`, data),
};

export default timingApi;
