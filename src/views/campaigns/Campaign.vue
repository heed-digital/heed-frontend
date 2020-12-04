<template>
<CCard style="padding: 20px"> 
    <h3>Campaign</h3>
  <div>
    <CForm>
        <CRow>
        <CCol sm="6">
            <CInput
            label="Campaign name"
            placeholder="Campaign name"
            v-on:update:value="onCampaignNameInput"
            :value="campaignData.name"
            />
        </CCol>
        <CCol sm="6">
            <CSelect
            label="Frequency"
            :options="['Twice daily', 'Daily', 'Four times per week', 'Three times per week', 'Twice per week', 'Weekly']"
            v-on:update:value="onFrequencyInput"
            placeholder="Set frequency"
            description="How often learning modules are sent"
             :value="campaignData.frequency"
            />
        </CCol>
        <CCol sm="6">
            <div style="padding-bottom:5px">Start date</div>
            <!-- <CForm :inline="true" :label="Set a date"> -->
            <datepicker 
            :inline="true" 
            :monday-first="true " 
            :full-month-name="true" 
            :language="nbNO" 
            :disabled-dates="state.disabledDates"
            :value="campaignData.start_date"
            :format="datepickerFormatter"
            @selected="onCampaignStartdateInput" 
            >
            </datepicker>
            <!-- </CForm> -->
        </CCol>
        <CCol sm="6">
            <CInputCheckbox
            label="Campaign active"
            :checked="campaignData.active"
            v-on:update:checked="onCampaignActiveInput"
            description="Campaign is active or inactive"
            :value="campaignData.active"
            />
        </CCol>
        
         </CRow>
        <CRow>
        
        </CRow>
        <button class="btn btn-light text-center float-right" v-on:click="onCancel" style="margin-left: 10px; margin-top: 20px; margin-bottom:20px">Cancel</button>
        <button class="btn btn-success text-center float-right" v-on:click="onSubmitCampaign" style="margin-left: 10px; margin-top: 20px; margin-bottom:20px"><b>Update campaign</b></button>
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
            name : 'testing',
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
        // this.$store.create_campaign = {}; // make sure it's clean & ready
    },
    computed : {
        campaignData () {
            const id = this.$route.params.id;
            const campaign = (this.$store && this.$store.campaigns) ? this.$store.campaigns.find((campaign, index) => campaign.id == id) : false;
            this.$store.campaign = campaign;
            console.log('-> campaign', campaign);
            return campaign || {};
        },
    },
    methods: {

        datepickerFormatter (date) {
            console.log('datepickerFormatter', date);
            var d = new Date(date);
            return d.toDateString();
        },

        getChecked (active) {
            if (active) return 'checked';
            return '';
        },
        onSubmitCampaign (val) {
            
            console.log('submitCampaign', this.$store.campaign);

            // set endpoint
            var endpoint = '/campaigns/' + this.$route.params.id;

            // post
            this.$http.put(endpoint, this.$store.campaign,
            {
                headers: {'X-Heed-Account-Id': getAccountId()}, // todo: use cognito instead
            })
            .then(function (response) {
                console.log('created new campaign: ', response);
            })
            .catch(function (err) {
                console.log('axios post error: ', err, err.response);
            });

            console.log('going to /campaigns');

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
            this.$store.campaign[key] = val;
            console.log('this.store', this.$store.campaign); 
        },
        onCampaignNameInput(val) {
            console.log('name', val);
            this.onInput('name', val);
        },
        onFrequencyInput(val) {
            console.log('frequency', val);
            this.onInput('frequency', val);
        },
        onCampaignStartdateInput(val) {
            console.log('SAVE start_date', val);
            this.onInput('start_date', val);
        },
        onCampaignActiveInput(val) {
            this.onInput('active', val);
        },
    }
}
</script>
