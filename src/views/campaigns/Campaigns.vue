<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>
          <h3 class="align-bottom font-weight-bold float-left text-center" style="margin-right: 10px">Campaigns</h3>
          <button class="btn btn-light text-center float-right" v-on:click="createCampaign" ><CIcon name="cil-layers" style="margin-right: 5px; padding: 1px"/>Create campaign</button>

          <button class="btn btn-light float-left btn-sm"  v-on:click="fetchCampaigns"><CIcon name="cil-reload"/></button>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            hover
            striped
            :items="items"
            :fields="fields"
            :items-per-page="20"
            clickable-rows
            :sorter='{ external: false, resetable: false }'
            :sorterValue='{column: "last_name", asc:true}'
            :tableFilter='{ external: false, lazy: false, placeholder:"Enter string..."}'
            :responsive="false"
            :active-page="activePage"
            @row-clicked="rowClicked"
            :pagination="{ doubleArrows: false, align: 'center'}"
            @page-change="pageChange"

          >
            <!-- <template #status="data">
              <td>
                <CBadge :color="getBadge(data.item.status)">
                  {{data.item.gender}}
                </CBadge>
              </td>
            </template> -->
            
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
// import usersData from './UsersData'
export default {
  name: 'Campaigns',
  data () {
    return {
      items: this.$store.campaigns || this.fetchCampaigns(),
      fields: [
        { key: 'name' },
        { key: 'start_date' },

      ],
      activePage: 1
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler (route) {
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page)
        }
      }
    }
  },
  methods: {
   
    rowClicked (item, index) {
      this.$router.push({path: `campaigns/${index + 1}`})
    },
    pageChange (val) {
      this.$router.push({ query: { page: val }})
    },
    createCampaign () {
      console.log('createCampaign');
      this.$router.push({path: 'campaigns/create'})
    },
    fetchCampaigns () {
      var account_id = 'dummy202';
      var endpoint = '/accounts/' + account_id + '/campaigns'
      this.$http.get(endpoint)
      
      .then((result) => {
        
        // update data
        this.items = result.data; 

        // store
        this.$store.campaigns = result.data;

        console.log('result', result.data);
      })
      .catch((error) => {
        console.log('axios error: ', error);
      });
    }
  }
}

// import * as Campaigns from './index.js'
// export default {
//   name: 'Campaigns',
//   components: {
//     ...Campaigns
//   }
// }
</script>
