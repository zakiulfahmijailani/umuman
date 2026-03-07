"use client";

import dynamic from 'next/dynamic';

const DevNavBar = dynamic(() => import('@/components/dev/DevNavBar'), {
    ssr: false
});

export default function DevNavLoader() {
    if (process.env.NODE_ENV !== 'development') return null;
    return <DevNavBar />;
}
