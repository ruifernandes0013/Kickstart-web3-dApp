import web3 from "./web3";
import compiledCampaign from '../ethereum/build/Campaign.json';

export const campaignContract = (address) => 
  new web3.eth.Contract(
    compiledCampaign.abi,
    address
  )