"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { activeChain } from "@/lib/chain";
import { shortHex } from "@/lib/leash";
import { Button } from "./primitives";

export function WalletButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const injected = connectors[0];
  const wrongChain = isConnected && chainId !== activeChain.id;

  if (wrongChain) {
    return (
      <Button variant="danger" onClick={() => switchChain({ chainId: activeChain.id })}>
        Switch to {activeChain.name}
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="border px-4 py-2 font-mono text-xs transition-colors duration-150 hover:bg-[var(--hair)]"
        title="Disconnect"
      >
        {shortHex(address)}
      </button>
    );
  }

  if (!injected) {
    return (
      <span className="mono-label" title="No injected wallet detected in this browser">
        No wallet found
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button onClick={() => connect({ connector: injected })} disabled={isPending}>
        {isPending ? "Connecting…" : "Connect wallet"}
      </Button>
      {error ? (
        <span className="font-mono text-[0.65rem]" style={{ color: "var(--refuse)" }}>
          {error.message.slice(0, 64)}
        </span>
      ) : null}
    </div>
  );
}
