import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST /api/upload
// Endpoint API lokal untuk development. JANGAN gunakan ini di production
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string;
        const slug = formData.get("slug") as string | null;

        if (!file) {
            return NextResponse.json({ data: null, error: { code: "NO_FILE", message: "File tidak ditemukan" } }, { status: 400 });
        }

        if (!type) {
            return NextResponse.json({ data: null, error: { code: "NO_TYPE", message: "Type upload tidak disertakan" } }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Tentukan folder penyimpanan berdasarkan type dan opsional slug
        let relativePath = type;
        if (type === "invitations" && slug) {
            relativePath = path.join(type, slug);
        } else if (type === "themes") {
            relativePath = path.join(type, "images");
        }

        const publicPath = path.join(process.cwd(), "public", "uploads", relativePath);

        // Ensure directory exists
        await mkdir(publicPath, { recursive: true });

        // Sanitasi nama file dan tambahkan timestamp
        const ext = file.name.substring(file.name.lastIndexOf('.'));
        const safeBaseName = file.name.substring(0, file.name.lastIndexOf('.')).replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
        const filename = `${Date.now()}-${safeBaseName}${ext}`;
        const savePath = path.join(publicPath, filename);

        // Tulis ke filesystem
        await writeFile(savePath, buffer);

        // Return relative URL untuk di-load client - replace Windows separators to URL slashes
        const fileUrl = `/uploads/${relativePath.replace(/\\/g, '/')}/${filename}`;

        return NextResponse.json({ data: { url: fileUrl }, error: null });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ data: null, error: { code: "INTERNAL_ERROR", message: "Gagal mengupload file" } }, { status: 500 });
    }
}
