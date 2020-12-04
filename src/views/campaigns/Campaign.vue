<template>
<CCard style="padding: 20px"> 
    <h3>Campaign</h3>
  <div>
    <CForm>
        <CRow>
            <CCol sm="8">
                <CInput
                label="Campaign name"
                placeholder="Campaign name"
                v-on:update:value="onCampaignNameInput"
                :value="campaignData.name"
                />
        
                <CSelect
                label="Frequency"
                :options="['Twice daily', 'Daily', 'Four times per week', 'Three times per week', 'Twice per week', 'Weekly']"
                v-on:update:value="onFrequencyInput"
                placeholder="Set frequency"
                description="How often learning modules are sent"
                :value="campaignData.frequency"
                />
                <CInputCheckbox
                label="Campaign active"
                :checked="campaignData.active"
                v-on:update:checked="onCampaignActiveInput"
                description="Campaign is active or inactive"
                :value="campaignData.active"
                />
            </CCol>
            <CCol sm="4">
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
                <br>
                
            </CCol>
       
        </CRow>
        <CRow>
            <CCol sm="12">
                <span style="font-size: 1.4em;">Campaign users</span>
                <br>
                <br>
                <CDataTable
                hover
                striped
                :items="items"
                :fields="fields"
                :items-per-page="20"
                :sorter='{ external: false, resetable: false }'
                :sorterValue='{column: "last_name", asc:true}'
                :responsive="false"
                :active-page="activePage"
                @row-clicked="rowClicked"
                :pagination="{ doubleArrows: false, align: 'center'}"
                @page-change="pageChange"
                >
                <template #active="{item}">
                <td>
                    <CBadge :color="getBadge(item.active)">
                    {{getBadgeText(item.active)}}
                    </CBadge>
                </td>
                </template>
                
            </CDataTable>

        </CCol>
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
            // items : this.$store.users || this.fetchUsers(),
            items : this.$store.campaign_users || this.getCampaignUsers(),
            fields: [
            { key: 'active' },
            { key: 'first_name' },
            { key: 'last_name' },
            { key: 'department' },
            
            ],
            message: "",
            name : 'testing',
            state : {
                disabledDates: {
                    to: new Date(new Date().setDate(new Date().getDate() - 1)), // Disable all dates up to and not including today
                }
            },
            en : en,
            nbNO : nbNO,
            activePage: 1
        }
    },
    created () {
        // this.$store.create_campaign = {}; // make sure it's clean & ready
        console.log('craeted!');
        this.$store.campaign_users = null;
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

        getBadge (status) {
            console.log('status', status);
            var color = status ? 'success' : 'danger'; // secondary, warning, danger
            return color;
        },

        getBadgeText (status) {
            console.log('statust', status);
            var text = status ? 'Active' : 'Inactive';
            return text;
        },

        rowClicked (item, index) {
            console.log('item', item);
            // this.$router.push({path: 'users/' + item.id})
        },
        pageChange (val) {
            this.$router.push({ query: { page: val }})
        },

        getCampaignId () {
            console.log('getCampaignId', this.$store.campaign);
            if (!this.$store.campaign) return false;
            return this.$store.campaign.id;
        },

        getCampaignUsers () {
            var campaign_id = this.getCampaignId();
            if (!campaign_id) {
                console.log('no campaign id!');
                return;
            }

            var endpoint = '/campaigns/' + campaign_id + '/users';
            console.log('GET', endpoint);

            this.$http.get(endpoint)
            .then((result) => {

                console.log('result', result);

                // clean up results
                var campaign_users = _.filter(result.data, function (r) {
                    return !_.isNull(r);
                });

                // these are campaign users
                console.log('campaign_users', campaign_users);

                // update data
                this.items = campaign_users; 

                // store
                // this.$store.campaign_users = clean;

            })
            .catch((e) => {
                console.log('fetchUsers axios error: ', e);
            });
        },

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
        onCampaignUserActiveCheckbox(val) {
            console.log('onCampaignUserActiveCheckbox', val);
        },
    }
}
</script>
