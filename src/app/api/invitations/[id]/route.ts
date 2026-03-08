import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const resolvedParams = await params;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    try {
        const { id } = resolvedParams;

        // Verify ownership and fetch
        const { data: invitation, error } = await supabase
            .from('invitations')
            .select(`
                id, slug, status, created_at,
                invitation_details (*)
            `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error || !invitation) {
            return NextResponse.json({ data: null, error: { code: 'NOT_FOUND', message: 'Undangan tidak ditemukan' } }, { status: 404 });
        }

        return NextResponse.json({ data: invitation, error: null });

    } catch (error: any) {
        console.error("[GET /api/invitations/[id]] Error:", error);
        return NextResponse.json({ data: null, error: { code: 'INTERNAL', message: 'Server error' } }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const resolvedParams = await params;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    try {
        const { id } = resolvedParams;
        const body = await request.json();

        // Basic split of body into invitations fields vs invitation_details fields
        const { status, slug, ...detailsUpdates } = body;

        // 1. Update invitations table if needed
        if (status || slug) {
            const updates: any = {};
            if (status) updates.status = status;

            // If updating slug, check uniqueness first
            if (slug) {
                const { data: existing } = await supabase
                    .from('invitations')
                    .select('id')
                    .eq('slug', slug)
                    .neq('id', id)
                    .single();

                if (existing) {
                    return NextResponse.json({ data: null, error: { code: 'SLUG_TAKEN', message: 'URL/Slug sudah digunakan.' } }, { status: 409 });
                }
                updates.slug = slug;
            }

            const { error: invError } = await supabase
                .from('invitations')
                .update(updates)
                .eq('id', id)
                .eq('user_id', user.id);

            if (invError) throw invError;
        }

        // 2. Update invitation_details
        if (Object.keys(detailsUpdates).length > 0) {
            // Ensure ownership before updating details (though policy covers it if properly configured)
            const { data: inv } = await supabase.from('invitations').select('id').eq('id', id).eq('user_id', user.id).single();
            if (!inv) return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });

            const { error: detError } = await supabase
                .from('invitation_details')
                .update(detailsUpdates)
                .eq('invitation_id', id);

            if (detError) throw detError;
        }

        return NextResponse.json({ data: { success: true }, error: null });

    } catch (error: any) {
        console.error("[PATCH /api/invitations/[id]] Error:", error);
        return NextResponse.json({ data: null, error: { code: 'INTERNAL', message: 'Gagal memperbarui undangan' } }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const resolvedParams = await params;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = resolvedParams;

        // Soft delete - set status to expired
        const { error } = await supabase
            .from('invitations')
            .update({ status: 'expired' })
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ data: { success: true }, error: null });
    } catch (error: any) {
        console.error("[DELETE /api/invitations/[id]] Error:", error);
        return NextResponse.json({ data: null, error: { code: 'INTERNAL', message: 'Gagal menghapus undangan' } }, { status: 500 });
    }
}
