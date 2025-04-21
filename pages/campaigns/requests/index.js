import React, { useEffect, useState } from 'react'
import { Button, Table, TableHeader, TableRow, TableHeaderCell } from 'semantic-ui-react'
import { campaignContract } from '../../../ethereum/campaign'
import { Layout } from '../../../components/Layout'
import Routes from '../../../routes'
import RequestRow from '../../../components/RequestRow'
import web3 from '../../../ethereum/web3'

export default function Requests({ address }) {
  const [requests, setRequests ] = useState()
  const campaign = campaignContract(address)
  
  useEffect(() => {
    const fetchRequests = async () => {
      const requestCount = await campaign.methods.getRequestCount().call()
      const contributorsCount = await campaign.methods.contributorsCount().call()  

      const rawRequests = await Promise.all(
        Array(Number(requestCount.toString()))
          .fill()
          .map((element, index) => {
            return campaign.methods.requests(index).call()
          }
      ))
      const requests = requestCount > 0 && rawRequests.map(raw => {
        return {
          description: raw.description,
          value: web3.utils.fromWei(raw.value.toString(), 'ether'),
          recipient: raw.recipient,
          approvalCount: `${raw.approvalCount.toString()}/${contributorsCount.toString()}`,
          complete: raw.complete,
          address
        }
      })
      setRequests(requests)
    }

    fetchRequests()  
  }, [])

  function renderRows() {
    return requests.map((request, index) => (
      <RequestRow key={index} id={index} request={request} />    
      ))
  }

  return (
    <Layout>
      <h3>Open Requests</h3>
      <hr/>
      <Routes.Link route={`/campaigns/${address}/requests/new`}>
        <Button 
          floated='right' 
          primary 
          content='Create Request' 
          icon='add circle' 
          labelPosition='right' 
          style={{ marginBottom: 10 }}
        />
      </Routes.Link>
      <Table celled>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>ID</TableHeaderCell>
          <TableHeaderCell>Description</TableHeaderCell>
          <TableHeaderCell>Amount</TableHeaderCell>
          <TableHeaderCell>Recipient</TableHeaderCell>
          <TableHeaderCell>Approval Count</TableHeaderCell>
          <TableHeaderCell>Complete</TableHeaderCell>
          <TableHeaderCell>Aprove</TableHeaderCell>
          <TableHeaderCell>Finalize</TableHeaderCell>
        </TableRow>
      </TableHeader>
      {requests && renderRows()}
      </Table>
      <p>Found {requests?.length || 0} { requests?.length == 1 ? 'request' : 'requests'}</p>
    </Layout>
  )
}

// Attach getInitialProps outside the function body
Requests.getInitialProps = async ({ query }) => {
  return { address: query.address };
};