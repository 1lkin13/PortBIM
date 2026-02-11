import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { objectRepo } from "../../../app/providers/AppProvider";
import { Object3D } from "../../../core/domain/models/Object3D";

export const useObjects = () => {
  return useQuery({
    queryKey: ["objects"],
    queryFn: () => objectRepo.getAll(),
  });
};

export const useCreateObject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Object3D, "id">) => {
      const obj = await objectRepo.create(data);
      return obj;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objects"] });
      queryClient.invalidateQueries({ queryKey: ["designers"] });
    },
  });
};

export const useUpdateObject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Object3D> }) => {
      return objectRepo.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objects"] });
      queryClient.invalidateQueries({ queryKey: ["designers"] });
    },
  });
};

export const useDeleteObject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return objectRepo.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objects"] });
      queryClient.invalidateQueries({ queryKey: ["designers"] });
    },
  });
};
