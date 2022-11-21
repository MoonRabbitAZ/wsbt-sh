import supportedChains from "./chains";
export function ellipseAddress(address) {
  const width = 6;
  return `${address.slice(0, width)}...${address.slice(-4)}`;
}

export function getChainData(chainId) {
  const chainData = supportedChains.filter(
    (chain) => chain.chain_id === chainId
  )[0];

  if (!chainData) {
    return { isChainValid: false };
  }
  chainData.isChainValid = true;
  return chainData;
}
