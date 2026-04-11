<script setup lang="ts">
import { ref } from 'vue';
import { ApoloPayButton, ApoloPayClient, type ClientResponse, type ClientError } from '@apolopay-sdk/vue';

// --- VALORES INICIALES (OPCIONALES) ---
const initialPublicKey = "";
const initialPrivateKey = "";
const initialProcessId = "";
// --------------------------------------

interface LogEntry {
  message: string;
  type: 'system' | 'success' | 'error' | 'info';
  time: string;
}

const pubKey = ref(initialPublicKey);
const privKey = ref(initialPrivateKey);
const amount = ref(1);
const client = ref<ApoloPayClient | undefined>(undefined);
const processId = ref(initialProcessId);
const isLoading = ref(false);
const status = ref(initialProcessId ? "Botón Listo ✅" : "Esperando configuración...");
const logs = ref<LogEntry[]>([
  { message: "Playground iniciado...", type: 'system', time: new Date().toLocaleTimeString() }
]);

const addLog = (message: string, type: LogEntry['type'] = 'system') => {
  logs.value.unshift({ message, type, time: new Date().toLocaleTimeString() });
};

const getProcessId = async (amt: number, key: string) => {
  const response = await fetch("https://pb-api.apolopay.app/payment-button/process/preorder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": key,
    },
    body: JSON.stringify({ amount: amt }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener processId");
  }

  const data = await response.json();
  return data.result.id;
};

const handleUpdate = async () => {
  if (!pubKey.value || !privKey.value || isNaN(amount.value)) {
    addLog("Por favor, completa todos los campos correctamente", "error");
    return;
  }

  isLoading.value = true;
  status.value = "Obteniendo processId...";
  addLog(`Iniciando configuración (Monto: ${amount.value})...`, "info");

  try {
    const newProcessId = await getProcessId(amount.value, privKey.value);
    addLog(`Process ID obtenido: ${newProcessId}`, "success");

    const newClient = new ApoloPayClient({ publicKey: pubKey.value });
    client.value = newClient;
    processId.value = newProcessId;
    status.value = "Botón Listo ✅";
    addLog("Botón listo para usar", "success");
  } catch (error: any) {
    console.error(error);
    addLog(`Error: ${error.message}`, "error");
    status.value = "Error en configuración";
  } finally {
    isLoading.value = false;
  }
};

const clearLogs = () => {
  logs.value = [];
};
</script>

<template>
  <div class="app-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-accent">Apolo</span> Pay
        </div>
        <h1>Playground Vue</h1>
      </div>

      <div class="config-section">
        <div class="input-group">
          <label for="publicKey">Public Key (pk_...)</label>
          <input 
            type="text" 
            id="publicKey" 
            placeholder="pk_..." 
            v-model="pubKey"
          />
        </div>

        <div class="input-group">
          <label for="privateKey">Private Key (Secret Key)</label>
          <input 
            type="password" 
            id="privateKey" 
            placeholder="sk_..." 
            v-model="privKey"
          />
          <small>Solo para uso local en este playground</small>
        </div>

        <div class="input-group">
          <label for="amount">Monto (Amount)</label>
          <input 
            type="number" 
            id="amount" 
            v-model.number="amount"
            step="0.01" 
          />
        </div>

        <button 
          id="update-btn" 
          class="primary-btn" 
          @click="handleUpdate"
          :disabled="isLoading"
        >
          <span :class="['btn-text', { hidden: isLoading }]">Configurar Botón</span>
          <span :class="['loader', { hidden: !isLoading }]"></span>
        </button>
      </div>

      <div class="status-panel">
        <div class="status-item">
          <span class="status-label">Estado:</span>
          <span class="status-value">{{ status }}</span>
        </div>
        <div v-if="processId" class="status-item">
          <span class="status-label">Process ID:</span>
          <span class="status-value code">{{ processId }}</span>
        </div>
      </div>
    </aside>

    <main class="preview-area">
      <div class="preview-card">
        <div class="preview-header">
          <h2>Vista Previa</h2>
          <p>Aquí es donde aparecerá tu botón de pago configurado</p>
        </div>
        <div class="button-preview-container">
          <div v-if="!processId || !client" class="placeholder">
            Configura las llaves para ver el botón
          </div>
          <div v-else>
            <ApoloPayButton
              :client="client"
              :processId="processId"
              barrierDismissible
              @success="(res: ClientResponse) => addLog(`PAGO EXITOSO: ${res.message}`, 'success')"
              @error="(err: ClientError) => addLog(`ERROR EN PAGO: ${err.message}`, 'error')"
              @expired="(err: ClientError) => addLog(`EL PAGO HA EXPIRADO: ${err.message}`, 'error')"
              @dismissed="() => addLog('Pago cancelado por el usuario', 'system')"
            />
          </div>
        </div>
      </div>

      <div class="events-log">
        <div class="log-header">
          <h3>Registro de Eventos</h3>
          <button @click="clearLogs">Limpiar</button>
        </div>
        <div class="logs-content">
          <div v-for="(log, i) in logs" :key="i" :class="['log-entry', log.type]">
            [{{ log.time }}] {{ log.message }}
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
