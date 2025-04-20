import React, { useState } from 'react'
import { Button, Form, Input, FormField, Message } from 'semantic-ui-react'
import { campaignContract } from '../ethereum/campaign';
import web3 from '../ethereum/web3';

export default function ContributeForm({ address }) {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(0)
  const [error, setError] = useState('')
  
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true)
    setError('')

    try {
      const accounts = await web3.eth.getAccounts()
      await campaignContract(address).methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(amount, 'ether')
      })      
      window.location.href = `/campaigns/${address}`;
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={onSubmit} loading={loading}  error={!!error}>
      <FormField>
        <label>Amount to contribute</label>
        <Input 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          label='ether'
          labelPosition='right'
        />
      </FormField>
      <Button primary>Submit</Button>
      <Message error header='Ops' content={error}></Message>
    </Form>
  )
}