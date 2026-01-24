
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { StacksTestnet } from "@stacks/network";
import {
    AnchorMode,
    PostConditionMode,
    uintCV,
    principalCV,
    noneCV
} from "@stacks/transactions";

const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });
export const network = new StacksTestnet();

export const CONTRACT_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
export const ENGINE_CONTRACT = "swift-pay";
export const NFT_CONTRACT = "swift-pay-nft";

export const authenticate = () => {
    showConnect({
        appDetails: {
            name: "SwiftPay",
            icon: "/logo.png",
        },
        onFinish: () => {
            window.location.reload();
        },
        userSession,
    });
};

export const logout = () => {
    userSession.signUserOut();
    window.location.reload();
};
