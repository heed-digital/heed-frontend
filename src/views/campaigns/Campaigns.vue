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
            clickable-rows
            :items="items"
            :fields="fields"
            :items-per-page="20"
            :sorter='{ external: false, resetable: false }'
            :sorterValue='{column: "last_name", asc:true}'
            :tableFilter='{ external: false, lazy: false, placeholder:"Enter string..."}'
            :responsive="false"
            :active-page="activePage"
            :pagination="{ doubleArrows: false, align: 'center'}"
            @row-clicked="rowClicked"
            @page-change="pageChange"
            
          >
             <template #start_date="{item}">
              <td>
                  {{getPrettyDate(item.start_date)}}
              </td>
            </template>
             <template #active="{item}">
              <td>
                  <CBadge :color="getBadge(item.active)">
                    {{getBadgeText(item.active)}}
                  </CBadge>
              </td>
            </template>
           
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
        { key: 'active', label: 'Status' },
        { key: 'frequency' },

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

    getPrettyDate (start_date) {
      var d = new Date(start_date).toDateString();
      return d;
    },
    getBadge (status) {
      var color = status ? 'success' : 'danger'; // secondary, warning, danger
      return color;
    },
    getBadgeText (status) {
      var text = status ? 'Active' : 'Inactive';
      return text;
    },
    rowClicked (item, index) {
      this.$router.push({path: 'campaigns/' + item.id})
    },
    pageChange (val) {
      this.$router.push({ query: { page: val }})
    },
    createCampaign () {
      this.$router.push({path: 'campaigns/create'})
    },
    fetchCampaigns () {

      // get all campaigns in account
      this.$http.get('/campaigns', getHeaders())
      .then((result) => {
        console.log('GET /campaigns result', result);

        // clean up results
        var clean = _.filter(result.data, function (r) {
          return !_.isNull(r);
        });
        
        // update vue data
        this.items = clean;

        // store
        this.$store.campaigns = clean;

      })
      .catch((error) => {
        console.log('GET /campaigns axios error: ', error, error.response);
      });
    }
  }
}

</script>
