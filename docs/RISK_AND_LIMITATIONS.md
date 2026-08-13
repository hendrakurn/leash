# Risk and Limitations

Dokumen sumber lengkap tetap tersedia di ../KELEMAHAN_MODEL_B_AI_AGENT_FIAT_AUTHORIZATION.md. Ringkasan berikut adalah batas MVP yang wajib disampaikan.

## Trust Boundary

Leash memberi authorization policy dan audit trail yang dapat diverifikasi. Backend fiat tetap dipercaya untuk mengikuti protokol. MVP tidak mencegah backend jahat memanggil provider pembayaran secara langsung di luar sistem.

## Mocked Components

- fiat settlement;
- BaaS dan virtual-card issuance;
- merchant identity verification;
- natural-language AI interpretation.

## Limitations

- Ini bukan sistem pembayaran production.
- Prompt injection dibatasi dampaknya, bukan diselesaikan sepenuhnya.
- Agent masih dapat membuat keputusan buruk di dalam scope mandat.
- Private key dan session key tetap harus diamankan.
- Payment reference dan event idempotency masih process-local.
- Allowlist merchant disederhanakan menjadi address.
- Amount on-chain tidak menyimpan currency metadata.
- KYC, AML, compliance, dispute, refund, dan chargeback belum ada.
- Gas abstraction, ERC-4337, privacy, dan multichain belum ada.
- Base Sepolia adalah testnet.
- AuthorizationGranted adalah bukti otorisasi, bukan finalitas settlement fiat.

