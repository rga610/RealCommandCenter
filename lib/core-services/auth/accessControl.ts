// Permission checking

import { authService } from './authService';
import { redirect } from 'next/navigation';

// Middleware for protecting routes
export async function protectRoute(
  moduleKey: string,
  redirectPath: string = '/unauthorized'
): Promise<void> {
  const hasAccess = await authService.hasModuleAccess(moduleKey);
  
  if (!hasAccess) {
    redirect(redirectPath);
  }
}