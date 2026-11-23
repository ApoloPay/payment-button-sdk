import { describe, it, expect } from 'vitest';
import {
  SmartPayClient,
  ApoloPayClient,
  DEFAULT_API_URL,
  DEFAULT_SOCKET_URL,
  LEGACY_APOLO_API_URL,
  LEGACY_APOLO_SOCKET_URL,
} from './smart-pay-client';

describe('SmartPayClient', () => {
  it('detects sandbox keys', () => {
    expect(new SmartPayClient({ publicKey: 'pk_test_abc' }).isSandbox()).toBe(true);
    expect(new SmartPayClient({ publicKey: 'pk_live_abc' }).isSandbox()).toBe(false);
  });

  it('keeps the deprecated ApoloPayClient alias pointing to the same class', () => {
    expect(ApoloPayClient).toBe(SmartPayClient);
    expect(new ApoloPayClient({ publicKey: 'pk_test_abc' })).toBeInstanceOf(SmartPayClient);
  });
});

describe('SmartPayClient base URLs', () => {
  it('defaults to the Nexora SmartPay hosts', () => {
    const client = new SmartPayClient({ publicKey: 'pk_test_abc' });
    expect(client.getApiUrl()).toBe(DEFAULT_API_URL);
    expect(client.getSocketUrl()).toBe(DEFAULT_SOCKET_URL);
    expect(DEFAULT_API_URL).toBe('https://api.smartpaylatam.com');
    expect(DEFAULT_SOCKET_URL).toBe('https://ws.smartpaylatam.com');
  });

  it('accepts overrides, including the legacy Apolo hosts', () => {
    const client = new SmartPayClient({
      publicKey: 'pk_test_abc',
      apiUrl: LEGACY_APOLO_API_URL,
      socketUrl: LEGACY_APOLO_SOCKET_URL,
    });
    expect(client.getApiUrl()).toBe('https://pb-api.apolopay.app');
    expect(client.getSocketUrl()).toBe('https://pb-ws.apolopay.app');
  });

  it('trims trailing slashes', () => {
    const client = new SmartPayClient({
      publicKey: 'pk_test_abc',
      apiUrl: 'https://api.example.com/v1//',
      socketUrl: 'https://ws.example.com/',
    });
    expect(client.getApiUrl()).toBe('https://api.example.com/v1');
    expect(client.getSocketUrl()).toBe('https://ws.example.com');
  });

  it('allows plain http only for localhost / 127.0.0.1', () => {
    const client = new SmartPayClient({
      publicKey: 'pk_test_abc',
      apiUrl: 'http://localhost:3000',
      socketUrl: 'http://127.0.0.1:4000/',
    });
    expect(client.getApiUrl()).toBe('http://localhost:3000');
    expect(client.getSocketUrl()).toBe('http://127.0.0.1:4000');
  });

  it.each([
    ['apiUrl', { apiUrl: 'http://api.example.com' }],
    ['apiUrl', { apiUrl: 'not a url' }],
    ['apiUrl', { apiUrl: '' }],
    ['apiUrl', { apiUrl: 'ftp://api.example.com' }],
    ['socketUrl', { socketUrl: 'ws://ws.example.com' }],
    ['socketUrl', { socketUrl: 'http://ws.example.com' }],
  ])('rejects an invalid %s at construction (%o)', (name, overrides) => {
    expect(() => new SmartPayClient({ publicKey: 'pk_test_abc', ...overrides })).toThrow(
      new RegExp(`Invalid ${name}`)
    );
  });
});
