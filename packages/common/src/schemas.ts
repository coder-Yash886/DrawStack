import { z } from "zod";


// User
export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

export const SigninSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string(),
});


export const CreateRoomSchema = z.object({
  name: z.string().min(3).max(20),
});


export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type SigninInput = z.infer<typeof SigninSchema>;
export type CreateRoomInput = z.infer<typeof CreateRoomSchema>;
