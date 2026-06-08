import propertyApi from "@/api/propertyApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetProperties = (itemId: string, advertisementId: string) =>
  useQuery({
    queryKey: ["items", itemId, advertisementId],
    queryFn: () => propertyApi.getProperties({ itemId, advertisementId }),
    enabled: !!itemId && !!advertisementId, // only fetch if both exist
  });

export const useUpdateProperty = () =>
  useMutation({
    mutationFn: (data: {
      itemId: string;
      advertisementId: string;
      data: any;
    }) => propertyApi.updateProperty(data),
  });
