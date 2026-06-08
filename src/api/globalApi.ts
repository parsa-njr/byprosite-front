import {
  getCategoriesUrl,
  getGroupsUrl,
  getItemUrl,
  getPropertyUnitsUrl,
  getAddressListUrl,
  deleteAddressUrl,
  editAddressUrl,
  addAddressUrl,
  getLocationIdsByNameUrl,
  getProvinceIdByNameUrl,
  getCountyIdByNameUrl,
  getCityIdByNameUrl,
  getEnvironmentalProperiesUrl,
  getUnitOfMeasurementUrl,
} from "@/constants/apiUrls";
import { apiClient } from "./axiosClient";

const globalApi = {
  getPropertyUnits: () => apiClient.get(getPropertyUnitsUrl),
  getUnitOfMeasurements: () => apiClient.get(getUnitOfMeasurementUrl),
  getEnvironmentalProperies: () => apiClient.get(getEnvironmentalProperiesUrl),
  getCategories: () => apiClient.get(getCategoriesUrl),
  getGroups: ({ categoryId }: { categoryId: string }) =>
    apiClient.get(`${getGroupsUrl}/${categoryId}`),

  getItems: ({
    categoryId,
    groupId,
  }: {
    categoryId: string;
    groupId: string;
  }) => apiClient.get(`${getItemUrl}/${categoryId}/${groupId}`),

  // Get Address List
  getAddressList: () => apiClient.get(getAddressListUrl),

  // Delete Address
  deleteAddress: (addressId: string) =>
    apiClient.delete(`${deleteAddressUrl}/${addressId}`),

  // Edit Address
  editAddress: ({ id, data }: { id: string; data: any }) => {
    return apiClient.put(`${editAddressUrl}/${id}`, data);
  },

  // Add Address
  addAddress: (data: any) => {
    return apiClient.post(addAddressUrl, data);
  },

  // Get Location IDs by Names
  getLocationIdsByName: ({
    provinceName,
    countyName,
    cityName,
  }: {
    provinceName?: string;
    countyName?: string;
    cityName?: string;
  }) => {
    const params = new URLSearchParams();
    if (provinceName) params.append("provinceName", provinceName);
    if (countyName) params.append("countyName", countyName);
    if (cityName) params.append("cityName", cityName);
    return apiClient.get(`${getLocationIdsByNameUrl}?${params.toString()}`);
  },

  // Get Province ID by Name
  getProvinceIdByName: (provinceName: string) => {
    const params = new URLSearchParams();
    params.append("provinceName", provinceName);
    return apiClient.get(`${getProvinceIdByNameUrl}?${params.toString()}`);
  },

  // Get County ID by Name
  getCountyIdByName: ({
    countyName,
    provinceId,
  }: {
    countyName: string;
    provinceId?: number | string;
  }) => {
    const params = new URLSearchParams();
    params.append("countyName", countyName);
    if (provinceId) params.append("provinceId", String(provinceId));
    return apiClient.get(`${getCountyIdByNameUrl}?${params.toString()}`);
  },

  // Get City ID by Name
  getCityIdByName: (cityName: string) => {
    const params = new URLSearchParams();
    params.append("cityName", cityName);
    return apiClient.get(`${getCityIdByNameUrl}?${params.toString()}`);
  },
};

export default globalApi;
