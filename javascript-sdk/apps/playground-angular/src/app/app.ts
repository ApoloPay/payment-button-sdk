import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApoloPayButtonModule, ApoloPayClient } from '@apolopay-sdk/angular';

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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ApoloPayButtonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  pubKey = signal(initialPublicKey);
  privKey = signal(initialPrivateKey);
  amount = signal(1);
  client = signal<ApoloPayClient | undefined>(undefined);
  processId = signal(initialProcessId);
  isLoading = signal(false);
  status = signal(initialProcessId ? "Botón Listo ✅" : "Esperando configuración...");
  logs = signal<LogEntry[]>([
    { message: "Playground iniciado...", type: 'system', time: new Date().toLocaleTimeString() }
  ]);

  addLog(message: string, type: LogEntry['type'] = 'system') {
    this.logs.update(prev => [{ message, type, time: new Date().toLocaleTimeString() }, ...prev]);
  }

  async getProcessId(amt: number, key: string) {
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

  async handleUpdate() {
    const pk = this.pubKey().trim();
    const sk = this.privKey().trim();
    const amt = this.amount();

    if (!pk || !sk || isNaN(amt)) {
      this.addLog("Por favor, completa todos los campos correctamente", "error");
      return;
    }

    this.isLoading.set(true);
    this.status.set("Obteniendo processId...");
    this.addLog(`Iniciando configuración (Monto: ${amt})...`, "info");

    try {
      const newProcessId = await this.getProcessId(amt, sk);
      this.addLog(`Process ID obtenido: ${newProcessId}`, "success");

      const newClient = new ApoloPayClient({ publicKey: pk });
      this.client.set(newClient);
      this.processId.set(newProcessId);
      this.status.set("Botón Listo ✅");
      this.addLog("Botón listo para usar", "success");
    } catch (error: any) {
      console.error(error);
      this.addLog(`Error: ${error.message}`, "error");
      this.status.set("Error en configuración");
    } finally {
      this.isLoading.set(false);
    }
  }

  clearLogs() {
    this.logs.set([]);
  }

  handleSuccess(response: any) {
    this.addLog(`PAGO EXITOSO: ${response.message}`, "success");
  }

  handleError(error: any) {
    this.addLog(`ERROR EN PAGO: ${error.message}`, "error");
  }

  handleExpired(error: any) {
    this.addLog(`EL PAGO HA EXPIRADO: ${error.message}`, "error");
  }

  handleDismissed() {
    this.addLog("Pago cancelado por el usuario", "system");
  }
}
