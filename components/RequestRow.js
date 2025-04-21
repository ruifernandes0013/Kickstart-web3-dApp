import React from 'react'
import { Button, TableBody, TableCell, TableRow } from 'semantic-ui-react'
import { campaignContract } from '../ethereum/campaign'
import web3 from '../ethereum/web3'

export default function RequestRow({ id, request }) {

  async function approveRequest() {
    try {
      const accounts = await web3.eth.getAccounts()
      await campaignContract(request.address).methods.approveRequest(id).send({ 
        from: accounts[0]
      })    
    } catch (error) {
      console.log(error)
    }
  }

  async function finalizeRequest() {
    try {
      const accounts = await web3.eth.getAccounts()
      await campaignContract(request.address).methods.finalizeRequest(id).send({ 
        from: accounts[0]
      })    
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <TableBody>
      <TableRow disabled={request.complete}>
        <TableCell>{id}</TableCell>
        <TableCell>{request.description}</TableCell>
        <TableCell>{request.value}</TableCell>
        <TableCell>{request.recipient}</TableCell>
        <TableCell>{request.approvalCount}</TableCell>
        <TableCell>{request.complete ? 'Yes' : 'No'}</TableCell>
        <TableCell>
          <Button 
            disabled={request.complete} 
            color='green' 
            onClick={approveRequest}
            basic
          >
            Approve
          </Button>
        </TableCell>
        <TableCell>
          <Button 
            disabled={request.complete} 
            color='yellow' 
            onClick={finalizeRequest}
            basic
          >
            Finalize
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  )
}
