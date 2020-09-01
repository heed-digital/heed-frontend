<template>
  <div>
    <CCardGroup columns class="card-columns cols-2">

      <CCard>
        <CCardHeader>Bar Chart</CCardHeader>
        <CCardBody><CCampaignExample/></CCardBody>
      </CCard>
      
    </CCardGroup>
  </div>
</template>

<script>
import * as Campaigns from './index.js'
export default {
  name: 'Campaigns',
  components: {
    ...Campaigns
  }
}
</script>
