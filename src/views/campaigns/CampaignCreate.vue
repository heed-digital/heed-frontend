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
            <div style="padding-bottom:5px">Start date</div>
            <datepicker @selected="onCampaignStartdateInput" :inline="true" :monday-first="true ":full-month-name="true" :language="nbNO" :disabled-dates="state.disabledDates"></datepicker>
        </CCol>
        <CCol sm="6">
            <CInputCheckbox
            label="Campaign is active"
            checked
            v-on:update:checked="onCampaignActiveInput"
            description="Campaign is active or inactive"
            />
        </CCol>
        
         </CRow>
        <CRow>
        
        </CRow>
        <button class="btn btn-light text-center float-right" v-on:click="onCancel" style="margin-left: 10px; margin-top: 20px; margin-bottom:20px">Cancel</button>
        <button class="btn btn-dark text-center float-right" v-on:click="onSubmitCampaign" style="margin-left: 10px; margin-top: 20px; margin-bottom:20px"><b>Create campaign</b></button>
    </CForm>
  </div>
  </CCard>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import {en, nbNO} from 'vuejs-datepicker/dist/locale'

export default {
    name: 'CampaignCreate',
    components : {
        Datepicker
    },
    data () {
        return {
            message: "",
            state : {
                disabledDates: {
                    to: new Date(new Date().setDate(new Date().getDate() - 1)), // Disable all dates up to and not including today
                }
            },
            en : en,
            nbNO : nbNO
        }
    },
    created () {
        this.$store.create_campaign = {
            active : true // default
        }; // make sure it's clean & ready
    },
    methods: {
        onSubmitCampaign (val) {
            
            console.log('submitCampaign', this.$store.create_campaign);

            // set endpoint
            var endpoint = '/campaigns';

            // post
            this.$http.post(endpoint, this.$store.create_campaign,
            {
                headers: {'X-Heed-Account-Id': getAccountId()}, // todo: use cognito instead
            })
            .then(function (response) {
                console.log('created new campaign: ', response);
            })
            .catch(function (err) {
                console.log('axios post error: ', err, err.response);
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
            this.$store.create_campaign.start_date = val;
            console.log('this.store', this.$store.create_campaign); 
        },
        onCampaignActiveInput(val) {
            this.onInput('active', val);
        },
    }
}
</script>
