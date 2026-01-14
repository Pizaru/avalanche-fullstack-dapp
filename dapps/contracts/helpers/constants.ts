import "dotenv/config";

export const ETHERSCAN_API = process.env.ETHERSCAN_API_KEY || "";
export const USER_PRIVATE_KEY = process.env.PRIVATE_KEY || "0x00000000000000000000000000000000000";
export const RPC_URL = process.env.RPC_URL || "";
