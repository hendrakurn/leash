# Kelemahan dan Risiko Model B: On-chain Authorization untuk AI Agent Fiat Spending

## Ringkasan

Model B memisahkan antara **otorisasi pengeluaran** dan **settlement pembayaran**.

- Uang tetap berada di fiat rail: bank, e-wallet, BaaS, atau virtual card provider.
- Blockchain digunakan sebagai enforcement layer untuk mencatat dan memvalidasi mandat pengeluaran AI agent.
- Smart contract mengecek apakah request pembayaran sesuai scope: merchant, amount, expiry, session key, dan revocation status.
- Backend hanya seharusnya melakukan settlement fiat setelah melihat event authorization on-chain.

Ide ini kuat untuk narasi keamanan AI agent, tetapi memiliki beberapa kelemahan penting. Dokumen ini merangkum kekurangan tersebut secara jujur agar positioning, MVP, dan pitch tidak overclaim.

---

## 1. Backend Fiat Tetap Trusted

Ini adalah kelemahan fundamental.

Walaupun smart contract dapat mengeluarkan event seperti `AuthorizationGranted`, pembayaran sebenarnya tetap dilakukan oleh backend melalui BaaS atau virtual card API.

Artinya, secara teknis:

- backend masih bisa memanggil BaaS tanpa event on-chain;
- backend bisa salah melakukan settlement;
- backend bisa mengabaikan smart contract;
- BaaS mungkin hanya percaya pada backend, bukan pada blockchain;
- user tetap harus percaya pada operator aplikasi.

Klaim yang harus dihindari:

> Backend tidak bisa mencuri uang.

Klaim yang lebih akurat:

> Backend yang mengikuti protokol hanya melakukan settlement setelah ada authorization on-chain. Jika backend menyimpang, penyimpangan tersebut dapat diaudit dan dideteksi.

Dengan kata lain, sistem ini memberi:

- auditability;
- verifiable authorization;
- containment logic;
- policy trace.

Tetapi belum memberi:

- full trustlessness;
- cryptographic prevention terhadap backend jahat;
- custody protection setara smart contract escrow.

---

## 2. Blockchain Bisa Terlihat Seperti Tambahan yang Tidak Perlu

Juri, investor, atau reviewer teknis bisa bertanya:

> Kenapa tidak cukup pakai server-side policy engine biasa?

Misalnya backend Web2 bisa saja menyimpan aturan:

```js
if (merchant === allowedMerchant && amount <= maxAmount) {
  issueVirtualCard();
}
```

Secara UX, pendekatan Web2 lebih cepat, murah, dan sederhana.

Agar blockchain tidak terlihat sebagai tempelan, argumen utama harus jelas:

1. policy tidak sepenuhnya dikontrol oleh app backend;
2. user dapat memverifikasi mandat yang pernah diberikan;
3. scope, expiry, dan revocation tercatat di layer independen;
4. pihak ketiga dapat mengaudit apakah settlement memiliki authorization;
5. dalam versi production, BaaS/payment gateway bisa diwajibkan memverifikasi event on-chain sebelum settlement.

Jika argumen ini tidak disampaikan, produk bisa terlihat seperti:

> Web2 payment app with blockchain log.

---

## 3. Integrasi BaaS dan Virtual Card Nyata Sulit

Untuk hackathon, mock BaaS sudah cukup. Namun untuk produk nyata, integrasi payment rail jauh lebih sulit daripada smart contract.

Tantangan utama:

- card issuing membutuhkan lisensi atau partner;
- KYC/AML wajib;
- virtual card API tidak selalu mudah diakses;
- settlement bergantung pada jaringan kartu/payment processor;
- chargeback, refund, dan dispute handling rumit;
- compliance berbeda di tiap negara;
- fraud rules, velocity checks, merchant category controls, dan limit perlu dikelola;
- tidak semua provider mau menerima instruksi dari AI agent.

Kesimpulan:

