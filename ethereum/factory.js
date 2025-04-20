import web3 from "./web3";
import compiledFactory from '../ethereum/build/CampaignFactory.json';

const factoryAddress = '0xA71104d92C0264BC7DE29c42A8734B232f616e57'

export const factoryContract = new web3.eth.Contract(
  JSON.parse(compiledFactory.interface),
  factoryAddress
)