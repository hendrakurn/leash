import assert from "node:assert/strict";
import test from "node:test";

import { type Address, type Hex } from "viem";
import {
  MockBaasSettlementProcessor,
  type AuthorizationEvent,
} from "./mockBaas.js";

const baseEvent: AuthorizationEvent = {
  chainId: 31_337,
  contractAddress: "0x1000000000000000000000000000000000000001" as Address,
  mandateId:
    "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as Hex,
  sessionKey: "0x2000000000000000000000000000000000000002" as Address,
  target: "0x3000000000000000000000000000000000000003" as Address,
  amount: 52_000n,
  paymentRef:
    "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" as Hex,
  transactionHash:
    "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc" as Hex,
  logIndex: 0,
};

test("first confirmed authorization settles exactly once", () => {
  const messages: string[] = [];
  const processor = new MockBaasSettlementProcessor((message) => messages.push(message));

  assert.equal(processor.process(baseEvent), "settled");
  assert.equal(processor.settlementCount, 1);
  assert.ok(messages.includes("AuthorizationGranted detected"));
  assert.ok(messages.includes("Amount: Rp52.000"));
});

test("replaying the same event is idempotent", () => {
  const processor = new MockBaasSettlementProcessor(() => undefined);

  assert.equal(processor.process(baseEvent), "settled");
  assert.equal(processor.process(baseEvent), "duplicate-event");
  assert.equal(processor.settlementCount, 1);
});

test("same payment reference in another event is idempotent", () => {
  const processor = new MockBaasSettlementProcessor(() => undefined);
  const anotherEvent: AuthorizationEvent = {
    ...baseEvent,
    transactionHash:
      "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd" as Hex,
    logIndex: 1,
  };

  assert.equal(processor.process(baseEvent), "settled");
  assert.equal(
    processor.process(anotherEvent),
    "duplicate-payment-reference",
  );
  assert.equal(processor.settlementCount, 1);
});

test("different payment reference may settle independently", () => {
  const processor = new MockBaasSettlementProcessor(() => undefined);
  const anotherEvent: AuthorizationEvent = {
    ...baseEvent,
    transactionHash:
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" as Hex,
    paymentRef:
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" as Hex,
    logIndex: 1,
  };

  assert.equal(processor.process(baseEvent), "settled");
  assert.equal(processor.process(anotherEvent), "settled");
  assert.equal(processor.settlementCount, 2);
});

test("processor exposes only event-based settlement input", () => {
  const methods = Object.getOwnPropertyNames(
    MockBaasSettlementProcessor.prototype,
  ).sort();

  assert.deepEqual(methods, ["constructor", "process", "settlementCount"]);
});

