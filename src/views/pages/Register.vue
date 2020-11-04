<template>
  <div class="d-flex align-items-center min-vh-100">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm>
                <h1>Opprett bruker</h1>
                <p class="text-muted">Opprett konto for din organisasjon</p>
                <!-- <CInput
                  placeholder="Username"
                  autocomplete="username"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput> -->
                <CInput
                  placeholder="Navn på organisasjon"
                  prepend="@"
                  v-on:update:value="onInputName"
                />
                <CInput
                  placeholder="Din epost..."
                  autocomplete="email"
                  prepend="@"
                  v-on:update:value="onInputEmail"
                />
                <CInput
                  placeholder="Passord"
                  type="password"
                  autocomplete="new-password"
                  v-on:update:value="onInputPass"
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                
                <CButton col="6" color="success" v-on:click="onClickRegister" block>Opprett konto</CButton>
              </CForm>
            </CCardBody>
            <!-- todo:
              -   autogenerate strong password 
              -   validate password
              -   show/hide password https://codepen.io/ivansieder/pen/gvzXmG
              -   add organizaiton name
              - √ pass email to confirm dialog 
              -   lambda pre-process: create account and add account_id to user attributes

              - IMPORTANT: secure routes so not possible to access without Auth.user is set...
              - IMPORTANT: build upon this to add auth to server-side
             -->
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify';

export default {
  name: 'Register',
  created () {
      this.$store.email = ''; // make sure it's clean & ready
      this.$store.password = ''; // make sure it's clean & ready
      this.$store.org_name = ''; // make sure it's clean & ready
  },
  methods : {
    onInputName(val) {
        this.$store.org_name = val;
        console.log(this.$store.org_name);
    },
    onInputEmail(val) {
        this.$store.email = val;
        console.log(this.$store.email);
    },
    onInputPass(val) {
        this.$store.password = val;
        console.log(this.$store.password);
    },
    // onClickRegister() {

    //   // create fresh account first, 
    //   // then add account_id to Cognito user
    //   // todo: would be better to have all this logic serverside

    //   var email = this.$store.email;
    //   var password = this.$store.password;
    //   var org_name = this.$store.org_name;

    //   // set endpoint
    //   var endpoint = '/accounts'
    //   var params = {
    //     email : email,
    //     organization_name : org_name
    //   };

    //   // post
    //   this.$http.post(endpoint, params)
    //   .then(function (response) {
    //       console.log('created new account: ', response);

    //       var account = response.data;

    //       // sign up
    //       Auth.signUp({
    //           username : email,
    //           password : password,
    //           attributes: {
    //               email : email,
    //               'custom:account_id' : account.id
    //           }
    //       })

    //       // handle success
    //       .then(function (result) {
    //         console.log('result', result);
    //         ctx.$router.push('/confirm')
    //       })

    //       // handle erros
    //       .catch(function (err) {
    //         console.log('err', err);
    //       })

    //   })
    //   .catch(function (err) {
    //       console.log('axios post error: ', err, err.response);
    //   });

    //   // context
    //   var ctx = this;
      
      
    // },
    onClickRegister() {

      var ctx = this;

      // create fresh account first, 
      // then add account_id to Cognito user
      // todo: would be better to have all this logic serverside

      var email    = this.$store.email;
      var password = this.$store.password;
      var org_name = this.$store.org_name;

      // todo: ensure values exist

      // sign up
      Auth.signUp({
          username : email,
          password : password,
          attributes: {
              email : email,
              'custom:organization_name' : org_name
          }
      })

      // handle success
      .then(function (result) {
        console.log('result', result);
        ctx.$router.push('/confirm')
      })

      // handle erros
      .catch(function (err) {
        console.log('err', err);
      })
      
    }
  }
}


</script>
