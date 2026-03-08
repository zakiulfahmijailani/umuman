import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

// GET /api/invitations
export async function GET(request: Request) {
    const supabase = await createClient()

    if (!supabase) {
        return NextResponse.json(
            { data: null, error: { code: 'DATABASE_ERROR', message: 'Database client not initialized.' } },
            { status: 500 }
        )
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json(
            { data: null, error: { code: 'UNAUTHORIZED', message: 'Silakan login terlebih dahulu.' } },
            { status: 401 }
        )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
        .from('invitations')
        .select(`
            id as invitation_id, 
            slug, 
            status, 
            theme_id, 
            created_at, 
            updated_at,
            themes (name, category, thumbnails_url),
            rsvp:rsvp(count),
            guestbook:guestbook(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (status) {
        query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json(
            { data: null, error: { code: 'FETCH_ERROR', message: 'Gagal mengambil undangan.', details: error } },
            { status: 400 }
        )
    }

    // Format response matching API contract
    const formattedData = data.map((inv: any) => ({
        invitation_id: inv.invitation_id,
        slug: inv.slug,
        title: "Undangan Pernikahan", // Mock title for now, ideally derived from groom/bride names
        status: inv.status,
        theme_id: inv.theme_id,
        theme: inv.themes,
        view_count: 0,
        rsvp_count: inv.rsvp?.[0]?.count || 0,
        message_count: inv.guestbook?.[0]?.count || 0,
        created_at: inv.created_at,
        updated_at: inv.updated_at
    }))

    return NextResponse.json({
        data: {
            items: formattedData,
            pagination: { total: formattedData.length, page: 1, limit: 50, total_pages: 1 }
        },
        error: null
    })
}

// POST /api/invitations
import { z } from 'zod'

const createInvitationSchema = z.object({
    groom_name: z.string().min(1).max(100),
    bride_name: z.string().min(1).max(100),
})

export async function POST(request: Request) {
    const supabase = await createClient()

    if (!supabase) {
        return NextResponse.json(
            { data: null, error: { code: 'DATABASE_ERROR', message: 'Database client not initialized.' } },
            { status: 500 }
        )
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json(
            { data: null, error: { code: 'UNAUTHORIZED', message: 'Sesi Anda telah habis. Silakan login kembali.' } },
            { status: 401 }
        )
    }

    try {
        const body = await request.json()
        const parsed = createInvitationSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { data: null, error: { code: 'VALIDATION_ERROR', message: 'Data tidak valid.', details: parsed.error.flatten().fieldErrors } },
                { status: 400 }
            )
        }

        const { groom_name, bride_name } = parsed.data

        // Generate slug
        const cleanStr = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
        const baseSlug = `${cleanStr(groom_name)}-dan-${cleanStr(bride_name)}`

        let finalSlug = `${baseSlug}-${uuidv4().substring(0, 4)}`

        // Check uniqueness and retry once if needed (Supabase constraint will handle final check)
        const { count } = await supabase.from('invitations').select('*', { count: 'exact', head: true }).eq('slug', finalSlug)
        if (count && count > 0) {
            finalSlug = `${baseSlug}-${uuidv4().substring(0, 6)}`
        }

        // 1. Insert into invitations
        const { data: invitation, error: invError } = await supabase
            .from('invitations')
            .insert({
                user_id: user.id,
                slug: finalSlug,
                status: 'unpaid'
            })
            .select()
            .single()

        if (invError) {
            if (invError.code === '23505') {
                return NextResponse.json(
                    { data: null, error: { code: 'SLUG_ALREADY_TAKEN', message: 'Kombinasi url/nama sedang digunakan, silakan coba lagi.' } },
                    { status: 409 }
                )
            }
            throw invError
        }

        // 2. Insert into invitation_details
        const { error: detailsError } = await supabase
            .from('invitation_details')
            .insert({
                invitation_id: invitation.id,
                groom_name: groom_name,
                bride_name: bride_name
            })

        if (detailsError) {
            // Rollback (best effort cleanup)
            await supabase.from('invitations').delete().eq('id', invitation.id)
            throw detailsError
        }

        return NextResponse.json(
            {
                data: {
                    id: invitation.id,
                    slug: invitation.slug
                },
                error: null
            },
            { status: 201 }
        )

    } catch (error: any) {
        console.error("[POST /api/invitations] Error:", error)
        return NextResponse.json(
            { data: null, error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan saat memproses permintaan.', details: error.message } },
            { status: 500 }
        )
    }
}
