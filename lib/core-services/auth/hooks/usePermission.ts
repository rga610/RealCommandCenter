import React, { useState, useEffect } from 'react';
import { authService } from '../authService';


export function usePermission(permissionKey: string) {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    async function checkPermission() {
      try {
        setLoading(true);
        const result = await authService.hasPermission(permissionKey);
        setHasPermission(result);
      } catch (error) {
        console.error('Error checking permission:', error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    }
    
    checkPermission();
  }, [permissionKey]);
  
  return { hasPermission, loading };
}