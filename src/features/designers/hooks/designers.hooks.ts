import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { designerRepo } from "../../../app/providers/AppProvider";
import type { DesignerFormData } from "../schemas/designer.schema";

export const useDesigners = () => {
  return useQuery({
    queryKey: ["designers"],
    queryFn: () => designerRepo.getAll(),
  });
};

export const useCreateDesigner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DesignerFormData) => 
      designerRepo.create({
        ...data,
        status: data.status || "active",
        avatarUrl: data.avatarUrl || ""
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designers"] });
    },
  });
};
export const useDeleteDesigner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => designerRepo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designers"] });
    },
  });
};

export const useUpdateDesigner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DesignerFormData> & { status?: "active" | "inactive"; avatarUrl?: string } }) =>
      designerRepo.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designers"] });
    },
  });
};
