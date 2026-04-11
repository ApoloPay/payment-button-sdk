import { ApoloPayClient, ApoloPayButton } from '@apolopay-sdk/react';
import { useState } from 'react';

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

function App() {
  const [pubKey, setPubKey] = useState(initialPublicKey);
  const [privKey, setPrivKey] = useState(initialPrivateKey);
  const [amount, setAmount] = useState(1);
  const [client, setClient] = useState<ApoloPayClient | undefined>(undefined);
  const [processId, setProcessId] = useState(initialProcessId);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(initialProcessId ? "Botón Listo ✅" : "Esperando configuración...");
  const [logs, setLogs] = useState<LogEntry[]>([
    { message: "Playground iniciado...", type: 'system', time: new Date().toLocaleTimeString() }
  ]);

  const addLog = (message: string, type: LogEntry['type'] = 'system') => {
    setLogs(prev => [{ message, type, time: new Date().toLocaleTimeString() }, ...prev]);
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
    if (!pubKey || !privKey || isNaN(amount)) {
      addLog("Por favor, completa todos los campos correctamente", "error");
      return;
    }

    setIsLoading(true);
    setStatus("Obteniendo processId...");
    addLog(`Iniciando configuración (Monto: ${amount})...`, "info");

    try {
      const newProcessId = await getProcessId(amount, privKey);
      addLog(`Process ID obtenido: ${newProcessId}`, "success");

      const newClient = new ApoloPayClient({ publicKey: pubKey });
      setClient(newClient);
      setProcessId(newProcessId);
      setStatus("Botón Listo ✅");
      addLog("Botón listo para usar", "success");
    } catch (error: any) {
      console.error(error);
      addLog(`Error: ${error.message}`, "error");
      setStatus("Error en configuración");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-accent">Apolo</span> Pay
          </div>
          <h1>Playground React</h1>
        </div>

        <div className="config-section">
          <div className="input-group">
            <label htmlFor="publicKey">Public Key (pk_...)</label>
            <input 
              type="text" 
              id="publicKey" 
              placeholder="pk_..." 
              value={pubKey} 
              onChange={(e) => setPubKey(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="privateKey">Private Key (Secret Key)</label>
            <input 
              type="password" 
              id="privateKey" 
              placeholder="sk_..." 
              value={privKey}
              onChange={(e) => setPrivKey(e.target.value)}
            />
            <small>Solo para uso local en este playground</small>
          </div>

          <div className="input-group">
            <label htmlFor="amount">Monto (Amount)</label>
            <input 
              type="number" 
              id="amount" 
              value={amount} 
              step="0.01" 
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </div>

          <button 
            id="update-btn" 
            className="primary-btn" 
            onClick={handleUpdate}
            disabled={isLoading}
          >
            <span className={`btn-text ${isLoading ? 'hidden' : ''}`}>Configurar Botón</span>
            <span className={`loader ${isLoading ? '' : 'hidden'}`}></span>
          </button>
        </div>

        <div className="status-panel">
          <div className="status-item">
            <span className="status-label">Estado:</span>
            <span className="status-value">{status}</span>
          </div>
          {processId && (
            <div className="status-item">
              <span className="status-label">Process ID:</span>
              <span className="status-value code">{processId}</span>
            </div>
          )}
        </div>
      </aside>

      <main className="preview-area">
        <div className="preview-card">
          <div className="preview-header">
            <h2>Vista Previa</h2>
            <p>Aquí es donde aparecerá tu botón de pago configurado</p>
          </div>
          <div className="button-preview-container">
            {(!processId || !client) ? (
              <div className="placeholder">
                Configura las llaves para ver el botón
              </div>
            ) : (
              <ApoloPayButton
                client={client}
                processId={processId}
                barrierDismissible
                onSuccess={(e) => addLog(`PAGO EXITOSO: ${e.message}`, "success")}
                onError={(e) => addLog(`ERROR EN PAGO: ${e.message}`, "error")}
                onExpired={() => addLog("EL PAGO HA EXPIRADO", "error")}
                onDismissed={() => addLog("Pago cancelado por el usuario", "system")}
              />
            )}
          </div>
        </div>

        <div className="events-log">
          <div className="log-header">
            <h3>Registro de Eventos</h3>
            <button onClick={() => setLogs([])}>Limpiar</button>
          </div>
          <div className="logs-content">
            {logs.map((log, i) => (
              <div key={i} className={`log-entry ${log.type}`}>
                [{log.time}] {log.message}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
