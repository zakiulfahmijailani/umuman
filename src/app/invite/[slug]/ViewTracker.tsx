"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
    slug: string;
    isPreview: boolean;
}

export default function ViewTracker({ slug, isPreview }: ViewTrackerProps) {
    useEffect(() => {
        // Only track if not in preview mode and not the demo slug
        if (!isPreview && typeof window !== 'undefined' && slug !== 'demo') {
            fetch(`/api/public/invitations/${slug}/view`, { method: 'POST', keepalive: true }).catch(() => { });
        }
    }, [slug, isPreview]);

    // Render watermark if in preview mode
    if (!isPreview) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] pointer-events-none animate-in fade-in duration-500">
            <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 text-[10px] md:text-xs font-bold rounded shadow-xl uppercase tracking-widest border border-white/20 select-none">
                PREVIEW MODE
            </div>
        </div>
    );
}
