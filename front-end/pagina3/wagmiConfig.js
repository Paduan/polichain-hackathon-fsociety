import { configureChains, createClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { chains } from '@rainbow-me/rainbowkit';

const { chains, provider } = configureChains(chains, [
  publicProvider()
]);

export const wagmiClient = createClient({
  autoConnect: true,
  provider
});

export { chains };