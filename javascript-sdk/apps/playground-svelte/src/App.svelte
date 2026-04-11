<script lang="ts">
  import { ApoloPayButton, ApoloPayClient } from "@apolopay-sdk/svelte";

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

  let pubKey = initialPublicKey;
  let privKey = initialPrivateKey;
  let amount = 1;
  let client: ApoloPayClient | undefined = undefined;
  let processId = initialProcessId;
  let isLoading = false;
  let status = initialProcessId ? "Botón Listo ✅" : "Esperando configuración...";
  let logs: LogEntry[] = [
    { message: "Playground iniciado...", type: 'system', time: new Date().toLocaleTimeString() }
  ];

  function addLog(message: string, type: LogEntry['type'] = 'system') {
    logs = [{ message, type, time: new Date().toLocaleTimeString() }, ...logs];
  }

  async function getProcessId(amt: number, key: string) {
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
  }

  async function handleUpdate() {
    if (!pubKey || !privKey || isNaN(amount)) {
      addLog("Por favor, completa todos los campos correctamente", "error");
      return;
    }

    isLoading = true;
    status = "Obteniendo processId...";
    addLog(`Iniciando configuración (Monto: ${amount})...`, "info");

    try {
      const newProcessId = await getProcessId(amount, privKey);
      addLog(`Process ID obtenido: ${newProcessId}`, "success");

      const newClient = new ApoloPayClient({ publicKey: pubKey });
      client = newClient;
      processId = newProcessId;
      status = "Botón Listo ✅";
      addLog("Botón listo para usar", "success");
    } catch (error: any) {
      console.error(error);
      addLog(`Error: ${error.message}`, "error");
      status = "Error en configuración";
    } finally {
      isLoading = false;
    }
  }

  function clearLogs() {
    logs = [];
  }
</script>

<div class="app-container">
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-accent">Apolo</span> Pay
      </div>
      <h1>Playground Svelte</h1>
    </div>

    <div class="config-section">
      <div class="input-group">
        <label for="publicKey">Public Key (pk_...)</label>
        <input 
          type="text" 
          id="publicKey" 
          placeholder="pk_..." 
          bind:value={pubKey}
        />
      </div>

      <div class="input-group">
        <label for="privateKey">Private Key (Secret Key)</label>
        <input 
          type="password" 
          id="privateKey" 
          placeholder="sk_..." 
          bind:value={privKey}
        />
        <small>Solo para uso local en este playground</small>
      </div>

      <div class="input-group">
        <label for="amount">Monto (Amount)</label>
        <input 
          type="number" 
          id="amount" 
          bind:value={amount}
          step="0.01" 
        />
      </div>

      <button 
        id="update-btn" 
        class="primary-btn" 
        on:click={handleUpdate}
        disabled={isLoading}
      >
        <span class="btn-text" class:hidden={isLoading}>Configurar Botón</span>
        <span class="loader" class:hidden={!isLoading}></span>
      </button>
    </div>

    <div class="status-panel">
      <div class="status-item">
        <span class="status-label">Estado:</span>
        <span class="status-value">{status}</span>
      </div>
      {#if processId}
        <div class="status-item">
          <span class="status-label">Process ID:</span>
          <span class="status-value code">{processId}</span>
        </div>
      {/if}
    </div>
  </aside>

  <main class="preview-area">
    <div class="preview-card">
      <div class="preview-header">
        <h2>Vista Previa</h2>
        <p>Aquí es donde aparecerá tu botón de pago configurado</p>
      </div>
      <div class="button-preview-container">
        {#if !processId || !client}
          <div class="placeholder">
            Configura las llaves para ver el botón
          </div>
        {:else}
          <ApoloPayButton
            {client}
            {processId}
            barrierDismissible
            onSuccess={(data) => addLog(`PAGO EXITOSO: ${data.message}`, "success")}
            onError={(err) => addLog(`ERROR EN PAGO: ${err.message}`, "error")}
            onExpired={(err) => addLog(`EL PAGO HA EXPIRADO: ${err.message}`, "error")}
            onDismissed={() => addLog("Pago cancelado por el usuario", "system")}
          />
        {/if}
      </div>
    </div>

    <div class="events-log">
      <div class="log-header">
        <h3>Registro de Eventos</h3>
        <button on:click={clearLogs}>Limpiar</button>
      </div>
      <div class="logs-content">
        {#each logs as log}
          <div class="log-entry {log.type}">
            [{log.time}] {log.message}
          </div>
        {/each}
      </div>
    </div>
  </main>
</div>

