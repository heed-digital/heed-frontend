<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>
          <h3 class="align-bottom font-weight-bold float-left text-center" style="margin-right: 10px">Users</h3>
          <button class="btn btn-light text-center float-right" v-on:click="createUser" ><CIcon name="cil-user" style="margin-right: 5px; padding: 1px"/>Create user</button>
          <button class="btn btn-light text-center float-right"  style="margin-right: 10px" v-on:click="importUsers"><CIcon name="cil-cloud-upload" style="margin-right: 5px"/>Import users</button>

          <button class="btn btn-light float-left btn-sm"  v-on:click="fetchUsers"><CIcon name="cil-reload"/></button>
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
  name: 'Users',
  data () {
    return {
      items: this.$store.users || this.fetchUsers(),
      fields: [
        { key: 'first_name' },
        { key: 'last_name' },
        { key: 'email', label: 'Email', _classes: 'font-weight-bold' },
        { key: 'department' },
        { key: 'phone'},

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
    getBadge (status) {
      switch (status) {
        case 'Active': return 'success'
        case 'Inactive': return 'secondary'
        case 'Pending': return 'warning'
        case 'Banned': return 'danger'
        default: 'primary'
      }
    },
    rowClicked (item, index) {
      this.$router.push({path: `users/${index + 1}`})
    },
    pageChange (val) {
      this.$router.push({ query: { page: val }})
    },
    createUser () {
      console.log('createUser');
      this.$router.push({path: 'users/create'})
    },
    importUsers () {
      console.log('importUsers');
    },
    fetchUsers () {
      var account_id = 'dummy202';
      var endpoint = '/accounts/' + account_id + '/users'
      this.$http.get(endpoint)
      
      .then((result) => {
        
        // update data
        this.items = result.data; 

        // store
        this.$store.users = result.data;

        console.log('result', result.data);
      })
      .catch((error) => {
        console.log('axios error: ', error);
      });
    }
  }
}
</script>
