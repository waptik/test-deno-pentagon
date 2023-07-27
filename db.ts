import {
  createPentagon,
  //  "https://raw.githubusercontent.com/skoshx/pentagon/6b9f2627685b0729d5dcf7103c19f690ff4554ec/mod.ts";
} from "https://deno.land/x/pentagon@v0.1.3/mod.ts";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

export const generateUUID = () => crypto.randomUUID();
export const kv = await Deno.openKv();
//------------------------------------- Models -------------------------------------//

const WithDefautTimestamps = z.object({
  createdAt: z
    .string()
    .datetime()
    .default(() => new Date().toISOString()),
  updatedAt: z
    .string()
    .datetime()
    .default(() => new Date().toISOString())
    .nullable()
    .nullable(),
});

export const User = z
  .object({
    id: z.number().describe("primary"),
    username: z.string().describe("unique").optional(),
    gender: z.string(),
    firstName: z.string(),
    lastName: z.string().optional(),
    nickname: z.string().describe("unique"),
    enableScreening: z.boolean().default(false).optional(),
  })
  .merge(WithDefautTimestamps);

export const Meeting = z
  .object({
    id: z
      .string()
      .uuid()
      .describe("primary")
      .default(() => generateUUID()),
    title: z.string(),
    description: z.string(),
    slug: z
      .string()
      .describe("unique")
      .min(1)
      .default(() => generateUUID()),
    duration: z.number().min(1),
    price: z.number().min(5),
    requiresConfirmation: z.boolean().default(false).optional(),
    hidden: z.boolean().default(false).optional(),
    metadata: z
      .object({
        objective: z.string().optional(),
      })
      .nullable()
      .default(null),
    // relations
    userId: z.number(),
  })
  .merge(WithDefautTimestamps);

export const AgreedTerms = z
  .object({
    id: z.number().describe("primary"),
  })
  .merge(WithDefautTimestamps);

export const BookingReference = z
  .object({
    id: z
      .string()
      .uuid()
      .describe("primary")
      .default(() => generateUUID()),
    type: z.string().min(1),
    bookingId: z.string().uuid().optional(),
    meetingId: z.string().uuid().optional(),
    meetingUrl: z.string().url().optional(),
    meetingPassword: z.string().optional(),
  })
  .merge(WithDefautTimestamps);

//------------------------------------- Models end -------------------------------------//

//------------------------------------- Database -------------------------------------//
export const pentagon = createPentagon(kv, {
  users: {
    schema: User,
    relations: {
      meetings: ["meeting", [Meeting], "id", "userId"],
    },
  },
  agreedTerms: {
    schema: AgreedTerms,
  },
  bookingReference: {
    schema: BookingReference,
  },
  meeting: {
    schema: Meeting,
  },
});
