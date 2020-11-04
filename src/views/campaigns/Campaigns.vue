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
import _ from 'lodash';

export default {
  name: 'Campaigns',
  data () {
    return {
      items: this.$store.campaigns || this.fetchCampaigns(),
      // items: this.$store.getters.campaigns || this.fetchCampaigns(), // does not work!
      fields: [
        { key: 'name' },
        { key: 'start_date' },
        { key: 'active' },

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
      this.$router.push({path: 'campaigns/' + item.id})
    },
    pageChange (val) {
      this.$router.push({ query: { page: val }})
    },
    createCampaign () {
      console.log('createCampaign');
      this.$router.push({path: 'campaigns/create'})
    },
    fetchCampaigns () {

      var endpoint = '/campaigns'
      this.$http.get(endpoint,
      {
          headers: {'X-Heed-Account-Id': getAccountId()},
      })
      
      .then((result) => {

        console.log('campaign fetch result', result);

        // clean up results
        var clean = _.filter(result.data, function (r) {
          return !_.isNull(r);
        });
        
        // update data
        // this.items = clean;

        // store
        this.$store.campaigns = clean;
        // this.$store.commit('setCampaigns', clean);

        console.log('raw result', result.data);
        console.log('cleaned data: ', clean);
        console.log('store: ', this.$store);
        console.log('store getter', this.$store.getters.campaigns); // endless recursive.. something very wrong.

      })
      .catch((error) => {
        console.log('axios error: ', error, error.response);
      });
    }
  }
}

</script>
