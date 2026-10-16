// =========================================================
// ⚙️ TEAMMATE 3 CONTROL PANEL: CUSTOMIZE SECRETS & RULES
// =========================================================
const CONFIG = {
  layer1SecretKey: "OBSIDIAN-404", // Secret hidden in HTML comment
  crossTabChannelName: "aethel9_quantum_bridge",
  finalRewardFlag: "FLAG{QUANTUM_DOM_CHRONO_MASTER_2026}"
};

// Global Puzzle State
const state = {
  layer1Unlocked: false,
  layer2Unlocked: false,
  layer3Unlocked: false,
  currentTemporalToken: "0000",
  isTemporalWindowOpen: false
};

// Print status updates to the top terminal bar
function logTerminal(msg) {
  document.getElementById("terminalLog").innerText = `> ${msg}`;
}

// =========================================================
// LAYER 1: DOM INSPECTION & MUTATION OBSERVER
// =========================================================
function verifyLayer1() {
  const userVal = document.getElementById("inputL1").value.trim().toUpperCase();
  if (userVal === CONFIG.layer1SecretKey) {
    unlockLayer(1, "DOM Cipher Key Accepted!");
  } else {
    logTerminal("ERROR: Invalid DOM Cipher Key. Press F12 -> Elements to inspect comments!");
  }
}

// Automatically watches if the user edits data-vault-override="true" inside F12 DevTools!
const vaultNode = document.getElementById("dom-lock");
const domObserver = new MutationObserver((mutations) => {
  mutations.forEach((m) => {
    if (m.attributeName === "data-vault-override") {
      const val = vaultNode.getAttribute("data-vault-override");
      if (val === "true" && !state.layer1Unlocked) {
        unlockLayer(1, "DevTools DOM Attribute Mutation Detected! Layer 1 Breached.");
      }
    }
  });
});
domObserver.observe(vaultNode, { attributes: true });

// =========================================================
// LAYER 2: CROSS-TAB SYNC (BroadcastChannel + LocalStorage)
// =========================================================
const syncChannel = new BroadcastChannel(CONFIG.crossTabChannelName);

// Listen for pulse coming from another browser tab
syncChannel.onmessage = (event) => {
  if (event.data && event.data.type === "QUANTUM_PULSE") {
    unlockLayer(2, "Cross-Tab Quantum Pulse Received from Twin Tab!");
    // Reply back so the first tab also unlocks if needed
    syncChannel.postMessage({ type: "QUANTUM_ACK" });
  } else if (event.data && event.data.type === "QUANTUM_ACK") {
    unlockLayer(2, "Twin Tab Handshake Confirmed! Layer 2 Unsealed.");
  }
};

// Fallback listener via localStorage event for cross-tab sync
window.addEventListener("storage", (e) => {
  if (e.key === "mystery_box_pulse" && !state.layer2Unlocked) {
    unlockLayer(2, "LocalStorage Cross-Tab Sync Event Detected!");
  }
});

function spawnSecondTab() {
  window.open(window.location.href, "_blank");
  logTerminal("Twin Tab Spawned! Now click '2. Transmit Sync Pulse' in either tab.");
}

function sendCrossTabPulse() {
  syncChannel.postMessage({ type: "QUANTUM_PULSE", timestamp: Date.now() });
  localStorage.setItem("mystery_box_pulse", Date.now().toString());
  logTerminal("Sync Pulse Broadcasted! Waiting for Twin Tab response (make sure 2 tabs are open)...");
}

// =========================================================
// LAYER 3: TEMPORAL LOGIC ENGINE (Time-Window + Rotating Hash)
// =========================================================
function updateTemporalClock() {
  const now = new Date();
  const hrs = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  const secs = now.getSeconds();
  const secsPadded = String(secs).padStart(2, "0");

  document.getElementById("clockDisplay").innerText = `${hrs}:${mins}:${secsPadded}`;

  // Temporal Rule: Gate is OPEN when the tens-digit of seconds is EVEN (00-09, 20-29, 40-49)
  const tenBlock = Math.floor(secs / 10);
  state.isTemporalWindowOpen = (tenBlock % 2 === 0);

  // Generate a deterministic 4-digit Temporal Token based on current minute & 10-sec block
  const rawSeed = (now.getMinutes() * 137) + (tenBlock * 997) + 1024;
  state.currentTemporalToken = String(rawSeed % 9000 + 1000);

  const windowEl = document.getElementById("windowState");
  if (state.isTemporalWindowOpen) {
    windowEl.innerText = "OPEN (STRIKE NOW)";
    windowEl.className = "window-open";
  } else {
    windowEl.innerText = "LOCKED (WAIT)";
    windowEl.className = "window-closed";
  }

  document.getElementById("liveTokenDisplay").innerText = state.currentTemporalToken;
}

function verifyLayer3() {
  const userToken = document.getElementById("inputL3").value.trim();
  if (!state.isTemporalWindowOpen) {
    logTerminal("TEMPORAL REJECTION: Gate is currently CLOSED! Wait for an OPEN 10s window.");
    return;
  }
  if (userToken === state.currentTemporalToken) {
    unlockLayer(3, "Temporal Logic Gate Synchronized & Breached!");
  } else {
    logTerminal("TEMPORAL ERROR: Token mismatch or expired! Match the Live 4-Digit Token.");
  }
}

setInterval(updateTemporalClock, 500);
updateTemporalClock();

// =========================================================
// CORE VAULT STATE & PRESENTER CONTROLS
// =========================================================
function unlockLayer(layerNum, message) {
  state[`layer${layerNum}Unlocked`] = true;
  logTerminal(message);
  renderVaultUI();
}

function triggerDemoLayer(layerNum) {
  unlockLayer(layerNum, `[DEMO OVERRIDE] Layer ${layerNum} Unlocked!`);
}

function resetAllLocks() {
  state.layer1Unlocked = false;
  state.layer2Unlocked = false;
  state.layer3Unlocked = false;
  vaultNode.setAttribute("data-vault-override", "false");
  document.getElementById("inputL1").value = "";
  document.getElementById("inputL3").value = "";
  logTerminal("ALL SEALS RESET. MYSTERY BOX LOCKED.");
  renderVaultUI();
}

function renderVaultUI() {
  const layers = [1, 2, 3];
  let unlockedCount = 0;

  layers.forEach((num) => {
    const isUnlocked = state[`layer${num}Unlocked`];
    if (isUnlocked) unlockedCount++;

    const card = document.getElementById(`cardLayer${num}`);
    const statusText = document.getElementById(`statusL${num}`);
    const pill = document.getElementById(`sealIndicator${num}`);

    card.classList.toggle("unlocked", isUnlocked);
    statusText.innerText = isUnlocked ? "🔓 UNSEALED" : "🔒 LOCKED";
    pill.classList.toggle("active", isUnlocked);
  });

  const badge = document.getElementById("vaultBadge");
  const finalVault = document.getElementById("finalVault");
  document.getElementById("finalFlagBox").innerText = CONFIG.finalRewardFlag;

  if (unlockedCount === 3) {
    badge.innerText = "UNSEALED (3/3)";
    badge.className = "badge badge-unlocked";
    finalVault.classList.remove("hidden");
    logTerminal("🎉 ALL 3 CRYPTOGRAPHIC LAYERS BREACHED! VAULT OPEN.");
  } else {
    badge.innerText = `SEALED (${unlockedCount}/3)`;
    badge.className = "badge badge-locked";
    finalVault.classList.add("hidden");
  }
}