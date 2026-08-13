# Leash Demo Script

## Opening

AI agents can now initiate payments, but prompt injection and excessive delegation can turn convenience into an uncontrolled spending risk. Leash gives the agent a user-approved, on-chain spending boundary.

## Demo Sequence

1. Explain the thesis: Leash does not put fiat on-chain. It puts spending authority on-chain.
2. Start the listener or use the deterministic local script.
3. Create a mandate:
   - target: Rock Burger;
   - cumulative cap: 60,000;
   - owner and session key: different addresses;
   - expiry: one hour.
4. Send 52,000 to Rock Burger.
5. Show the successful receipt and exactly one AuthorizationGranted.
6. Read spentAmount and show 52,000 with 8,000 remaining.
7. Simulate prompt injection directing the agent to Evil Store.
8. Show TargetNotAllowed, a reverted receipt, zero authorization logs, and unchanged spentAmount.
9. Attempt 500,000 to Rock Burger.
10. Show AmountExceedsCap, a reverted receipt, zero authorization logs, and unchanged spentAmount.
11. Show the backend output:

~~~text
AuthorizationGranted detected
Issuing mock VCC
Amount: Rp52.000
Mock card: **** **** **** 4242
Settlement status: SUCCESS
~~~

12. Emphasize that the backend found one authorization event and issued exactly one mock settlement.
13. Revoke the mandate.
14. Attempt another otherwise valid Rock Burger payment.
15. Show Revoked, a reverted receipt, and no settlement.

## Evidence Checklist

- valid transaction status: success;
- invalid-target status: reverted;
- over-cap status: reverted;
- post-revocation status: reverted;
- attack AuthorizationGranted logs: zero;
- final spent amount: 52,000;
- total mock settlements: one.

## Closing

> Money stays in fiat rails. Spending authority is enforced on-chain.



## Hosted Telegram Demo

The hosted demo keeps wallet and infrastructure details with the Leash operator. A user only opens the Telegram bot and sends commands or natural chat. The bot uses a managed testnet owner account to create/revoke mandates and a different managed testnet session key to request payments. Both keys are demo-only and must never be used with mainnet funds.

Natural chat examples:

~~~text
belikan burger 52 ribu
bayar rock burger 52000
bayar evil store 50000
bayar rock burger 500000
cek status
batalkan mandate
carikan burger murah dan bayar kalau aman
buka halaman promo burger
~~~

The first, fifth, and sixth messages map to the same on-chain actions as `/normal`, `/status`, and `/revoke`, respectively. The browsing messages are deterministic simulations: the cheap-burger catalog returns Rock Burger at Rp52.000, while the promo page intentionally redirects to Evil Store at Rp50.000 to demonstrate prompt-injection containment.

Run the backend listener in one terminal and the Telegram bot in another. After `/mandate_food`, only the valid Rock Burger authorization should produce a backend mock settlement. Target, cap, and post-revocation failures must print a rejection and remain ineligible for settlement.
