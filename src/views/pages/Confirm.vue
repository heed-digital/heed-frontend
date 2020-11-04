<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Bekreft epost</h1>
                  <p class="text-muted">Bekreft din epost med tilsendt kode</p>
                  <CInput
                        placeholder="Your email..."
                        autocomplete="email"
                        prepend="@"
                        v-on:update:value="onInputEmail"
                        v-model="registered_email"
                    />
                  <CInput
                    placeholder="Engangskode"
                    v-on:update:value="onInputCode"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CRow>
                    <CCol col="4" class="text-left">
                      <CButton color="primary" class="px-4" v-on:click="onClickConfirm">Confirm</CButton>
                    </CCol>
                    <CCol col="8" class="text-right">
                      <CButton color="link" class="px-0">Forgot password?</CButton>
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
  name: 'Confirm',
  created () {
      this.$store.code = ''; // make sure it's clean & ready
  },
  data () {
    return {
      registered_email : this.$store.email // works!
    }
  },
  methods : {
  
    onClickConfirm () {

        // context
        var ctx = this;

        // vars
        var username = this.$store.email;
        var code = this.$store.code;
        var password = this.$store.password;
       
        try {
            
            // confirm signup
            Auth.confirmSignUp(username, code)

            // handle success
            .then(function (result) {
                console.log('Auth.confirmSignUp: result', result);

                // sign in
                Auth.signIn(username, password)

                // handle success
                .then(function (success) {
                    console.log('Auth.confirmSignUp: success: ', success);

                    // go to dashboard
                    ctx.$router.push('/');
                })

                // handle error
                .catch(function (error) {
                    console.log('Auth.confirmSignUp: failed to sign in', error, error.response);
                })
            })
            
            // handle signup error
            .catch(function (err) {
                console.log('Auth.confirmSignUp: err', err);
            })

        // handle general errors
        } catch (error) {
            console.log('Auth.confirmSignUp: error confirming sign up', error);
        }
    },
   
    onInputEmail(val) {
        this.$store.email = val;
        console.log(this.$store.email);
    },
    onInputCode(val) {
        this.$store.code = val;
        console.log(this.$store.code);
    },
  }
}


</script>