> Smart contract adalah bagian yang relatif mudah. Payment operations, banking partnership, fraud, dan compliance adalah bagian tersulit untuk production.

---

## 4. UX Wallet Signing Berat untuk Consumer

Flow awal mengharuskan user:

1. memberi instruksi natural language;
2. membaca mandate;
3. menandatangani EIP-712;
4. menunggu agent bekerja;
5. menunggu authorization/settlement.

Untuk crypto-native user, ini masih masuk akal. Untuk consumer umum, terutama use case kecil seperti pesan makan, wallet signing bisa terasa terlalu ribet.

Pertanyaan user awam:

> Kenapa saya harus sign wallet hanya untuk beli burger?

Mitigasi yang mungkin:

- embedded wallet;
- passkey account;
- account abstraction;
- sponsored gas;
- invisible wallet;
- session authorization di app.

Namun semua mitigasi ini menambah kompleksitas implementasi.

Implikasi positioning:

> Target awal sebaiknya bukan casual consumer payment, tetapi teams, DAO, agent platforms, procurement, atau high-risk delegated payments.

---

## 5. Privacy On-chain Buruk

Mandate dan event on-chain bisa membocorkan metadata sensitif:

- user address;
- merchant;
- budget;
- expiry;
- spending pattern;
- waktu transaksi;
- frekuensi pembelian.

Contoh risiko:

> Orang bisa melihat bahwa address tertentu sering membuat mandate untuk merchant tertentu pada jam tertentu dengan limit tertentu.

Mitigasi MVP:

- simpan `merchantIdHash`, bukan nama merchant plain text;
- hash `paymentRef`;
- jangan simpan item atau detail order;
- gunakan integer amount tanpa detail item;
- minimalkan event data.

Mitigasi advanced:

- commit-reveal;
- encrypted metadata;
- private mempool;
- ZK proof;
- TEE;
- private authorization layer.

Catatan:

> Privacy bukan masalah kecil untuk payment authorization. Jangan overexpose data pembelian on-chain.

---

## 6. Merchant Identity Tidak Trivial

Dalam MVP, merchant bisa direpresentasikan sebagai:

```solidity
bytes32 merchantId = keccak256("ROCK_BURGER_TIMOHO");
```

Namun di dunia nyata, merchant identity rumit.

Pertanyaan penting:

- siapa yang menentukan merchant valid?;
- apakah merchant di GoFood sama dengan merchant di GrabFood?;
- bagaimana mencegah merchant spoofing?;
- apakah merchant ID berasal dari payment processor?;
- bagaimana verifikasi domain atau app merchant?;
- bagaimana menangani cabang merchant?;
- bagaimana jika checkout dilakukan melalui aggregator?

Jika merchant identity salah, smart contract bisa mengizinkan atau menolak pembayaran secara keliru.

Production membutuhkan:

- merchant registry;
- mapping ke merchant ID payment processor;
- domain/app verification;
- signed merchant metadata;
- trust model yang jelas untuk registry.

Kelemahan tambahan:

> Jika registry merchant centralized, sebagian trust kembali ke operator registry.

---

## 7. Smart Contract Tidak Memahami Intent Semantik

Smart contract hanya bisa menegakkan constraint eksplisit seperti:

- siapa session key-nya;
- merchant mana;
- amount berapa;
- sampai kapan;
- revoked atau tidak.

Smart contract tidak memahami:

- apakah item sesuai niat user;
- apakah makanan cocok dengan preferensi/alergi user;
- apakah quantity masuk akal;
- apakah alamat pengiriman benar;
- apakah merchant dipilih dengan kualitas baik;
- apakah agent membeli barang yang benar.

Contoh:

User memberi mandat:

> Beli makan siang dari Rock Burger, maksimal Rp60.000.

Agent membeli:

> 20 packs of sauce senilai Rp55.000.

Secara contract, transaksi bisa tetap valid karena merchant dan amount sesuai.

Kesimpulan:

> Smart contract menegakkan hard constraints, bukan semantic correctness.

Mitigasi:

