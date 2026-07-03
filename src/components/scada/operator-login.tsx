'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Shield, User, Lock, LogIn, Eye, EyeOff } from 'lucide-react'

interface OperatorAccount {
  id: string
  username: string
  password: string
  fullName: string
  role: 'admin' | 'senior_operator' | 'operator' | 'viewer'
  department: string
  lastLogin?: string
}

// Mock operator accounts for demo
const mockOperators: OperatorAccount[] = [
  {
    id: 'OP-001',
    username: 'admin',
    password: 'admin123',
    fullName: 'Akhmad Khudri',
    role: 'admin',
    department: 'IT & Systems',
    lastLogin: '2024-01-15 08:30:00'
  },
  {
    id: 'OP-002',
    username: 'operator1',
    password: 'op123',
    fullName: 'M. Al Fatih',
    role: 'senior_operator',
    department: 'Operations',
    lastLogin: '2024-01-15 07:45:00'
  },
  {
    id: 'OP-003',
    username: 'operator2',
    password: 'op123',
    fullName: 'Freya Al Khansa',
    role: 'operator',
    department: 'Maintenance',
    lastLogin: '2024-01-14 22:15:00'
  },
  {
    id: 'OP-004',
    username: 'viewer',
    password: 'view123',
    fullName: 'M. Al Ghazi',
    role: 'viewer',
    department: 'Management',
    lastLogin: '2024-01-15 09:00:00'
  }
]

interface OperatorLoginProps {
  onLoginSuccess: (operator: OperatorAccount) => void
}

export default function OperatorLogin({ onLoginSuccess }: OperatorLoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      const operator = mockOperators.find(
        op => op.username === username && op.password === password
      )

      if (operator) {
        // Update last login
        operator.lastLogin = new Date().toLocaleString('id-ID')
        onLoginSuccess(operator)
      } else {
        setError('Invalid username or password')
      }
      setIsLoading(false)
    }, 800)
  }

  const handleQuickLogin = (op: OperatorAccount) => {
    setUsername(op.username)
    setPassword(op.password)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6">
        {/* Login Form */}
        <Card className="border-blue-500/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
            <CardTitle className="text-2xl">SCADA Operator Login</CardTitle>
            <CardDescription>
              SmartTourismChain Ultimate - Supervisory Control System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                <LogIn className="w-4 h-4 mr-2" />
                {isLoading ? 'Authenticating...' : 'Login to SCADA'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-center text-gray-500 mb-2">
                🔒 Secure authentication with role-based access control
              </p>
              <p className="text-xs text-center text-gray-500">
                All operator activities are logged and recorded on blockchain
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-lg">Demo Operator Accounts</CardTitle>
            <CardDescription>
              Click any account below to auto-fill login credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockOperators.map((op) => {
              const badge = getRoleBadge(op.role)
              return (
                <button
                  key={op.id}
                  onClick={() => handleQuickLogin(op)}
                  className="w-full p-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-white">{op.fullName}</h4>
                      <p className="text-sm text-gray-400">@{op.username}</p>
                    </div>
                    <Badge className={`${badge.color} text-white text-xs`}>
                      {badge.label}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-gray-400">
                    <p>🏢 {op.department}</p>
                    <p>🔑 Password: {op.password}</p>
                    {op.lastLogin && (
                      <p>🕐 Last Login: {op.lastLogin}</p>
                    )}
                  </div>
                </button>
              )
            })}

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="font-semibold text-sm mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-500" />
                Role Permissions:
              </h4>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• <strong className="text-red-400">Admin</strong>: Full control + user management</li>
                <li>• <strong className="text-blue-400">Senior Operator</strong>: Control devices + acknowledge alerts</li>
                <li>• <strong className="text-green-400">Operator</strong>: Monitor + basic controls</li>
                <li>• <strong className="text-gray-400">Viewer</strong>: Read-only access</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
