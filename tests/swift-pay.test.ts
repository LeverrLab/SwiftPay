
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet_1 = accounts.get("wallet_1")!;

describe("SwiftPay Protocol Lifecycle", () => {

  it("should handle a full stream lifecycle: create -> earned -> withdraw -> cancel", () => {
    const engineAddress = `${deployer}.swift-pay`;

    // 1. Setup engine
    simnet.callPublicFn("swift-pay-nft", "set-engine", [Cl.principal(engineAddress)], deployer);

    // 2. Create stream
    const amount = 1000000;
    const start = simnet.blockHeight + 10;
    const stop = start + 100;

    simnet.callPublicFn("swift-pay", "create-stx-stream", [Cl.principal(wallet_1), Cl.uint(amount), Cl.uint(start), Cl.uint(stop)], deployer);

    // 3. Advancing blocks
    simnet.mineEmptyBlocks(100);

    const earnedResponse = simnet.callReadOnlyFn("swift-pay", "calculate-earned", [Cl.uint(0)], deployer);
    const earnedValue = (earnedResponse.result as any).value;

    // 4. Withdrawal
    let withdraw = simnet.callPublicFn("swift-pay", "withdraw", [Cl.uint(0), Cl.none()], wallet_1);
    expect(withdraw.result).toBeOk(earnedValue);

    // 5. Cancel stream
    let cancel = simnet.callPublicFn("swift-pay", "cancel", [Cl.uint(0), Cl.none()], deployer);
    expect(cancel.result).toBeOk(Cl.bool(true));

    // 6. NFT burned
    let nftOwnerAfter = simnet.callReadOnlyFn("swift-pay-nft", "get-owner", [Cl.uint(0)], deployer);
    expect(nftOwnerAfter.result).toBeOk(Cl.none());
  });

});
