import { describe, it, expect } from 'vitest';
import { ClientResponse, ClientError, ClientCode } from './client-response';

describe('ClientResponse.fromJson', () => {
  it('uses json.status/message/result when present', () => {
    const response = ClientResponse.fromJson({
      status: ClientCode.payment_success,
      message: 'all good',
      result: { foo: 'bar' },
    });

    expect(response.code).toBe(ClientCode.payment_success);
    expect(response.message).toBe('all good');
    expect(response.result).toEqual({ foo: 'bar' });
  });

  it('falls back to the provided defaults when the json is bare', () => {
    const response = ClientResponse.fromJson({}, { code: ClientCode.payment_partial, message: 'partial' });

    expect(response.code).toBe(ClientCode.payment_partial);
    expect(response.message).toBe('partial');
  });

  it('runs the result mapper over json.result when given', () => {
    const response = ClientResponse.fromJson(
      { result: { amount: '10' } },
      { result: (json) => ({ amount: Number(json.amount) }) }
    );

    expect(response.result).toEqual({ amount: 10 });
  });
});

describe('ClientError.fromError', () => {
  it('returns the same instance if already a ClientError', () => {
    const original = new ClientError({ code: ClientCode.unknown_error, message: 'boom' });
    expect(ClientError.fromError(original)).toBe(original);
  });

  it('derives code/message from a plain Error, defaulting to unknown_error', () => {
    const err = ClientError.fromError(new Error('network exploded'));

    expect(err.code).toBe(ClientCode.unknown_error);
    expect(err.message).toBe('network exploded');
  });

  it('lets explicit code/message override the error contents', () => {
    const err = ClientError.fromError(new Error('ignored'), {
      code: ClientCode.socket_connection_error,
      message: 'custom message',
    });

    expect(err.code).toBe(ClientCode.socket_connection_error);
    expect(err.message).toBe('custom message');
  });
});
