---
name: integrating-lovable-repo
description: Integrates newly generated Lovable repository code into the main umuman repo. Use when the user says "integrasikan joy_knot", "ada repo baru dari Lovable", "merge dari joy_knot", "integrasikan hasil Lovable", or asks to copy/merge code from a separate source repo into umuman. Always read AGENTS.md first before doing anything.
---

# Integrating Lovable Repo → Umuman

## Pre-flight checklist
Copy and track:
- [ ] Baca AGENTS.md di root umuman
- [ ] Audit repo sumber (lihat AUDIT.md)
- [ ] Tentukan file mana yang diintegrasikan
- [ ] Tentukan file mana yang di-skip
- [ ] Selesaikan adaptasi stack (lihat ADAPTATION.md)
- [ ] Jalankan `npm run build` di umuman
- [ ] Verifikasi halaman existing tidak rusak

## Workspace paths
- Repo utama: `C:\project_umuman\umuman`
- Repo sumber: `C:\project_umuman\joy_knot`
- Skills dir: `.claude/skills/`

## Step 1 — Baca AGENTS.md
```bash
cat C:\project_umuman\umuman\AGENTS.md
