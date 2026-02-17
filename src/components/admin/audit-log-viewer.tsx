"use client"

import { useState } from "react"
import useSWR from "swr"
import { formatDistanceToNow } from "date-fns"
import { History, Loader2, ChevronDown, ChevronUp } from "lucide-react"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AuditLogViewer({ entityId }: { entityId: string }) {
    const { data: logs, isLoading } = useSWR(`/api/audit/${entityId}`, fetcher)
    const [isOpen, setIsOpen] = useState(false)

    if (isLoading) return <div className="text-sm text-gray-500"><Loader2 className="h-3 w-3 animate-spin inline" /> Loading logs...</div>

    if (!logs || logs.length === 0) return null

    return (
        <div className="mt-8 border rounded-lg overflow-hidden">
            <button
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 font-medium text-gray-700">
                    <History className="h-4 w-4" />
                    Audit Log History ({logs.length})
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {isOpen && (
                <div className="max-h-60 overflow-y-auto p-4 bg-white">
                    <table className="w-full text-xs text-left">
                        <thead>
                            <tr className="border-b text-gray-500">
                                <th className="pb-2">Time</th>
                                <th className="pb-2">Action</th>
                                <th className="pb-2">User</th>
                                <th className="pb-2 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log: any) => (
                                <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="py-2 text-gray-600" title={new Date(log.timestamp).toLocaleString()}>
                                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                    </td>
                                    <td className="py-2 font-medium">{log.action_type}</td>
                                    <td className="py-2">
                                        {log.performed_by?.full_name} <span className="text-gray-400">({log.performed_by?.role})</span>
                                    </td>
                                    <td className="py-2 text-right font-mono text-gray-500 truncate max-w-[200px]" title={log.new_value}>
                                        {/* Simplified diff view could go here */}
                                        Updated
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
