import { useMutation, useQuery } from "@tanstack/react-query";
import globalApi from "@/api/globalApi";

// ✅ Get Categories
export const useGetEnvironmentalProperies = () =>
  useQuery({
    queryKey: ["environmentalProperies"],
    queryFn: () => globalApi.getEnvironmentalProperies(),
  });
// ✅ Get Categories
export const useGetProperyUnits = () =>
  useQuery({
    queryKey: ["propertyUnits"],
    queryFn: () => globalApi.getPropertyUnits(),
  });
// ✅ Get Categories
export const useGetUnitOfMeasurements = () =>
  useQuery({
    queryKey: ["unitOfMeasurement"],
    queryFn: () => globalApi.getUnitOfMeasurements(),
  });

// ✅ Get Categories
export const useGetCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: () => globalApi.getCategories(),
  });

// ✅ Get Groups (depends on categoryId)
export const useGetGroups = (categoryId) =>
  useQuery({
    queryKey: ["groups", categoryId],
    queryFn: () => globalApi.getGroups({ categoryId }),
    enabled: !!categoryId, // only fetch if categoryId exists
  });

// ✅ Get Items (depends on categoryId + groupId)
export const useGetItems = (categoryId, groupId) =>
  useQuery({
    queryKey: ["items", categoryId, groupId],
    queryFn: () => globalApi.getItems({ categoryId, groupId }),
    enabled: !!categoryId && !!groupId, // only fetch if both exist
  });

// ✅ Get All User Adress List
export const useGetAddressList = () => {
  return useQuery({
    queryKey: ["addressList"],
    queryFn: () => globalApi.getAddressList(),
  });
};

// ✅ Delete Address

export const useDeleteAddress = () => {
  return useMutation({
    mutationFn: (addressId: string) => globalApi.deleteAddress(addressId),
  });
};

// ✅ Edit Address

export const useEditAddress = () => {
  return useMutation({
    mutationFn: (data: { id: string; data: any }) =>
      globalApi.editAddress(data),
  });
};

//  Add Address

export const useAddAddress = () => {
  return useMutation({
    mutationFn: (data: any) => globalApi.addAddress(data),
  });
};