- item-level policy off-chain;
- item allowlist;
- category constraint;
- semantic risk checker;
- human confirmation untuk pembelian ambigu;
- receipt validation setelah checkout.

---

## 8. Prompt Injection Tetap Bisa Merugikan Dalam Scope

Model ini membatasi dampak prompt injection, tetapi tidak menghilangkannya sepenuhnya.

Jika attacker membuat agent melakukan transaksi yang masih berada dalam scope mandate, contract tidak akan menolak.

Contoh mandate:

```text
merchant: Tokopedia
maxAmount: Rp500.000
validUntil: 1 jam
```

Prompt injection membuat agent membeli barang random senilai Rp499.000 dari merchant yang valid.

Contract tetap bisa mengizinkan karena:

- merchant valid;
- amount di bawah cap;
- mandate belum expired.

Klaim yang tepat:

> Sistem ini melakukan containment terhadap prompt injection, bukan prevention total.

---

## 9. Granular Policy vs UX Tradeoff

Policy yang sederhana mudah dipakai tetapi kurang aman.

Contoh policy sederhana:

```text
merchant = Rock Burger
maxAmount = Rp60.000
expiry = 30 menit
```

Kelemahan:

- tidak tahu item;
- tidak tahu kategori;
- tidak tahu delivery address;
- tidak tahu service fee;
- tidak tahu apakah order sesuai intent.

Policy yang detail lebih aman:

```text
merchant = Rock Burger
maxAmount = Rp60.000
category = food
allowedItems = burger, rice, chicken
forbiddenItems = alcohol
maxDeliveryFee = Rp15.000
deliveryAddressHash = 0x...
expiry = 30 menit
```

Namun UX menjadi berat karena user harus membaca dan menyetujui terlalu banyak parameter.

Tradeoff utama:

> Semakin aman policy, semakin berat UX. Semakin ringan UX, semakin besar area risiko.

---

## 10. Gas Fee dan Latency Bisa Mengganggu

Jika setiap mandate atau authorization membutuhkan transaksi on-chain, user akan menghadapi:

- gas fee;
- confirmation delay;
- RPC failure;
- chain congestion;
- event indexing delay;
- kebutuhan wallet interaction.

Untuk use case kecil seperti pesan makan, menunggu block confirmation bisa terasa tidak natural.

Mitigasi:

- gunakan L2 murah;
- sponsored gas/paymaster;
- account abstraction;
- pre-register mandate;
- batch authorization;
- gunakan event confirmation minimal untuk demo;
- backend menunggu 1 block atau finality threshold ringan.

Tetapi mitigasi ini menambah moving parts.

---

## 11. Refund, Cancellation, dan Partial Capture Belum Jelas

Payment nyata jarang linear.

Flow ideal:

```text
authorized -> settled -> completed
```

Namun realita bisa berupa:

- order gagal;
- merchant cancel;
- item out of stock;
- refund sebagian;
- delivery fee berubah;
- tax berubah;
- promo gagal;
- card pre-authorization;
- final capture berbeda dari authorization;
- tip tambahan;
- repeated authorization.

Model contract perlu memikirkan state tambahan:

- `Authorized`;
- `VccIssued`;
- `Captured`;
- `PartiallyCaptured`;
- `Refunded`;
- `Failed`;
- `Expired`.

Untuk MVP, settlement bisa disederhanakan. Untuk production, payment lifecycle harus ditangani dengan serius.

---

## 12. Currency dan Amount Representation

Karena uang tetap fiat, contract hanya menyimpan angka yang merepresentasikan nilai fiat.

Masalah yang perlu dipikirkan:

- currency code apa yang dipakai?;
- apakah amount memakai minor unit?;
- IDR tidak umum dipakai dengan sen dalam consumer UX;
- apakah cap termasuk delivery fee, tax, platform fee?;
- bagaimana jika final amount sedikit berubah?;
- bagaimana menangani multi-currency?;
- apakah butuh FX/oracle jika user dan merchant beda mata uang?

