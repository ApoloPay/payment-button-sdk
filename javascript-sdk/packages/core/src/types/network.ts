export const APOLOPAY_NETWORK_ID = 'apolopay';

export interface Network {
  id: string
  name: string
  network: string
  image: string
  isNative: boolean
}

export function isApoloPayNetwork(network: Pick<Network, 'network'>): boolean {
  return network.network.toLowerCase() === APOLOPAY_NETWORK_ID;
}

/**
 * Nexora never offers paying from the Apolo Pay app: the backend stops sending
 * that network, and the SDK drops it anyway if it ever does, along with an asset
 * left without networks.
 */
export function withoutApoloPayNetworks<T extends { networks: Network[] }>(assets: T[]): T[] {
  const result: T[] = [];
  for (const asset of assets) {
    const networks = asset.networks.filter((network) => !isApoloPayNetwork(network));
    if (networks.length) result.push(networks.length === asset.networks.length ? asset : { ...asset, networks });
  }
  return result;
}
