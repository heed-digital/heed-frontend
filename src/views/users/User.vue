<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>
          User id:  {{ $route.params.id }}
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
  name: 'User',

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.usersOpened = from.fullPath.includes('users')
    })
  },
  
  data () {
    return {
      usersOpened: null
    }
  },
  
  computed: {
    fields () {
      return [
        { key: 'key', label: this.email, _style: 'width:150px'},
        { key: 'value', label: '', _style: 'width:150px;' }
      ]
    },
    userData () {
      const id = this.$route.params.id
      // const user = (this.$store && this.$store.users) ? this.$store.users.find((user, index) => index + 1 == id) : false;
      const user = (this.$store && this.$store.users) ? this.$store.users.find((user, index) => user.id == id) : false;
      const userDetails = user ? Object.entries(user) : [['id', 'Not found']]
      return userDetails.map(([key, value]) => { return { key, value } })
    },
    visibleData () {
      return this.userData.filter(param => param.key !== 'username')
    },
    username () {
      return this.userData.filter(param => param.key === 'username')[0].value
    }
  },
  methods: {
    goBack() {
      console.log('this.usersOpened', this.usersOpened);
      this.usersOpened ? this.$router.go(-1) : this.$router.push({path: '/users'})
    }
  }
}
</script>
