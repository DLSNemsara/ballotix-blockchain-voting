import web3 from "./web3";
import Election from "./build/Election.json";

/**
 * Creates a new instance of the Election contract
 * @param {string} address - The Ethereum address of the deployed contract
 * @returns {Object} - Web3 contract instance
 */
export default (address) => {
  return new web3.eth.Contract(Election.abi, address);
};
