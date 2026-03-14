import { z } from 'zod';

export const rsvpSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  attendance_status: z.enum(['hadir', 'tidak_hadir', 'ragu']),
  number_of_guests: z.number().min(1).max(10),
  message: z.string().max(500).optional(),
});

export const uploadFileSchema = z.object({
  type: z.enum(['themes', 'invitations', 'demo']),
  slot_key: z.string().optional(),
  theme_id: z.string().uuid().optional(),
});

export type RsvpFormData = z.infer<typeof rsvpSchema>;
export type UploadFileData = z.infer<typeof uploadFileSchema>;
