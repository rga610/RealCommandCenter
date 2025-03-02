// Auth types

// types/core-services/auth.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  imageUrl?: string;
  roles: string[]; // or a more specific type
  metadata?: Record<string, unknown>;
}

export interface UserRole {
  name: string;
}
