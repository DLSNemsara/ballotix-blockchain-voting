import dotenv from "dotenv";
import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const mnemonicPhrase = process.env.ACCOUNT_MNEMONIC;
const network = process.env.VITE_RINKEBY_ENDPOINT;
const compiledFactory = JSON.parse(
  fs.readFileSync(
    path.resolve(
      __dirname,
      "../frontend/src/ethereum/build/ElectionFactory.json"
    ),
    "utf8"
  )
);

const provider = new HDWalletProvider(mnemonicPhrase, network);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);
  //contract deployment
  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: "3000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);

  provider.engine.stop();
};
deploy();
