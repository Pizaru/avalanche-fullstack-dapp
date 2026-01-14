export const ABI = [
  {
    type: 'function',
    name: 'getValue',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'setValue',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_value', type: 'uint256' }],
    outputs: [],
  },
] as const;
