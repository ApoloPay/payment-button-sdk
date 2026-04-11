// 1. Importa el paquete de UI.
import '@apolopay-sdk/ui';

// 2. Importa el cliente y los tipos
import { ApoloPayClient, type ClientResponse, type ClientError } from '@apolopay-sdk/ui';

// --- VALORES INICIALES (OPCIONALES) ---
const initialPublicKey = "";
const initialPrivateKey = "";
const initialProcessId = "";
// --------------------------------------

// Selectores
const publicKeyInput = document.getElementById("publicKey") as HTMLInputElement;
const privateKeyInput = document.getElementById("privateKey") as HTMLInputElement;
const amountInput = document.getElementById("amount") as HTMLInputElement;
const updateBtn = document.getElementById("update-btn") as HTMLButtonElement;
const statusValue = document.getElementById("current-status");
const processIdContainer = document.getElementById("process-id-container");
const displayProcessId = document.getElementById("display-process-id");
const buttonPlaceholder = document.getElementById("button-placeholder");
const buttonContainer = document.getElementById("button-container");
const logsContainer = document.getElementById("logs-content");
const clearLogsBtn = document.getElementById("clear-logs");
const miBoton = document.getElementById('btn-pago') as any;

// Set initial values
if (publicKeyInput) publicKeyInput.value = initialPublicKey;
if (privateKeyInput) privateKeyInput.value = initialPrivateKey;

function addLog(message: string, type: 'system' | 'success' | 'error' | 'info' = 'system') {
  const entry = document.createElement("div");
  entry.className = `log-entry ${type}`;
  const time = new Date().toLocaleTimeString();
  entry.innerText = `[${time}] ${message}`;
  logsContainer?.prepend(entry);
}

async function getProcessId(amount: number, privateKey: string) {
  try {
    const response = await fetch("https://pb-api.apolopay.app/payment-button/process/preorder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": privateKey,
      },
      body: JSON.stringify({
        amount,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener processId");
    }

    const data = await response.json();
    return data.result.id;
  } catch (error: any) {
    throw error;
  }
}

async function updateButton() {
  const pubKey = publicKeyInput.value.trim();
  const privKey = privateKeyInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!pubKey || !privKey || isNaN(amount)) {
    addLog("Por favor, completa todos los campos correctamente", "error");
    return;
  }

  // UI State
  updateBtn.disabled = true;
  updateBtn.querySelector(".loader")?.classList.remove("hidden");
  updateBtn.querySelector(".btn-text")?.classList.add("hidden");
  if (statusValue) statusValue.innerText = "Obteniendo processId...";
  addLog(`Iniciando configuración (Monto: ${amount})...`, "info");

  try {
    // 1. Obtener processId
    const processId = await getProcessId(amount, privKey);
    addLog(`Process ID obtenido: ${processId}`, "success");

    // 2. Configurar Cliente
    const apolo = new ApoloPayClient({ publicKey: pubKey });

    // 3. Actualizar Botón (Web Component)
    if (miBoton) {
      miBoton.client = apolo;
      miBoton.processId = processId;
      miBoton.setAttribute("process-id", processId);

      // Mostrar botón
      buttonPlaceholder?.classList.add("hidden");
      buttonContainer?.classList.remove("hidden");

      if (statusValue) statusValue.innerText = "Botón Listo ✅";
      if (displayProcessId) displayProcessId.innerText = processId;
      processIdContainer?.classList.remove("hidden");
      addLog("Botón listo para usar", "success");
    }
  } catch (error: any) {
    console.error(error);
    addLog(`Error: ${error.message}`, "error");
    if (statusValue) statusValue.innerText = "Error en configuración";
  } finally {
    updateBtn.disabled = false;
    updateBtn.querySelector(".loader")?.classList.add("hidden");
    updateBtn.querySelector(".btn-text")?.classList.remove("hidden");
  }
}

// Event Listeners
updateBtn.addEventListener("click", updateButton);

clearLogsBtn?.addEventListener("click", () => {
  if (logsContainer) logsContainer.innerHTML = "";
  addLog("Logs limpiados", "system");
});

if (miBoton) {
  miBoton.addEventListener('success', (event: Event) => {
    const response = (event as CustomEvent<ClientResponse>).detail;
    addLog(`PAGO EXITOSO: ${response.message}`, "success");
    console.log('¡Éxito (Vanilla JS)!', response.message);
  });

  miBoton.addEventListener('error', (event: Event) => {
    const error = (event as CustomEvent<ClientError>).detail;
    addLog(`ERROR EN PAGO: ${error.message}`, "error");
    console.error('Error (Vanilla JS):', error.message);
  });

  miBoton.addEventListener('expired', (event: Event) => {
    const error = (event as CustomEvent<ClientError>).detail;
    addLog("EL PAGO HA EXPIRADO", "error");
    console.error('Expirado (Vanilla JS):', error.message);
  });

  miBoton.addEventListener('dismissed', () => {
    addLog("Pago cancelado por el usuario", "system");
    console.log("Dismissed (Vanilla JS)");
  });
}

// Check initial process id
if (initialProcessId) {
    if (displayProcessId) displayProcessId.innerText = initialProcessId;
    processIdContainer?.classList.remove("hidden");
    buttonPlaceholder?.classList.add("hidden");
    buttonContainer?.classList.remove("hidden");
    if (statusValue) statusValue.innerText = "Botón Listo ✅";
}

addLog("Introduce tus credenciales y haz clic en 'Configurar Botón'", "system");