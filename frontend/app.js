// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// Deployed Guestbook on Base Sepolia (chainId 84532).
// https://sepolia.basescan.org/address/0x0352f75eEcc8316c194d38FB4F1526bf9f674c30
const CONTRACT_ADDRESS = "0x0352f75eEcc8316c194d38FB4F1526bf9f674c30";

// Minimal ABI — only the bits the frontend uses.
const ABI = [
  "function sign(string message) external",
  "function total() view returns (uint256)",
  "function getMessages() view returns (tuple(address signer, string message, uint256 timestamp)[])",
  "event Signed(address indexed signer, string message, uint256 timestamp)",
];

// Base Sepolia testnet.
const TARGET_CHAIN = {
  chainIdHex: "0x14a34", // 84532
  chainName: "Base Sepolia",
  rpcUrls: ["https://sepolia.base.org"],
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  blockExplorerUrls: ["https://sepolia.basescan.org"],
};

// ---------------------------------------------------------------------------
// State + element refs
// ---------------------------------------------------------------------------

let provider; // ethers BrowserProvider
let signer; // current signer
let contract; // contract bound to signer

const els = {
  connectBtn: document.getElementById("connectBtn"),
  account: document.getElementById("account"),
  messageInput: document.getElementById("messageInput"),
  charCount: document.getElementById("charCount"),
  signBtn: document.getElementById("signBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  status: document.getElementById("status"),
  total: document.getElementById("total"),
  messages: document.getElementById("messages"),
  emptyState: document.getElementById("emptyState"),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setStatus(text, kind = "") {
  els.status.textContent = text;
  els.status.className = "status" + (kind ? " " + kind : "");
}

function short(address) {
  return address.slice(0, 6) + "…" + address.slice(-4);
}

function formatTime(unixSeconds) {
  return new Date(Number(unixSeconds) * 1000).toLocaleString();
}

function ensureConfigured() {
  if (!CONTRACT_ADDRESS) {
    setStatus(
      "No contract address set. Deploy first, then paste it into app.js (CONTRACT_ADDRESS).",
      "error"
    );
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Wallet
// ---------------------------------------------------------------------------

async function connect() {
  if (!window.ethereum) {
    setStatus("No wallet found. Install MetaMask or Coinbase Wallet.", "error");
    return;
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    const address = await signer.getAddress();

    els.account.textContent = "Connected: " + short(address);
    els.account.classList.remove("hidden");
    els.connectBtn.textContent = "Connected";

    if (ensureConfigured()) {
      contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      els.messageInput.disabled = false;
      els.signBtn.disabled = false;
      els.refreshBtn.disabled = false;
      await loadMessages();
      subscribe();
    }
  } catch (err) {
    setStatus(err.shortMessage || err.message || "Failed to connect.", "error");
  }
}

// ---------------------------------------------------------------------------
// Read + render
// ---------------------------------------------------------------------------

async function loadMessages() {
  if (!contract) return;
  setStatus("Loading entries…");
  try {
    const entries = await contract.getMessages();
    render(entries);
    els.total.textContent = String(entries.length);
    setStatus("");
  } catch (err) {
    setStatus(err.shortMessage || err.message || "Failed to load.", "error");
  }
}

function render(entries) {
  els.messages.innerHTML = "";
  if (entries.length === 0) {
    els.emptyState.classList.remove("hidden");
    return;
  }
  els.emptyState.classList.add("hidden");

  // Newest first.
  [...entries].reverse().forEach((entry) => {
    const li = document.createElement("li");
    li.className = "entry";

    const meta = document.createElement("div");
    meta.className = "entry-meta";
    const signerSpan = document.createElement("span");
    signerSpan.className = "entry-signer";
    signerSpan.textContent = short(entry.signer);
    const timeSpan = document.createElement("span");
    timeSpan.textContent = formatTime(entry.timestamp);
    meta.append(signerSpan, timeSpan);

    const message = document.createElement("p");
    message.className = "entry-message";
    message.textContent = entry.message;

    li.append(meta, message);
    els.messages.appendChild(li);
  });
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

async function sign() {
  const message = els.messageInput.value.trim();
  if (!message) {
    setStatus("Write something first.", "error");
    return;
  }

  els.signBtn.disabled = true;
  try {
    setStatus("Confirm the transaction in your wallet…");
    const tx = await contract.sign(message);
    setStatus("Waiting for confirmation…");
    await tx.wait();
    els.messageInput.value = "";
    updateCharCount();
    setStatus("Signed! 🎉", "ok");
    await loadMessages();
  } catch (err) {
    setStatus(err.shortMessage || err.message || "Transaction failed.", "error");
  } finally {
    els.signBtn.disabled = false;
  }
}

// Live update when anyone signs.
function subscribe() {
  contract.on("Signed", () => loadMessages());
}

// ---------------------------------------------------------------------------
// UI wiring
// ---------------------------------------------------------------------------

function updateCharCount() {
  els.charCount.textContent = `${els.messageInput.value.length} / 280`;
}

els.connectBtn.addEventListener("click", connect);
els.signBtn.addEventListener("click", sign);
els.refreshBtn.addEventListener("click", loadMessages);
els.messageInput.addEventListener("input", updateCharCount);

if (window.ethereum) {
  window.ethereum.on?.("accountsChanged", () => window.location.reload());
  window.ethereum.on?.("chainChanged", () => window.location.reload());
}
