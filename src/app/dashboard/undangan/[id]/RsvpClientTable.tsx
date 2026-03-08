"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RsvpMessage {
    id: string;
    guest_name: string;
    attendance: 'hadir' | 'tidak_hadir' | 'ragu';
    message: string | null;
    created_at: string;
    is_read: boolean;
}

export default function RsvpClientTable({
    initialMessages,
    invitationId,
    totalCount
}: {
    initialMessages: RsvpMessage[];
    invitationId: string;
    totalCount: number;
}) {
    const [messages, setMessages] = useState<RsvpMessage[]>(initialMessages);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const limit = 10;
    const totalPages = Math.ceil(totalCount / limit);

    const toggleExpand = async (message: RsvpMessage) => {
        const isExpanded = expandedIds.has(message.id);
        const newExpanded = new Set(expandedIds);

        if (isExpanded) {
            newExpanded.delete(message.id);
        } else {
            newExpanded.add(message.id);
            // Mark as read if it's currently unread
            if (!message.is_read) {
                markAsRead(message.id);
            }
        }
        setExpandedIds(newExpanded);
    };

    const markAsRead = async (messageId: string) => {
        try {
            // Optimistic update
            setMessages(prev => prev.map(m => m.id === messageId ? { ...m, is_read: true } : m));

            await fetch(`/api/invitations/${invitationId}/messages`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messageIds: [messageId], markAs: 'read' })
            });
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const loadPage = async (newPage: number) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/invitations/${invitationId}/messages?page=${newPage}&limit=${limit}`);
            const json = await res.json();
            if (json.data) {
                setMessages(json.data.items);
                setPage(newPage);
                setExpandedIds(new Set());
            }
        } catch (error) {
            console.error("Failed to load page", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getAttendanceConfig = (status: string) => {
        switch (status) {
            case 'hadir': return {
                icon: <CheckCircle2 className="w-4 h-4" />,
                className: "bg-green-100 text-green-700 border-green-200",
                text: "Hadir"
            };
            case 'tidak_hadir': return {
                icon: <XCircle className="w-4 h-4" />,
                className: "bg-red-100 text-red-700 border-red-200",
                text: "Tidak Hadir"
            };
            case 'ragu': return {
                icon: <HelpCircle className="w-4 h-4" />,
                className: "bg-yellow-100 text-yellow-700 border-yellow-200",
                text: "Masih Ragu"
            };
            default: return {
                icon: <HelpCircle className="w-4 h-4" />,
                className: "bg-stone-100 text-stone-700 border-stone-200",
                text: "Belum Pasti"
            };
        }
    };

    if (totalCount === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border border-stone-200 rounded-3xl text-center shadow-sm">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                    <MailOpen className="w-8 h-8 text-stone-400" />
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-800">Belum Ada RSVP</h3>
                <p className="text-stone-500 max-w-sm mt-2 text-sm">Masih belum ada tamu yang mengonfirmasi kehadiran atau memberikan ucapan.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-stone-200 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
                    <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nama Tamu</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Kehadiran</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider w-1/2">Pesan</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {messages.map((msg) => {
                            const att = getAttendanceConfig(msg.attendance);
                            const isExpanded = expandedIds.has(msg.id);
                            const hasMessage = !!msg.message?.trim();

                            return (
                                <tr
                                    key={msg.id}
                                    className={`group transition-colors ${!msg.is_read ? 'bg-gold-50/30 font-medium' : 'hover:bg-stone-50'} ${hasMessage ? 'cursor-pointer' : ''}`}
                                    onClick={() => hasMessage && toggleExpand(msg)}
                                >
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        {!msg.is_read && (
                                            <span className="w-2 h-2 rounded-full bg-gold-500 shadow-[0_0_8px_rgba(234,179,8,0.5)] flex-shrink-0" />
                                        )}
                                        <div className="font-semibold text-stone-800">{msg.guest_name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${att.className}`}>
                                            {att.icon}
                                            {att.text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-stone-600 min-w-[200px]">
                                        {hasMessage ? (
                                            <div className="flex flex-col items-start gap-1">
                                                <div className={`transition-all duration-300 relative ${isExpanded ? 'line-clamp-none whitespace-pre-wrap' : 'line-clamp-1 italic text-stone-500 pr-6'}`}>
                                                    "{msg.message}"
                                                    {!isExpanded && (
                                                        <ChevronDown className="w-4 h-4 absolute right-0 top-0.5 text-stone-400 group-hover:text-gold-500" />
                                                    )}
                                                    {isExpanded && (
                                                        <ChevronUp className="w-4 h-4 ml-2 inline text-stone-400" />
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-stone-400 italic text-xs">- Tanpa pesan -</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right text-stone-500 text-xs text-nowrap">
                                        {format(new Date(msg.created_at), "dd MMM yyyy, HH:mm", { locale: localeId })}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="border-t border-stone-200 bg-stone-50/50 p-4 flex items-center justify-between">
                    <p className="text-xs text-stone-500 font-medium">
                        Halaman {page} dari {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={page === 1 || isLoading}
                            onClick={() => loadPage(page - 1)}
                            className="h-8 text-xs border-stone-200"
                        >
                            Sebelumnya
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={page === totalPages || isLoading}
                            onClick={() => loadPage(page + 1)}
                            className="h-8 text-xs border-stone-200"
                        >
                            Selanjutnya
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
