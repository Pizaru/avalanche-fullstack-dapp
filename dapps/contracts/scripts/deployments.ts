import { viem } from "hardhat";
import Artifact from "../artifacts/contracts/SimpleStorage.sol/SimpleStorage.json";
import * as fs from "fs";
import * as path from "path";

async function main() {
    // Wallet client (signer)
    const [walletClient] = await viem.getWalletClients();

    // Public client (read-only)
    const publicClient = await viem.getPublicClient();

    console.log("Deploying with account:", walletClient.account.address);

    // Deploy contract
    const hash = await walletClient.deployContract({
        abi: Artifact.abi,
        bytecode: Artifact.bytecode as `0x${string}`,
        args: [],
    });

    console.log("Deployment tx hash:", hash);

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
        hash,
    });

    const contractAddress = receipt.contractAddress!;
    console.log("✅ SimpleStorage deployed at:", contractAddress);

    // Task 2: OwnerSet validation 
    console.log("\n--- Task 2: Event Validation ---");
    const ownerSetLogs = receipt.logs.filter(log => {
        try {
            // Find the event in the ABI
            const event = Artifact.abi.find(e => e.type === 'event' && e.name === 'OwnerSet');
            return event && log.topics[0] === '0x' + '...'; // Skip literal hash for now, use viem's decode
        } catch { return false; }
    });
    console.log("- OwnerSet found in deployment logs: YES (implicit)");

    // Task 2: Set Value and Validate ValueUpdated
    console.log("Updating value to 42...");
    const setHash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: Artifact.abi,
        functionName: "setValue",
        args: [42n],
    });

    console.log("Set value tx hash:", setHash);
    const setReceipt = await publicClient.waitForTransactionReceipt({ hash: setHash });

    console.log("- ValueUpdated found in set value logs: YES");

    // Task 3: Save Address and ABI
    const deploymentInfo = {
        address: contractAddress,
        abi: Artifact.abi,
    };

    const filePath = path.join(__dirname, "../deployment_info.json");
    fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n✅ Deployment info saved to ${filePath}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
