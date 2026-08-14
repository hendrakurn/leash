# Risk and Limitations

Dokumen sumber lengkap tetap tersedia di ../KELEMAHAN_MODEL_B_AI_AGENT_FIAT_AUTHORIZATION.md. Ringkasan berikut adalah batas MVP yang wajib disampaikan.

## Trust Boundary

Leash memberi authorization policy dan audit trail yang dapat diverifikasi. Backend fiat tetap dipercaya untuk mengikuti protokol. MVP tidak mencegah backend jahat memanggil provider pembayaran secara langsung di luar sistem.

## Mocked Components

- fiat settlement;
- BaaS dan virtual-card issuance;
- merchant identity verification.

`apps/agent` sekarang berisi agen Claude nyata (tool-calling, bukan skrip), jadi natural-language AI interpretation tidak lagi mocked — lihat docs/ARCHITECTURE.md.

## Limitations

- Ini bukan sistem pembayaran production.
- Prompt injection dibatasi dampaknya, bukan diselesaikan sepenuhnya. `apps/agent/src/scenario.ts` mendemonstrasikan agen asli yang benar-benar berhasil dimanipulasi (bukan skrip hardcoded) dan tetap ditolak oleh kontrak.
- Agent masih dapat membuat keputusan buruk di dalam scope mandat.
- `pay_merchant` sengaja tidak melakukan validasi apa pun sebelum memanggil kontrak — ini bukan bug, ini poin produknya. Agen boleh sepenuhnya termanipulasi; kontrak adalah satu-satunya gerbang.
- `ANTHROPIC_API_KEY` adalah kredensial baru yang perlu diamankan, terpisah dari private key dan session key on-chain.
- Transkrip demo agen bergantung pada respons LLM yang non-deterministik — kata-kata persis dapat bervariasi antar-run meski hasil on-chain (revert/authorized) tetap konsisten.
- Private key dan session key tetap harus diamankan.
- Payment reference dan event idempotency masih process-local.
- Allowlist merchant disederhanakan menjadi address.
- Amount on-chain tidak menyimpan currency metadata.
- KYC, AML, compliance, dispute, refund, dan chargeback belum ada.
- Gas abstraction, ERC-4337, privacy, dan multichain belum ada.
- Base Sepolia adalah testnet.
- AuthorizationGranted adalah bukti otorisasi, bukan finalitas settlement fiat.

