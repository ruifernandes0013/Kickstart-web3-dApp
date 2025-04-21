import React, { useEffect, useState } from 'react'
import { CardGroup, Button } from 'semantic-ui-react'
import { factoryContract } from '../ethereum/factory'
import { Layout } from '../components/Layout'
import Routes from '../routes'

export default function Home() {
  const [campaigns, setCampaings ] = useState()
  
  useEffect(() => {
    const fecthCampaigns = async () => {
      let res = await factoryContract.methods.getDeployedCampaigns().call();
      res = res.map(c => (
        {
          header: c,
          meta: (
            <Routes.Link route={`/campaigns/${c}`}>
              View campaign
            </Routes.Link>
          ),
          style: { wordWrap: 'break-word' }
        }
      ))
      setCampaings(res)
    }

    fecthCampaigns()  
  }, [])

  return (
    <Layout>
      <h3>Open Campaigns</h3>
      <hr/>
      <Routes.Link route='/campaigns/new'>
        <Button 
          floated='right' 
          primary 
          content='Create Campaign' 
          icon='add circle' 
          labelPosition='right' 
        />
      </Routes.Link>
      <CardGroup items={campaigns} />
    </Layout>
  )
}