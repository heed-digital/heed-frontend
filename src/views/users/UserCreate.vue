<template>
<CCard style="padding: 20px"> 
    <h3>Create user</h3>
  <div>
    <CForm>
        <CRow>
        <CCol sm="6">
            <CInput
            label="First name *"
            placeholder="First name"
            v-on:update:value="onFirstNameInput"
            />
        </CCol>
        <CCol sm="6">
            <CInput
            label="Last name *"
            placeholder="Last name"
            v-on:update:value="onLastNameInput"
            />
        </CCol>
        </CRow>
        <CRow>
        <CCol sm="6">
            <CInput
            label="Email *"
            type="email"
            key="create_user_email"
            placeholder="user@example.com"
            v-on:update:value="onEmailInput"
            description="* required"
            />
        </CCol>
        <CCol sm="6">
            <CInput
            label="Phone number *"
            placeholder="90807060"
            v-on:update:value="onPhoneInput"
            />
        </CCol>
        </CRow>
        
        <hr>
        <div style="padding-bottom: 20px"><i>The items below are not required, but can give you valuable information about your organization:</i></div>
        
        <CRow>
        <CCol sm="6">
            <CSelect
            label="Department"
            :options="['Administration', 'IT Department', 'Production', 'Research & Development', 'Purchasing', 'Marketing & Sales', 'Human Resources', 'Accounting & Finance',  'Other / Unknown']"
            v-on:update:value="onDepartmentInput"
            placeholder="Select department"
            />
        </CCol>
        <CCol sm="6">
            <CSelect
            label="Joined organization"
            :options="['Over 10 years ago', 'Over 5 years ago', '5 years ago', '4 years ago', '3 years ago', '2 years ago', '1 year ago', '6 months ago', 'Newly employed', 'Unknown']"
            v-on:update:value="onJoinedInput"
            placeholder="Select time"
            />
        </CCol>
         </CRow>
        <CRow>
        <CCol sm="6">
            <CInput
            label="Year born"
            placeholder="eg. 1970"
            v-on:update:value="onYearBornInput"
            />
        </CCol>
        <CCol sm="6">
            <CSelect
            label="Gender"
            :options="['Male', 'Female', 'Other / Prefer not to say']"
            v-on:update:value="onGenderInput"
            placeholder="Select gender"
            />
        </CCol>
        </CRow>
        <button class="btn btn-light text-center float-right" v-on:click="onCancel" style="margin-left: 10px">Cancel</button>
        <button class="btn btn-dark text-center float-right" v-on:click="onSubmitUser"><b>Create User</b></button>
    </CForm>
  </div>
  </CCard>
</template>

<script>
// import usersData from './UsersData'
export default {
    name: 'UserCreate',
    data () {
        return {
            message: "",
        }
    },
    created () {
        this.$store.create_user = {}; // make sure it's clean & ready
    },
    methods: {
        onSubmitUser (val) {
            console.log('submitUser');

            // set endpoint
            var endpoint = '/users';

            // post
            this.$http.post(endpoint, this.$store.create_user,
            {
                headers: {'X-Heed-Account-Id': getAccountId()}, // todo: use cognito instead
            })
            .then(response => {
                console.log('created new user: ', response);
                
                // return to users screen
                this.$router.push({path: '/users'})
            })
            .catch(e => {
                console.log('axios post error: ', e);
            });

        },
        onCancel () {
          console.log('cancel');
          this.$router.push({path: '/users'})
        },
        validator(val) {
            return val ? val.length >= 4 : false
        },
        onInput(key, val) {
            this.$store.create_user[key] = val;
            console.log('this.store', this.$store.create_user); 
        },
        onFirstNameInput(val) {
            this.onInput('first_name', val);
        },
        onLastNameInput(val) {
            this.onInput('last_name', val);
        },
        onEmailInput(val) {
            this.onInput('email', val);
        },
        onPhoneInput(val) {
            this.onInput('phone', val);
        },
        onDepartmentInput(val) {
            this.onInput('department', val);
        },
        onJoinedInput(val) {
            this.onInput('employed_since', val);
        },
        onYearBornInput(val) {
            this.onInput('year_born', val);
        },
        onGenderInput(val) {
            this.onInput('gender', val);
        },
    }
}
</script>
