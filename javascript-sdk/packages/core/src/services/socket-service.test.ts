import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SmartPayClient, DEFAULT_SOCKET_URL } from '../smart-pay-client';

const ioMock = vi.fn(() => ({
  connected: false,
  on: vi.fn(),
  emit: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock('socket.io-client', () => ({ io: ioMock }));

// Imported after the mock so SocketService picks up the mocked io().
const { SocketService } = await import('./socket-service');

describe('SocketService base URL', () => {
  beforeEach(() => {
    ioMock.mockClear();
    // connect() is a no-op outside a browser.
    vi.stubGlobal('window', {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('connects to the default socket URL', () => {
    new SocketService(new SmartPayClient({ publicKey: 'pk_test_x' })).connect({ processId: 'p1' });
    expect(ioMock).toHaveBeenCalledTimes(1);
    expect((ioMock.mock.calls[0] as unknown[])[0]).toBe(DEFAULT_SOCKET_URL);
  });

  it("connects to the client's socketUrl override", () => {
    const client = new SmartPayClient({ publicKey: 'pk_test_x', socketUrl: 'https://sandbox-ws.smartpaylatam.com/' });
    new SocketService(client).connect({ processId: 'p1' });
    expect((ioMock.mock.calls[0] as unknown[])[0]).toBe('https://sandbox-ws.smartpaylatam.com');
  });
});
