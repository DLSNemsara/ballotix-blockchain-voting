import web3 from "./web3";
import CampaignFactory from "./build/ElectionFactory.json";

/**
 * Creates an instance of the ElectionFactory contract
 * Uses the contract address from environment variables
 */
const address = import.meta.env.VITE_CONTRACT;
const instance = new web3.eth.Contract(CampaignFactory.abi, address);

export default instance;
