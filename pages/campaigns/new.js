import React, { useState } from 'react'
import { Layout } from '../../components/Layout'
import { FormField, Button, Form, Message } from 'semantic-ui-react'
import { factoryContract } from '../../ethereum/factory'
import web3 from '../../ethereum/web3'
import Loading from '../../components/Loading'
import routes from '../../routes'

export default function NewCampaign() {
  const [minimum, setMinimum] = useState('')
  const [goal, setGoal] = useState('')
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const accounts = await web3.eth.getAccounts()
      await factoryContract.methods.createCampaign(
        minimum,
        goal,
        deadline
      ).send({ 
        from: accounts[0]
      })
      routes.Router.pushRoute('/')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <h3>Create Campaign</h3>
      <hr/>
      <Form onSubmit={onSubmit} error={!!error} success={success}>
      { loading && <Loading/> }
      <FormField>
        <label>Minimum Contribution</label>
        <input 
          placeholder='1 (Wei)' 
          value={minimum} 
          onChange={(event) => setMinimum(event.target.value)}
        />
      </FormField>
      <FormField>
        <label>Campaign Goal</label>
        <input 
          placeholder='10.000 (Wei)' 
          value={goal} 
          onChange={(event) => setGoal(event.target.value)}
        />
      </FormField>
      <FormField>
        <label>Campaign Duration in days</label>
        <input 
          placeholder='30' 
          value={deadline} 
          onChange={(event) => setDeadline(event.target.value)}
        />
      </FormField>
      <Message success header='Well Done!!' content='Your campaign was successfully created.'></Message>
      <Message error header='Ops' content={error}></Message>
      <Button type='submit'>Submit</Button>
      </Form>
    </Layout>
  )
}