MVP sederhana:

```text
currency = IDR
amount = integer rupiah
```

Production lebih rapi:

```solidity
bytes3 currencyCode; // e.g. IDR, USD
uint256 amountMinor;
```

Namun untuk multi-currency, complexity naik signifikan.

---

## 13. Authorization Event Bukan Settlement Final

Event `AuthorizationGranted` hanya berarti:

> Payment request valid menurut policy smart contract.

Event tersebut tidak membuktikan bahwa:

- virtual card berhasil dibuat;
- merchant berhasil di-charge;
- bank settlement final;
- order berhasil dibuat;
- barang akan dikirim;
- refund/dispute tidak akan terjadi.

UI harus memisahkan state:

1. on-chain authorization granted;
2. virtual card issued;
3. merchant charged;
4. order confirmed;
5. settlement completed.

Hindari menampilkan:

> Payment successful

langsung setelah event on-chain.

Lebih akurat:

> Payment authorized on-chain. Awaiting fiat settlement.

---

## 14. EIP-712 Tidak Menjamin User Paham

EIP-712 membantu membuat signature lebih readable, tetapi user tetap bisa asal klik.

Risiko:

- user tidak membaca detail;
- phishing UI meniru mandate screen;
- wallet tidak menampilkan field dengan jelas;
- signing fatigue;
- domain/chain mismatch;
- user tidak memahami konsekuensi session key.

Mitigasi:

- mandate preview yang human-readable di app;
- highlight amount, merchant, expiry;
- risk warning untuk mandate luas;
- revoke button jelas;
- notification setelah tiap authorization;
- safe defaults: short expiry, low cap, narrow merchant scope.

---

## 15. Smart Contract Scope Bisa Terlihat Terlalu Sederhana

Jika demo hanya menunjukkan:

```text
register mandate -> check amount -> emit event
```

maka juri bisa merasa penggunaan smart contract terlalu tipis.

Demo harus menunjukkan value yang jelas:

1. normal checkout berhasil;
2. prompt injection mencoba overspend;
3. prompt injection mencoba merchant tidak valid;
4. contract menolak;
5. user bisa revoke mandate;
6. audit trail menunjukkan authorization dan blocked attempts.

Tanpa attack demo, ide ini terlihat seperti policy registry biasa.

---

## 16. Narasi Autonomy Bisa Berisiko Secara Regulasi

Hindari positioning seperti:

- AI controls your money;
- autonomous money manager;
- self-spending AI;
- agent with bank access;
- fully autonomous finance.

Narasi ini bisa menimbulkan kekhawatiran compliance.

Gunakan narasi yang lebih aman:

- bounded delegated spending;
- user-approved mandate;
- scoped authorization;
- payment firewall;
- agent can request payment, not freely spend;
- settlement only after policy check.

---

## 17. Model Bisnis Consumer Belum Kuat

Untuk consumer casual payment, kelemahannya:

- transaksi kecil;
- wallet signing terlalu berat;
- user mungkin tidak mau membayar subscription;
- Web2 virtual card sudah cukup untuk banyak kasus;
- payment company besar bisa meniru fitur limit/approval.

Target yang lebih kuat:

- teams dan perusahaan kecil;
- DAO treasury;
- procurement workflows;
- AI agent platforms;
- B2B spend management;
- high-risk delegated payments;
- family/child spending control.

Rekomendasi:

> Gunakan contoh pesan makan untuk demo, tetapi positioning produk sebaiknya ke AI spend control untuk teams, DAO, dan agent platforms.

---

## 18. Kompetisi dari Web2 Spend Management

Produk Web2 seperti corporate card dan spend management platform sudah memiliki:

- virtual cards;
- merchant/category controls;
- spending limits;
- approval workflows;
- audit logs;
- fraud detection;
- subscription controls.

Pertanyaan yang perlu dijawab:

> Apa yang blockchain tambahkan yang Ramp, Brex, Airwallex, Stripe Issuing, atau platform sejenis tidak bisa lakukan?

