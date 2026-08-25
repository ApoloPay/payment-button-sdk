export const APOLOPAY_NETWORK_ID = 'apolopay';

export interface Network {
  id: string
  name: string
  network: string
  image: string
  isNative: boolean
}

export function isApoloPayNetwork(network: Pick<Network, 'network'>): boolean {
  return network.network === APOLOPAY_NETWORK_ID;
}
