const connectBtn = document.getElementById("connectBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const networkWarningEl = document.getElementById("networkWarning");

const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

let isConnected = false;
let currentAddress = null;

/* ================= UTIL ================= */
function shortAddress(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function formatBalance(hex) {
  return (parseInt(hex, 16) / 1e18).toFixed(4);
}

/* ================= UI ================= */
function showNetworkWarning() {
  networkWarningEl.classList.remove("hidden");
}

function hideNetworkWarning() {
  networkWarningEl.classList.add("hidden");
}

function resetUI() {
  isConnected = false;
  currentAddress = null;

  statusEl.textContent = "Not Connected";
  statusEl.style.color = "#ffffff";
  addressEl.textContent = "-";
  networkEl.textContent = "-";
  balanceEl.textContent = "-";

  connectBtn.textContent = "Connect Wallet";
  hideNetworkWarning();
}


async function switchToFuji() {
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: AVALANCHE_FUJI_CHAIN_ID }],
    });
  } catch (err) {
    if (err.code === 4902) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: AVALANCHE_FUJI_CHAIN_ID,
            chainName: "Avalanche Fuji Testnet",
            nativeCurrency: {
              name: "AVAX",
              symbol: "AVAX",
              decimals: 18,
            },
            rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
            blockExplorerUrls: ["https://testnet.snowtrace.io"],
          },
        ],
      });
    }
  }
}


async function handleButtonClick() {
  if (!window.ethereum) {
    alert("Wallet not detected");
    return;
  }

 
  if (!isConnected) {
    try {
      statusEl.textContent = "Connecting...";

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        resetUI();
        return;
      }

      currentAddress = accounts[0];
      isConnected = true;
      addressEl.textContent = currentAddress;

      const chainId = await ethereum.request({ method: "eth_chainId" });

      if (chainId !== AVALANCHE_FUJI_CHAIN_ID) {
        statusEl.textContent = "Wrong Network ❌";
        statusEl.style.color = "#fbc531";
        networkEl.textContent = "Unsupported";
        balanceEl.textContent = "-";
        connectBtn.textContent = "Switch to Avalanche Fuji";
        showNetworkWarning();
        return;
      }

      hideNetworkWarning();
      networkEl.textContent = "Avalanche Fuji Testnet";
      statusEl.textContent = "Connected ✅";
      statusEl.style.color = "#4cd137";
      connectBtn.textContent = `Disconnect (${shortAddress(currentAddress)})`;

      const balanceWei = await ethereum.request({
        method: "eth_getBalance",
        params: [currentAddress, "latest"],
      });

      balanceEl.textContent = formatBalance(balanceWei);
    } catch (err) {
      console.error(err);
      resetUI();
    }
    return;
  }


  const chainId = await ethereum.request({ method: "eth_chainId" });

  if (chainId !== AVALANCHE_FUJI_CHAIN_ID) {
    await switchToFuji();
    return;
  }

 
  resetUI();
}

/* ================= EVENTS ================= */
connectBtn.addEventListener("click", handleButtonClick);

if (window.ethereum) {

  ethereum.on("accountsChanged", (accounts) => {
    if (!accounts || accounts.length === 0) {
      resetUI();
      return;
    }

    isConnected = false;
    currentAddress = null;

    statusEl.textContent = "Wrong Account ❌";
    statusEl.style.color = "#fbc531";
    addressEl.textContent = "-";
    balanceEl.textContent = "-";
    connectBtn.textContent = "Wrong Account – Click to Reconnect";
  });

  ethereum.on("chainChanged", async (chainId) => {
    if (!isConnected || !currentAddress) return;

    if (chainId !== AVALANCHE_FUJI_CHAIN_ID) {
      statusEl.textContent = "Wrong Network ❌";
      statusEl.style.color = "#fbc531";
      networkEl.textContent = "Unsupported";
      balanceEl.textContent = "-";
      connectBtn.textContent = "Switch to Avalanche Fuji";
      showNetworkWarning();
      return;
    }

    hideNetworkWarning();
    networkEl.textContent = "Avalanche Fuji Testnet";
    statusEl.textContent = "Connected ✅";
    statusEl.style.color = "#4cd137";
    connectBtn.textContent = `Disconnect (${shortAddress(currentAddress)})`;

    const balanceWei = await ethereum.request({
      method: "eth_getBalance",
      params: [currentAddress, "latest"],
    });

    balanceEl.textContent = formatBalance(balanceWei);
  });
}
