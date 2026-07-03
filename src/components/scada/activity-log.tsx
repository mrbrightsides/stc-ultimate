'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  User, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Power,
  Lock,
  Unlock,
  TrendingUp,
  Filter,
  Download
} from 'lucide-react'

interface ActivityLogEntry {
  id: string
  timestamp: string
  operator: string
  operatorId: string
  role: string
  action: string
  category: 'device_control' | 'alert_ack' | 'system_config' | 'login' | 'energy' | 'access'
  target?: string
  details: string
  status: 'success' | 'warning' | 'error'
}

// Mock activity log data
const mockActivityLogs: ActivityLogEntry[] = [
  {
    id: 'ACT-001',
    timestamp: '2024-01-15 09:15:23',
    operator: 'Ahmad Prasetyo',
    operatorId: 'OP-001',
    role: 'Admin',
    action: 'Device Control',
    category: 'device_control',
    target: 'HVAC Zone A',
    details: 'Adjusted temperature setpoint from 22°C to 24°C',
    status: 'success'
  },
  {
    id: 'ACT-002',
    timestamp: '2024-01-15 09:10:45',
    operator: 'Budi Santoso',
    operatorId: 'OP-002',
    role: 'Senior Operator',
    action: 'Alert Acknowledged',
    category: 'alert_ack',
    target: 'Conference Hall',
    details: 'Acknowledged capacity warning (95/100)',
    status: 'success'
  },
  {
    id: 'ACT-003',
    timestamp: '2024-01-15 09:05:12',
    operator: 'Citra Dewi',
    operatorId: 'OP-003',
    role: 'Operator',
    action: 'Device Control',
    category: 'device_control',
    target: 'Lighting Zone 2',
    details: 'Turned ON lighting system',
    status: 'success'
  },
  {
    id: 'ACT-004',
    timestamp: '2024-01-15 09:00:34',
    operator: 'Ahmad Prasetyo',
    operatorId: 'OP-001',
    role: 'Admin',
    action: 'Login',
    category: 'login',
    details: 'Operator logged into SCADA system',
    status: 'success'
  },
  {
    id: 'ACT-005',
    timestamp: '2024-01-15 08:55:18',
    operator: 'Budi Santoso',
    operatorId: 'OP-002',
    role: 'Senior Operator',
    action: 'Energy Optimization',
    category: 'energy',
    target: 'HVAC System',
    details: 'Applied AI recommendation: Reduce unoccupied zones',
    status: 'success'
  },
  {
    id: 'ACT-006',
    timestamp: '2024-01-15 08:50:42',
    operator: 'Citra Dewi',
    operatorId: 'OP-003',
    role: 'Operator',
    action: 'Access Control',
    category: 'access',
    target: 'Main Entrance',
    details: 'Unlocked access point for maintenance',
    status: 'success'
  },
  {
    id: 'ACT-007',
    timestamp: '2024-01-15 08:45:29',
    operator: 'Ahmad Prasetyo',
    operatorId: 'OP-001',
    role: 'Admin',
    action: 'System Configuration',
    category: 'system_config',
    target: 'Alert Thresholds',
    details: 'Updated energy consumption warning threshold to 200 kWh',
    status: 'success'
  },
  {
    id: 'ACT-008',
    timestamp: '2024-01-15 08:40:15',
    operator: 'Budi Santoso',
    operatorId: 'OP-002',
    role: 'Senior Operator',
    action: 'Device Control',
    category: 'device_control',
    target: 'Security Camera 3',
    details: 'Attempted to restart camera - connection timeout',
    status: 'error'
  },
  {
    id: 'ACT-009',
    timestamp: '2024-01-15 08:35:50',
    operator: 'Citra Dewi',
    operatorId: 'OP-003',
    role: 'Operator',
    action: 'Alert Acknowledged',
    category: 'alert_ack',
    target: 'Restaurant',
    details: 'Acknowledged high density alert (68/80)',
    status: 'success'
  },
  {
    id: 'ACT-010',
    timestamp: '2024-01-15 08:30:22',
    operator: 'Ahmad Prasetyo',
    operatorId: 'OP-001',
    role: 'Admin',
    action: 'Access Control',
    category: 'access',
    target: 'Staff Room',
    details: 'Locked access point after hours',
    status: 'success'
  }
]

export default function ActivityLog() {
  const [filter, setFilter] = useState<string>('all')
  const [logs] = useState<ActivityLogEntry[]>(mockActivityLogs)

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.category === filter)

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      device_control: <Power className="w-4 h-4" />,
      alert_ack: <AlertTriangle className="w-4 h-4" />,
      system_config: <Settings className="w-4 h-4" />,
      login: <User className="w-4 h-4" />,
      energy: <TrendingUp className="w-4 h-4" />,
      access: <Lock className="w-4 h-4" />
    }
    return icons[category] || <Activity className="w-4 h-4" />
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      device_control: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      alert_ack: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      system_config: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      login: 'bg-green-500/10 text-green-500 border-green-500/20',
      energy: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      access: 'bg-red-500/10 text-red-500 border-red-500/20'
    }
    return colors[category] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      success: { color: 'bg-green-500', label: 'Success' },
      warning: { color: 'bg-yellow-500', label: 'Warning' },
      error: { color: 'bg-red-500', label: 'Error' }
    }
    return badges[status] || badges.success
  }

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'Operator', 'Role', 'Action', 'Target', 'Details', 'Status'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.operator,
        log.role,
        log.action,
        log.target || 'N/A',
        log.details,
        log.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `scada-activity-log-${new Date().toISOString()}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Operator Activity Log
              </CardTitle>
              <CardDescription>
                Complete audit trail of all operator actions and system events
              </CardDescription>
            </div>
            <Button onClick={exportLogs} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Activities
            </Button>
            <Button
              variant={filter === 'device_control' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('device_control')}
            >
              <Power className="w-3 h-3 mr-1" />
              Device Control
            </Button>
            <Button
              variant={filter === 'alert_ack' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('alert_ack')}
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Alerts
            </Button>
            <Button
              variant={filter === 'energy' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('energy')}
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Energy
            </Button>
            <Button
              variant={filter === 'access' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('access')}
            >
              <Lock className="w-3 h-3 mr-1" />
              Access
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity log entries */}
      <div className="space-y-3">
        {filteredLogs.map((log) => {
          const statusBadge = getStatusBadge(log.status)
          return (
            <Card key={log.id} className="border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg border ${getCategoryColor(log.category)}`}>
                      {getCategoryIcon(log.category)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{log.action}</h4>
                        {log.target && (
                          <>
                            <span className="text-gray-500">→</span>
                            <span className="text-sm text-blue-400">{log.target}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{log.details}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.operator} ({log.role})
                        </span>
                        <span>•</span>
                        <span>{log.timestamp}</span>
                        <span>•</span>
                        <span className="font-mono">{log.id}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${statusBadge.color} text-white text-xs`}>
                    {statusBadge.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{logs.filter(l => l.status === 'success').length}</div>
              <div className="text-sm text-gray-400">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{logs.filter(l => l.status === 'warning').length}</div>
              <div className="text-sm text-gray-400">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{logs.filter(l => l.status === 'error').length}</div>
              <div className="text-sm text-gray-400">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{logs.length}</div>
              <div className="text-sm text-gray-400">Total Actions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">Blockchain Audit Trail</h4>
            <p className="text-xs text-gray-400">
              All operator activities are cryptographically signed and recorded on blockchain for immutable audit trail. 
              Hash verification ensures data integrity and prevents tampering.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
