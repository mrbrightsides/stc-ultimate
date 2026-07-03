'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserRole } from '@/lib/roles-config';
import { ROLE_DEFINITIONS, hasModuleAccess, getAccessibleModules } from '@/lib/roles-config';
import type { AppModule } from '@/lib/roles-config';

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  hasAccess: (module: AppModule) => boolean;
  accessibleModules: AppModule[];
  roleConfig: typeof ROLE_DEFINITIONS[UserRole];
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = 'stc_user_role';
const DEFAULT_ROLE: UserRole = 'tourist';

interface RoleProviderProps {
  children: React.ReactNode;
}

export function RoleProvider({ children }: RoleProviderProps): JSX.Element {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(DEFAULT_ROLE);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load role from localStorage on mount
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
      if (savedRole && (savedRole === 'tourist' || savedRole === 'sme' || savedRole === 'researcher' || savedRole === 'admin')) {
        setCurrentRoleState(savedRole as UserRole);
      }
    } catch (error) {
      console.error('Error loading role from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update role and persist to localStorage
  const setCurrentRole = useCallback((role: UserRole): void => {
    try {
      setCurrentRoleState(role);
      localStorage.setItem(ROLE_STORAGE_KEY, role);
      console.log(`Role changed to: ${role}`);
    } catch (error) {
      console.error('Error saving role to localStorage:', error);
    }
  }, []);

  // Check if current role has access to a module
  const hasAccess = useCallback((module: AppModule): boolean => {
    return hasModuleAccess(currentRole, module);
  }, [currentRole]);

  // Get all accessible modules for current role
  const accessibleModules = getAccessibleModules(currentRole);
  
  // Get current role configuration
  const roleConfig = ROLE_DEFINITIONS[currentRole];

  const value: RoleContextType = {
    currentRole,
    setCurrentRole,
    hasAccess,
    accessibleModules,
    roleConfig,
    isLoading
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

/**
 * Hook to use role context
 */
export function useRole(): RoleContextType {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

/**
 * Hook to check module access
 */
export function useModuleAccess(module: AppModule): boolean {
  const { hasAccess } = useRole();
  return hasAccess(module);
}
