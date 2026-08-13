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

