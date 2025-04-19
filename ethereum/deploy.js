import HDWalletProvider from "@truffle/hdwallet-provider";
import { Web3 } from 'web3';
import compiledFactory from '../ethereum/build/CampaignFactory.json' with { type: "json" };
import dotenv from 'dotenv'
dotenv.config()

const { bytecode, interface: abi } = compiledFactory;
const mnemonic = process.env.MNEMONIC
const providerOrUrl = process.env.INFURA_API_KEY
const privateKey = process.env.ACCOUNT_PRIVATE_KEY
const privateKeys = [privateKey]

const provider = new HDWalletProvider({
  mnemonic,
  providerOrUrl,
  privateKeys,
})

const web3 = new Web3(provider)
let providerAccount

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    providerAccount = accounts[1]
    console.log("Attempting to deploy from account", providerAccount);
    
    const balance = await web3.eth.getBalance(providerAccount);
    console.log("Account balance:", web3.utils.fromWei(balance, 'ether'), "ETH");

    const result = await new web3.eth.Contract(JSON.parse(abi))
      .deploy({ data: bytecode })
      .send({ gas: 2000000, from: providerAccount })
      .on('transactionHash', (hash) => { console.log("Transaction hash:", hash); })
      .on('error', (error) => { console.error("Error during deployment:", error) });

    console.log("Contract deployed to:", result.options.address);
    provider.engine.stop();
  } catch (error) {
    console.log('Error:', error);
    provider.engine.stop();
  }
};

deploy().catch((err) => {
  console.error('Deployment failed:', err);
  provider.engine.stop();
});