Jawaban potensial:

- third-party verifiable mandate;
- user-owned authorization registry;
- composable policy across multiple agents/apps;
- public dispute reference;
- non-app-controlled audit trail;
- future integration where payment providers verify on-chain proof before settlement.

Jika jawaban ini tidak kuat, produk bisa dianggap kalah sederhana dari Web2.

---

## 19. Banyak Trust Boundary di Production

Sistem production melibatkan banyak pihak:

- user;
- wallet provider;
- app frontend;
- app backend;
- AI agent runtime;
- merchant;
- BaaS provider;
- card issuer;
- payment network;
- blockchain RPC;
- indexer/listener;
- merchant registry;
- compliance provider.

Setiap pihak menambah risiko:

- downtime;
- data mismatch;
- race condition;
- fraud;
- misconfiguration;
- compliance failure;
- privacy leak.

MVP boleh sederhana, tetapi roadmap production harus mengakui kompleksitas ini.

---

## 20. Risiko Audit Setelah Kerugian

Jika backend atau payment rail melakukan pembayaran tanpa authorization, blockchain hanya bisa membuktikan bahwa:

> Tidak ada authorization yang cocok.

Tetapi jika uang sudah keluar, user tetap harus melalui proses dispute/refund.

Jadi sistem ini kuat sebagai prevention hanya jika payment provider/BaaS ikut menegakkan aturan.

Jika enforcement hanya dilakukan oleh backend aplikasi, maka blockchain lebih berperan sebagai detection dan audit layer.

Formulasi yang tepat:

> Prevention penuh membutuhkan payment rail yang memverifikasi on-chain authorization sebelum settlement. Tanpa itu, sistem terutama memberikan auditability dan accountability.

---

## Kesimpulan Jujur

Kelemahan utama Model B:

1. backend fiat tetap trusted;
2. blockchain bisa terlihat seperti audit log tambahan;
3. BaaS/VCC production integration sulit;
4. wallet signing berat untuk consumer;
5. privacy on-chain buruk;
6. merchant identity rumit;
7. smart contract tidak memahami intent semantik;
8. prompt injection tetap bisa merugikan dalam scope;
9. policy detail berkonflik dengan UX;
10. gas fee dan latency bisa mengganggu;
11. refund/cancellation/payment lifecycle belum jelas;
12. authorization event bukan settlement final;
13. model bisnis consumer belum kuat;
14. kompetisi Web2 spend management sudah matang.

Namun ide tetap kuat jika diposisikan dengan benar:

> Model B bukan membuat fiat payment sepenuhnya trustless. Model B adalah bounded authorization dan audit layer untuk AI-initiated fiat payments.

Positioning paling defensible:

> AI Agent Spend Authorization Layer — a programmable spending firewall for AI agents using fiat rails.

Target awal paling masuk akal:

- teams;
- DAO treasuries;
- AI agent platforms;
- procurement workflows;
- high-risk delegated payments.

Use case consumer seperti pesan makan sebaiknya digunakan sebagai demo sederhana, bukan sebagai positioning bisnis utama.

---

## Implikasi untuk MVP

MVP harus fokus membuktikan satu thesis:

> AI agent tidak bisa melakukan pembayaran di luar mandat user, bahkan jika agent mencoba overspend atau terkena prompt injection.

Demo minimal yang disarankan:

1. user membuat mandate terbatas;
2. valid checkout berhasil;
3. event `AuthorizationGranted` muncul;
4. mock BaaS melakukan settlement;
5. prompt injection mencoba merchant/amount tidak valid;
6. contract reject;
7. user melihat audit trail dan dapat revoke mandate.

Jangan membangun terlalu awal:

- real BaaS;
- real virtual card;
- autonomous browser agent penuh;
- multi-chain;
- ZK privacy;
- complex merchant registry;
- production compliance flow.

Bangun dahulu:

- contract enforcement;
- tests untuk failure cases;
- simple frontend;
- mock agent;
- mock settlement;
- attack demo.
