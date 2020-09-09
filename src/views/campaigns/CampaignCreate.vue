<template>
<CCard style="padding: 20px"> 
    <h3>Create campaign</h3>
  <div>
    <CForm>
        <CRow>
        <CCol sm="6">
            <CInput
            label="Campaign name"
            placeholder="Campaign name"
            v-on:update:value="onCampaignNameInput"
            />
        </CCol>
        </CRow>
        <CRow>
        <CCol sm="6">
            <CSelect
            label="Frequency"
            :options="['Twice daily', 'Daily', 'Four times per week', 'Three times per week', 'Twice per week', 'Weekly']"
            v-on:update:value="onFrequencyInput"
            placeholder="Set frequency"
            description="How often learning modules are sent"
            />
        </CCol>
        <CCol sm="6">
            <CInput
            label="Start date"
            placeholder="Set a start date"
            v-on:update:value="onCampaignStartdateInput"
            description="Set date in format DD/MM/YY"
            />
        </CCol>
         </CRow>
        <CRow>
        <CCol sm="6">
            <CInputCheckbox
            label="Campaign active"
            checked
            v-on:update:checked="onCampaignActiveInput"
            description="Campaign is active or inactive"
            />
        </CCol>
        </CRow>
        <button class="btn btn-light text-center float-right" v-on:click="onCancel" style="margin-left: 10px">Cancel</button>
        <button class="btn btn-dark text-center float-right" v-on:click="onSubmitCampaign"><b>Create Campaign</b></button>
    </CForm>
  </div>
  </CCard>
</template>

<script>
// import usersData from './UsersData'
export default {
    name: 'CampaignCreate',
    data () {
        return {
            message: "",
        }
    },
    created () {
        this.$store.create_campaign = {}; // make sure it's clean & ready
    },
    methods: {
        onSubmitCampaign (val) {
            
            console.log('submitCampaign', this.$store.create_campaign);

            // set endpoint
            var endpoint = '/campaigns';

            // post
            this.$http.post(endpoint, this.$store.create_campaign,
            {
                headers: {'X-Heed-Account-Id': 'dummy202'}, // todo: use cognito instead
            })
            .then(response => {
                console.log('created new campaign: ', response);
            })
            .catch(e => {
                console.log('axios post error: ', e);
            });

            // return to campaigns screen
            this.$router.push({path: '/campaigns'})

        },
        onCancel () {
          console.log('cancel');
          this.$router.push({path: '/campaigns'})
        },
        validator(val) {
            return val ? val.length >= 4 : false
        },
        onInput(key, val) {
            this.$store.create_campaign[key] = val;
            console.log('this.store', this.$store.create_campaign); 
        },
        onCampaignNameInput(val) {
            this.onInput('name', val);
        },
        onFrequencyInput(val) {
            this.onInput('frequency', val);
        },
        onCampaignStartdateInput(val) {
            this.onInput('start_date', val);
        },
        onCampaignActiveInput(val) {
            this.onInput('active', val);
        },
    }
}
</script>
