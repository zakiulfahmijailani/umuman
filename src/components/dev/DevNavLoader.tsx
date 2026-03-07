"use client";

import dynamic from 'next/dynamic';

const DevNavBar = dynamic(() => import('@/components/dev/DevNavBar'), {
    ssr: false
});

export default function DevNavLoader() {
    return <DevNavBar />;
}
