import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditorClient from "./EditorClient";

export default async function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    let invitationData: any = {};

    if (!supabaseUrl) {
        invitationData = {
            id: id,
            slug: 'demo',
            status: 'active',
            created_at: new Date().toISOString(),
            invitation_details: {
                groom_name: "Budi",
                bride_name: "Ayu",
                akad_date: "2026-06-15T08:00:00",
                reception_date: "2026-06-15T11:00:00",
                groom_father: "Bpk. Santoso",
                bride_father: "Bpk. Hendro",
                // add other minimal realistic stubs if needed for the Editor form
            }
        }
    } else {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            redirect("/login");
        }

        // Fetch Invitation Details
        const { data: invitation, error } = await supabase
            .from('invitations')
            .select(`
                id, slug, status, created_at,
                invitation_details(*)
            `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error || !invitation) {
            redirect("/dashboard");
        }

        invitationData = invitation;
    }

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <EditorClient initialData={invitationData} />
        </div>
    );
}
