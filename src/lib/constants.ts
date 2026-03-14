export const APP_NAME = 'umuman';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const UPLOAD_MAX_SIZE_MB = 5;
export const UPLOAD_ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

export const INVITATION_SLUG_MIN_LENGTH = 3;
export const INVITATION_SLUG_MAX_LENGTH = 50;

export const RSVP_MAX_GUESTS = 10;
export const RSVP_MESSAGE_MAX_LENGTH = 500;
