<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>
          Campaign Details
        </CCardHeader>
        <CCardBody>
          <CDataTable
            striped
            small
            fixed
            :items="visibleData"
            :fields="fields"
          />
        </CCardBody>
        <CCardFooter>
          <CButton class="btn btn-light float-right" @click="goBack">Close</CButton>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
// import usersData from './UsersData'
export default {
  name: 'Campaign',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.campaignsOpened = from.fullPath.includes('campaigns')
    })
  },
  data () {
    return {
      campaignsOpened: null
    }
  },
  computed: {
    fields () {
      return [
        { key: 'key', label: this.name, _style: 'width:150px'},
        { key: 'value', label: '', _style: 'width:150px;' }
      ]
    },
    campaignData () {
      const id = this.$route.params.id
      const campaign = (this.$store && this.$store.campaigns) ? this.$store.campaigns.find((user, index) => index + 1 == id) : false;
      const campaignDetails = campaign ? Object.entries(campaign) : [['id', 'Not found']]
      return campaignDetails.map(([key, value]) => { return { key, value } })
    },
    visibleData () {
      return this.campaignData.filter(param => param.key !== 'username')
    },
    username () {
      return this.campaignData.filter(param => param.key === 'username')[0].value
    }
  },
  methods: {
    goBack() {
      console.log('this.campaignsOpened', this.campaignsOpened);
      this.$router.push({path: '/campaigns'})
    }
  }
}
</script>
