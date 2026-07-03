'use client';

import React, { useState } from 'react';
import { useRole } from '@/contexts/role-context';
import { getAllRoles } from '@/lib/roles-config';
import type { UserRole } from '@/lib/roles-config';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Check, User, ChevronDown } from 'lucide-react';

export function RoleSelector(): JSX.Element {
  const { currentRole, setCurrentRole, roleConfig } = useRole();
  const [open, setOpen] = useState<boolean>(false);
  const allRoles = getAllRoles();

  const handleRoleSelect = (role: UserRole): void => {
    setCurrentRole(role);
    setOpen(false);
  };

  const getColorClasses = (color: string): { bg: string; text: string; border: string; hover: string } => {
    const colorMap: Record<string, { bg: string; text: string; border: string; hover: string }> = {
      cyan: {
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-400',
        border: 'border-cyan-500/50',
        hover: 'hover:bg-cyan-500/20'
      },
      purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        border: 'border-purple-500/50',
        hover: 'hover:bg-purple-500/20'
      },
      green: {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/50',
        hover: 'hover:bg-green-500/20'
      },
      orange: {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/50',
        hover: 'hover:bg-orange-500/20'
      }
    };
    return colorMap[color] || colorMap.cyan;
  };

  const currentColors = getColorClasses(roleConfig.color);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`${currentColors.border} ${currentColors.text} ${currentColors.hover} transition-all`}
        >
          <User className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{roleConfig.icon} {roleConfig.name}</span>
          <span className="sm:hidden">{roleConfig.icon}</span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-black/95 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Select Your Role
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose your role to access relevant features and modules
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-4 py-4">
            {allRoles.map((role) => {
              const isSelected = role.id === currentRole;
              const colors = getColorClasses(role.color);
              
              return (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all ${colors.border} ${
                    isSelected 
                      ? `${colors.bg} border-2 ring-2 ring-${role.color}-500/20` 
                      : 'bg-gray-900/50 border hover:border-gray-700'
                  }`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{role.icon}</span>
                          <div>
                            <h3 className={`text-xl font-bold ${colors.text}`}>
                              {role.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {role.description}
                            </p>
                          </div>
                        </div>

                        <Separator className="bg-gray-800" />

                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Key Features
                          </p>
                          <div className="grid gap-2">
                            {role.features.slice(0, 4).map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <div className={`mt-1 h-1.5 w-1.5 rounded-full ${colors.bg} ${colors.border} border`} />
                                <span className="text-sm text-gray-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Module Access
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {role.allowedModules.length > 5 ? (
                              <Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>
                                {role.allowedModules.length} modules
                              </Badge>
                            ) : (
                              role.allowedModules.map((module) => (
                                <Badge 
                                  key={module}
                                  variant="outline"
                                  className={`${colors.border} ${colors.text} text-xs`}
                                >
                                  {module}
                                </Badge>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className={`ml-4 flex h-8 w-8 items-center justify-center rounded-full ${colors.bg} ${colors.border} border-2`}>
                          <Check className={`h-5 w-5 ${colors.text}`} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>

        <Separator className="bg-gray-800" />

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Current: <span className={currentColors.text}>{roleConfig.name}</span>
          </p>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
