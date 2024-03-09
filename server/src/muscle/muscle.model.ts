import z from "zod";

export type CreateMuscleModel = z.infer<typeof createMuscleModel>["body"];
export type UpdateMuscleModel = z.infer<typeof updateMuscleModel>["body"];
export const createMuscleModel = z.object({
  body: z.object({
    name: z.string().max(100),
  }),
});

export const updateMuscleModel = z.object({
  params: z.object({
    muscleId: z.string().max(36),
  }),
  body: z.object({
    name: z.string().max(100),
  }),
});
