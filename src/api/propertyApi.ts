import { propertyUrl } from "@/constants/apiUrls";
import { apiClient } from "./axiosClient";

const propertyApi = {
  getProperties: ({
    itemId,
    advertisementId,
  }: {
    itemId: string;
    advertisementId: string;
  }) => apiClient.get(`${propertyUrl}/${itemId}/${advertisementId}`),

  updateProperty: ({
    itemId,
    advertisementId,
    data,
  }: {
    itemId: string;
    advertisementId: string;
    data: any;
  }) => apiClient.put(`${propertyUrl}/${itemId}/${advertisementId}`, data),
};

export default propertyApi;
