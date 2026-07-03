'use client'

import { useState } from 'react'
import OperatorLogin from './operator-login'
import ScadaControlSystem from './scada-control-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LogOut, Shield, Clock } from 'lucide-react'

interface OperatorAccount {
  id: string
  username: string
  password: string
  fullName: string
  role: 'admin' | 'senior_operator' | 'operator' | 'viewer'
  department: string
  lastLogin?: string
}

export default function ScadaAuthWrapper() {
  const [operator, setOperator] = useState<OperatorAccount | null>(null)
  const [sessionStart, setSessionStart] = useState<string>('')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLoginSuccess = (op: OperatorAccount) => {
    setOperator(op)
    setSessionStart(new Date().toLocaleString('id-ID'))
  }

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    setOperator(null)
    setSessionStart('')
    setShowLogoutModal(false)
  }

  const cancelLogout = () => {
    setShowLogoutModal(false)
  }

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      admin: { color: 'bg-red-500', label: 'Admin' },
      senior_operator: { color: 'bg-blue-500', label: 'Senior Operator' },
      operator: { color: 'bg-green-500', label: 'Operator' },
      viewer: { color: 'bg-gray-500', label: 'Viewer' }
    }
    return badges[role] || badges.viewer
  }

  // If not logged in, show login screen
  if (!operator) {
    return <OperatorLogin onLoginSuccess={handleLoginSuccess} />
  }

  const badge = getRoleBadge(operator.role)

  // If logged in, show SCADA with operator info header
  return (
    <div className="min-h-screen">
      {/* Operator Info Header */}
      <div className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{operator.fullName}</span>
                    <Badge className={`${badge.color} text-white text-xs`}>
                      {badge.label}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-3">
                    <span>@{operator.username}</span>
                    <span>•</span>
                    <span>🏢 {operator.department}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Session: {sessionStart}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* SCADA System */}
      <ScadaControlSystem operator={operator} />

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Confirm Logout</h3>
                <p className="text-sm text-gray-400">Are you sure you want to logout?</p>
              </div>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-300 mb-2">
                <strong className="text-white">{operator.fullName}</strong> (@{operator.username})
              </p>
              <p className="text-xs text-gray-400">
                Session started: {sessionStart}
              </p>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              All unsaved changes will be lost. Your activity has been logged and recorded on blockchain.
            </p>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={cancelLogout}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
