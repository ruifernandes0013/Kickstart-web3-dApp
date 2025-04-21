import web3 from "./web3";
import compiledFactory from '../ethereum/build/CampaignFactory.json';

const factoryAddress = '0x74E0213055Efc14a2d7d9bcd678266509C658FED'

export const factoryContract = new web3.eth.Contract(
  compiledFactory.abi,
  factoryAddress
)