'use client';

import { useState } from 'react';
import { formatEther } from 'viem';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useChainId,
  useReadContract,
  useWriteContract,
  useSwitchChain,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { avalancheFuji } from 'wagmi/chains';

import { ABI } from './src/contracts/abi/simpleStorage';
import { CONTRACT_ADDRESS } from './src/contracts/abi/address';

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function Home() {
  /* ================= WALLET CONNECTION ================= */
  const { address, isConnected, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const switchChain = useSwitchChain();
  
  const chainId = chain?.id;
  const isWrongNetwork = isConnected && chainId !== avalancheFuji.id;
  
  const { data: balance } = useBalance({ address });
  
  // Get network name
  const getNetworkName = () => {
    if (!chainId) return '-';
    if (chainId === avalancheFuji.id) return 'Avalanche Fuji';
    if (chainId === 43114) return 'Avalanche Mainnet';
    if (chainId === 1) return 'Ethereum Mainnet';
    if (chainId === 11155111) return 'Sepolia';
    if (chainId === 137) return 'Polygon';
    if (chainId === 56) return 'BSC';
    if (chainId === 42161) return 'Arbitrum';
    if (chainId === 10) return 'Optimism';
    return `Chain ${chainId}`;
  };

  /* ================= READ CONTRACT ================= */
  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getValue',
  });

  /* ================= WRITE CONTRACT ================= */
  const { writeContractAsync, isPending: isWriting } = useWriteContract();
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');

  async function handleSetValue() {
    try {
      setStatus('⏳ Sending transaction...');
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'setValue',
        args: [BigInt(input)],
      });
      setStatus('⏳ Waiting for confirmation...');
      
      // Auto refresh setelah transaction confirmed
      setTimeout(() => {
        refetch();
        setStatus('✅ Transaction successful');
      }, 2000);
      
      setInput('');
    } catch (error: any) {
      setStatus(`❌ Error: ${error.shortMessage || 'Transaction failed'}`);
    }
  }

  /* ================= UI ================= */
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2b0f14] to-[#120609] text-white">
      <div className="w-full max-w-[420px] rounded-2xl bg-gradient-to-b from-[#280c10]/95 to-[#140609]/95 p-6 shadow-2xl border border-white/10 space-y-4">
        
        <h1 className="text-xl font-bold text-center">
          Avalanche dApp
        </h1>
        <p className="text-center text-xs text-white/70">
          Avalanche Fuji Testnet
        </p>

        {/* WALLET CONNECTION */}
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            className="w-full rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-3 text-sm font-semibold shadow-lg transition hover:translate-y-[-1px]"
          >
            Connect Wallet
          </button>
        ) : isWrongNetwork ? (
          <button
            onClick={() => switchChain.mutate({ chainId: avalancheFuji.id })}
            className="w-full rounded-full bg-gradient-to-r from-orange-600 to-yellow-500 py-3 text-sm font-semibold shadow-lg transition hover:translate-y-[-1px]"
          >
            Switch to Avalanche Fuji
          </button>
        ) : (
          <button
            onClick={() => disconnect()}
            className="w-full rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-3 text-sm font-semibold shadow-lg transition hover:translate-y-[-1px]"
          >
            Disconnect ({shortAddress(address!)})
          </button>
        )}

        {/* WARNING BANNER */}
        {isWrongNetwork && (
          <div className="rounded-xl border border-orange-400/50 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-300">
            ⚠️ Wrong network. Please switch to Avalanche Fuji Testnet.
          </div>
        )}

        {/* WALLET INFO */}
        <div className="rounded-xl bg-white/5 p-4 text-xs space-y-1">
          <p>
            <strong>Status:</strong>{' '}
            {!isConnected ? 'Not Connected' : isWrongNetwork ? 'Wrong Network ❌' : 'Connected '}
          </p>

          <p>
            <strong>Wallet:</strong>
          </p>
          <p className="font-mono break-all">
            {address ?? '-'}
          </p>

          <p>
            <strong>Network:</strong>{' '}
            {isConnected ? getNetworkName() : '-'}
            {chainId === avalancheFuji.id && ' ✅'}
          </p>

          <p>
            <strong>Balance:</strong>{' '}
            {balance
              ? Number(formatEther(balance.value)).toFixed(4)
              : '-'}{' '}
            {balance?.symbol}
          </p>
        </div>

        {/* READ CONTRACT */}
        <div className="rounded-xl bg-white/5 p-4 text-xs">
          <div className="flex justify-between items-center mb-2">
            <p className="text-white/70">Stored Value</p>
            <button
              onClick={() => refetch()}
              disabled={isReading}
              className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition disabled:opacity-50"
            >
              {isReading ? '...' : '↻'}
            </button>
          </div>
          <p className="text-xl font-bold">
            {isReading ? 'Loading...' : value?.toString() || '-'}
          </p>
        </div>

        {/* WRITE CONTRACT */}
        <div className="space-y-2">
          <input
            type="number"
            placeholder="New value"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-lg bg-black border border-white/10 px-3 py-2 text-sm"
          />
          <button
            onClick={handleSetValue}
            disabled={isWriting || !input || isWrongNetwork}
            className="w-full py-2 rounded-lg bg-red-600 disabled:opacity-50 font-semibold"
          >
            {isWriting ? 'Sending...' : 'Set Value'}
          </button>
        </div>

        {status && (
          <p className="text-center text-xs text-white/70">
            {status}
          </p>
        )}
      </div>
    </main>
  );
}