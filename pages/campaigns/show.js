import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { campaignContract } from "../../ethereum/campaign";
import { Card, Message } from "semantic-ui-react";
import web3 from "../../ethereum/web3";


function getDaysRemaining(deadline) {
  if (!deadline) return 'Invalid date';

  const now = Date.now(); // ms
  const target = deadline * 1000; // transformar para ms
  const diff = target - now;

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `${days} day${days !== 1 ? 's' : ''}`;
}


export default function CampaignShow({ address }) {
  const [summary, setSummary] = useState({})

  useEffect(() => {
    if (!address) return;

    const getSummary = async () => {
      const res = await campaignContract(address).methods.getSummary().call()
      setSummary({
        balance: res[0].toString(),
        contributorsCount: res[1].toString(),
        minimumContribution: res[2].toString(),
        goalAmount: res[3].toString(),
        deadline: res[4].toString(),
        isCanceled: res[5],
        goalReached: res[6],
        requestsCount: res[7].toString(),
        manager: res[8].toString()
      })
    }
    getSummary()
  }, [address]);

  function renderCards() {
    const {
      balance,
      contributorsCount,
      minimumContribution,
      goalAmount,
      requestsCount,
      manager,
    } = summary;

    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: balance ? web3.utils.fromWei(balance, 'ether') : 0,
        meta: "Campaign Balance (ether)",
        description:
          "The balance is how much money this campaign has left to spend.",
      },
      {
        header: goalAmount ? web3.utils.fromWei(goalAmount, 'ether') : 0,
        meta: "Campaign Goal Amount (ether)",
        description:
          "The goal amount is how much money this campaign want to achieve.",
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver",
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved by approvers",
      },
      {
        header: contributorsCount,
        meta: "Number of Contributors",
        description:
          "Number of people who have already donated to this campaign",
      },
    
    ];

    return <Card.Group items={items} />;
  }

  return (
    <Layout>
      <h1>Campaign: {address}</h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <div>
            <Message
              compact
              success={!summary?.isCanceled}
              error={summary?.isCanceled}
              content={summary?.isCanceled ? 'Canceled' : 'Active'}
            />
          </div>
          <div>
            <Message
              compact
              success={summary?.goalReached}
              error={!summary?.goalReached}
              content={summary?.goalReached ? 'Goal Reached' : 'Goal Not Reached Yet'}
            />
          </div>
        </div>
        <div style={{ flexGrow: 1, textAlign: 'right' }}>
          <Message
            compact
            content={`Campaign Deadline in ${getDaysRemaining(summary?.deadline)}`}
          />
        </div>
      </div>
      <hr/>
      {summary && renderCards()}
    </Layout>
  );
}

// Attach getInitialProps outside the function body
CampaignShow.getInitialProps = async ({ query }) => {
  return { address: query.address };
};
