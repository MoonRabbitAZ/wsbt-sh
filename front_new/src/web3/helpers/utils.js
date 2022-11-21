import supportedChains from './chains';

export function getChainData(chainId) {
  const chainData = supportedChains.filter((chain) => chain.network_id === chainId)[0];

  if (!chainData) return { isChainValid: false };

  chainData.isChainValid = true;
  return chainData;
}
