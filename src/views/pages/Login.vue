<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <div class="heed-logo-maximized" style="width:auto; height:100px; background-size:200px;"></div>
                  <h1 class="title">Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <CInput
                    placeholder="Username"
                    autocomplete="username email"
                    v-on:update:value="onInputUsername"
                  >
                    <template #prepend-content><CIcon name="cil-user"/></template>
                  </CInput>
                  <CInput
                    placeholder="Password"
                    type="password"
                    autocomplete="curent-password"
                    v-on:update:value="onInputPass"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CRow>
                    <CCol col="4" class="text-left">
                      <CButton color="success" class="px-4" v-on:click="onClickSignIn">Login</CButton>
                    </CCol>
                    <CCol col="8" class="text-right">
                      <!-- <CButton color="link" class="px-0">Forgot password?</CButton> -->
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard
              color="primary"
              text-color="white"
              class="text-center py-5 d-md-down-none"
              body-wrapper
            >
              <CCardBody>
                <br><br>
                <h2>Sign up</h2>
                <p><a href="https://heed.to" style="color: white; ">Contact us</a> if you would like to open an account. </p>
                
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify';

export default {
  name: 'Login',
  created () {
      this.$store.username = ''; // make sure it's clean & ready
      this.$store.pass = ''; // make sure it's clean & ready
  },
  methods : {
    onClickRegister () {
      // window.location.href = 'https://heed.to/no/demo/';
    },

    onClickSignIn () {

      // context
      var ctx = this;

      // get vars
      var username = this.$store.username;
      var pass = this.$store.pass;
      try {

            // sign in
            Auth.signIn(username, pass)

            // handle success
            .then(function (result) {
               console.log('Auth.signIn: user', result);
               ctx.$router.push('/');
            })

            // handle error
            .catch(function (err) {
              console.log('Auth.signIn: err', err);
            });

        // handle general errors
        } catch (error) {
            console.log('Auth.signIn: error signing in', error);
        }
    },
   
    onInputUsername(val) {
        this.$store.username = val;
    },
    onInputPass(val) {
        this.$store.pass = val;
    },
  }
}

</script>
