import z from "zod";

export const registerUserModel = z
  .object({
    body: z.object({
      firstName: z.string().min(2).max(20),
      lastName: z.string().min(2).max(20),
      email: z.string().max(50).email(),
      password: z
        .string()
        .regex(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/g,
          "One Upper, One Lower, One Number, One Special !@#$%^&*, 8 - 16 Characters."
        ),
      confirmPassword: z
        .string()
        .regex(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/g,
          "One Upper, One Lower, One Number, One Special !@#$%^&*, 8 - 16 Characters."
        ),
    }),
  })
  .refine(
    ({ body: { password, confirmPassword } }) => password === confirmPassword,
    { path: ["body", "confirmPassword"], message: "Passwords Must Match" }
  );

export const loginUserModel = z.object({
  body: z.object({
    email: z.string().max(50).email(),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/g,
        "One Upper, One Lower, One Number, One Special !@#$%^&*, 8 - 16 Characters."
      ),
  }),
});

export type RegisterUserModel = z.infer<typeof registerUserModel>["body"];
export type LoginUserModel = z.infer<typeof loginUserModel>["body"];
