import { Web3 } from 'web3';
import ganache from 'ganache';
import assert from 'assert'
import compiledFactory from '../ethereum/build/CampaignFactory.json' with { type: "json" };
import compiledCampaign from '../ethereum/build/Campaign.json' with { type: "json" };

const provider = ganache.provider()
const web3 = new Web3(provider)

let accounts
let factory
let campaignAddress
let campaign

beforeEach(async() => {
  accounts = await web3.eth.getAccounts()
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' })

  await factory.methods.createCampaign(
    web3.utils.toWei('0.01', 'ether'),  // minimumContribution
    web3.utils.toWei('1', 'ether'),     // goal
    '30'                                // durationInDays
  )
    .send({ from: accounts[0], gas: '1000000' });

  [ campaignAddress ] = await factory.methods.getDeployedCampaigns().call()

  campaign = new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  )
})
describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether'),  
    });
    
    const isContributor = await campaign.methods.contributors(accounts[1]).call();
    assert(isContributor);
  });

  it("prevent managers from contribute money", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei('0.02', 'ether'),  
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("prevent people to contribute less than the minimum", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: web3.utils.toWei('0.002', 'ether'),  
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("allow manager to create a request", async () => {
    await campaign.methods.createRequest(
      'Buy batteries',
      web3.utils.toWei('0.10', 'ether'),
      accounts[1]
    ).send({ from: accounts[0], gas: 1000000 });

    const request = await campaign.methods.requests(0).call()
    assert('Buy batteries', request.description)
  });

  it("prevent managers from approving requests", async () => {
    try {
      await campaign.methods.approveRequest(1).send({
        from: accounts[0]
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("request process", async () => {
    //someone contributed
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei('1', 'ether'),  
      gas: "1000000" 
    });

    //the manager creates a spending request
    await campaign.methods
      .createRequest('Buy batteries', web3.utils.toWei('0.01', 'ether'), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    //an investor approves
    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
      gas: "1000000"
    });

    // the manager tries to finalize the spending request
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });
    const request = await campaign.methods.requests(0).call()
    
    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    
    assert(balance > 104);
    assert(request.complete, true)
    assert(request.approvalCount, 1)
  });
})
