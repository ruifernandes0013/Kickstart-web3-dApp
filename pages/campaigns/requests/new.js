import React, { useState } from 'react'
import { Layout } from '../../../components/Layout'
import { FormField, Button, Form, Message } from 'semantic-ui-react'
import { campaignContract } from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3'
import Loading from '../../../components/Loading'
import routes from '../../../routes'

export default function NewRequest({ address }) {
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [recipient, setRecipient] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true)
    setError('')

    try {
      const accounts = await web3.eth.getAccounts()
      await campaignContract(address).methods.createRequest(
        description,
        web3.utils.toWei(value, 'ether'),
        recipient
      ).send({ 
        from: accounts[0]
      })
      routes.Router.pushRoute(`/campaigns/${address}/requests`)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <h3>Create New Spending Request</h3>
      <hr/>
      <Form onSubmit={onSubmit} error={!!error}>
      { loading && <Loading/> }
      <FormField>
        <label>Description</label>
        <input 
          placeholder='Buy bateries' 
          value={description} 
          onChange={(event) => setDescription(event.target.value)}
        />
      </FormField>
      <FormField>
        <label>Value</label>
        <input 
          placeholder='1 (Ether)' 
          value={value} 
          onChange={(event) => setValue(event.target.value)}
        />
      </FormField>
      <FormField>
        <label>Recipient</label>
        <input 
          placeholder='0x..' 
          value={recipient} 
          onChange={(event) => setRecipient(event.target.value)}
        />
      </FormField>
      <Message error header='Ops' content={error}></Message>
      <Button type='submit'>Submit</Button>
      </Form>
    </Layout>
  )
}

// Attach getInitialProps outside the function body
NewRequest.getInitialProps = async ({ query }) => {
  return { address: query.address };
};