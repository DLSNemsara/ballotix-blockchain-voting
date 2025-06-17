import "@testing-library/jest-dom";

// Mock window.ethereum for MetaMask
global.ethereum = {
  isMetaMask: true,
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
};

// Mock window.web3
global.web3 = {
  eth: {
    getAccounts: jest.fn(),
  },
};

// Mock Vite environment variables
process.env = {
  ...process.env,
  VITE_CONTRACT: "0x1234567890123456789012345678901234567890",
};
