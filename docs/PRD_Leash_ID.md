# PRD Leash

Dokumen ini diturunkan dari LEASH_IMPLEMENTATION_PLAN.md dan CODEX_HERMES_IMPLEMENTATION_PROMPT.md karena tidak ada PRD Leash independen di repository awal.

## Ringkasan

Leash adalah lapisan otorisasi pengeluaran on-chain untuk AI agent. Uang tetap berada di fiat rail; smart contract menyimpan dan menegakkan mandat yang disetujui pengguna.

## Masalah

AI agent yang dapat membayar bisa dimanipulasi untuk membayar merchant yang salah, melewati batas pengeluaran, menggunakan session key tanpa scope, atau terus membayar setelah izin dicabut.

## Pengguna Awal

- pengguna yang mendelegasikan pembelian terbatas kepada AI agent;
- tim pembayaran atau BaaS yang membutuhkan bukti otorisasi terverifikasi;
- reviewer hackathon Track 1: Payments and Financial Infrastructure.

## P0

1. Registry mandat dengan owner dan session key.
2. Allowlist target.
3. Batas pengeluaran kumulatif.
4. Expiry dan revocation.
5. AuthorizationGranted hanya untuk request valid.
6. Foundry tests untuk failure cases.
7. Attack demo.
8. Mock settlement hanya sesudah event valid.

## P1

1. CLI demo deterministik.
2. Confirmed-event listener.
3. Base Sepolia deployment jika credential tersedia.
4. Telegram demo interface.
5. Dokumentasi submission.

## Demo Utama

- cap: 60.000 unit;
- target valid: Rock Burger;
- pembayaran valid: 52.000;
- Evil Store ditolak;
- pembayaran 500.000 ditolak;
- setelah revocation, pembayaran berikutnya ditolak;
- hanya satu mock settlement dibuat.

## Non-goals

Real BaaS, pergerakan fiat atau token, browser agent otonom, paymaster, ERC-4337, ZK authorization, production merchant registry, compliance, dan multichain.

## Success Criteria

Semua tests lulus, attack receipt berstatus reverted tanpa AuthorizationGranted, spentAmount tidak berubah pada request invalid, dan listener menghasilkan tepat satu settlement pada skenario default.

