import z from "zod";

export type CreateEquipmentModel = z.infer<typeof createEquipmentModel>["body"];
export type UpdateEquipmentModel = z.infer<typeof updateEquipmentModel>["body"];
export const createEquipmentModel = z.object({
  body: z.object({
    name: z.string().max(100),
  }),
});
export const updateEquipmentModel = z.object({
  params: z.object({
    equipmentId: z.string().max(36),
  }),
  body: z.object({
    name: z.string().max(100),
  }),
});
