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
                :value="campaign.name"
                />
        
                <CSelect
                label="Frequency"
                :options="['Twice daily', 'Daily', 'Four times per week', 'Three times per week', 'Twice per week', 'Weekly']"
                v-on:update:value="onFrequencyInput"
                placeholder="Set frequency"
                description="How often learning modules are sent"
                :value="campaign.frequency"
                />
                <CInputCheckbox
                label="Campaign active"
                :checked="campaign.active"
                v-on:update:checked="onCampaignActiveInput"
                description="Campaign is active or inactive"
                :value="campaign.active"
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
                :value="campaign.start_date"
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
                :items="table"
                :fields="table_fields"
                :items-per-page="20"
                :sorter='{ external: false, resetable: false }'
                :sorterValue='{column: "last_name", asc:true}'
                :responsive="false"
                :active-page="activePage"
                :pagination="{ doubleArrows: false, align: 'center'}"
                @page-change="pageChange"
                >
                <template #active="{item}">
                <td>
                    <CBadge 
                    @click="rowClicked(item)" 
                    :color="getBadge(item.active)" 
                    style="cursor: pointer;"
                    shape="pill"
                    v-c-tooltip="'Click to toggle active status'"
                    >
                        {{getBadgeText(item.active)}}
                    </CBadge>
                </td>
                </template>
                <template #show_details="{item, index}">
                    <td class="py-2">
                    <CButton
                        color="light"
                        variant="outline"
                        square
                        size="sm"
                        @click="toggleDetails(item, index)"
                        v-c-tooltip="'Click to show user details'"
                    >
                        {{Boolean(item._toggled) ? 'Hide' : 'Show'}}
                    </CButton>
                    </td>
                </template>
                <template #details="{item}">
                <CCollapse :show="Boolean(item._toggled)" :duration="collapseDuration">
                <CCardBody>
                    <!-- <CMedia :aside-image-props="{ height: 102 }"> -->
                    <h4>
                        {{item.first_name}} {{item.last_name}}
                    </h4>
                    Department: {{item.department}}<br>
                    Employed since: {{item.employed_since}}<br>
                    Email: {{item.email}}<br>
                    Year born: {{item.year_born}}<br>
                    <!-- <CButton size="sm" color="info" class="">
                        User Settings
                    </CButton> -->
                    <!-- <CButton size="sm" color="danger" class="ml-1">
                        Delete
                    </CButton> -->
                    <!-- </CMedia> -->
                </CCardBody>
                </CCollapse>
            </template>
                
            </CDataTable>
            <template>
                <CModal
                :title=modal.title
                color="danger"
                :show.sync="warningModal"
                >   
                {{modal.content}}

                <template #footer>
                <CButton @click="onConfirmDeleteDelete" color="danger">Delete</CButton>
                <CButton @click="onConfirmDeleteCancel" color="light">Cancel</CButton>
                </template>
                </CModal>
            </template>

        </CCol>
        </CRow>
        <button class="btn btn-light text-center float-right" v-on:click="onCancel" style="margin-left: 10px; margin-top: 20px; margin-bottom:20px">Cancel</button>
        <button class="btn btn-success text-center float-right" v-on:click="onClickUpdateCampaign" style="margin-left: 10px; margin-top: 20px; margin-bottom:20px"><b>Update campaign</b></button>
        <button class="btn btn-danger text-center float-left" v-on:click="onClickDeleteCampaign" style="margin-left: 10px; margin-top: 20px; margin-bottom:20px"><b>Delete campaign</b></button>
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

            // campaign user table:
            table : this.$store.campaign_user_table || this.fetch_campaign_users(),
            
            // campaign table fields
            table_fields: [
                { key: 'active' },
                { key: 'first_name' },
                { key: 'last_name' },
                { key: 'department' },
                { key: 'show_details', label: 'Details', _style : 'max-width: 100px; width: 90px;' }
            ],

            // active campaign
            campaign : this.$store.campaign,

            // other
            message: "",
            name : 'testing',
            state : {
                disabledDates: {
                    to: new Date(new Date().setDate(new Date().getDate() - 1)), // Disable all dates up to and not including today
                }
            },
            en : en,
            nbNO : nbNO,
            activePage: 1,
            collapseDuration : 0,

            // modal popup
            warningModal : false,
            modal : {
                title : 'Confirm Delete',
                content: 'Are you sure you want to delete campaign? This can not be undone.'
            },
        }
    },
    // runs before everything, see: https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
    beforeCreate () {
        var campaign = (this.$store && this.$store.campaigns) ? this.$store.campaigns.find((campaign, index) => campaign.id == this.$route.params.id) : {}; // {} = !false
        this.$store.campaign = campaign;
        this.$store.campaign_presave = _.clone(campaign);
    },
    created () {
        this.$store.campaign_user_table = null;
    },
    destroyed () {
        this.$store.campaign_user_table = null;
    },
    computed : {
    
    },
    methods: {

        toggleDetails (item, idx, event) {
            console.log('toggleDetails');
            console.log('tiem', item, idx);
            console.log('event', event);
            console.log('table', this.table);
            var i = _.find(this.table, function (t) {
                return t.id == item.id;
            })
            this.$set(i, '_toggled', !item._toggled)
            this.collapseDuration = 300
            this.$nextTick(() => { this.collapseDuration = 0})
        },

        getBadge (status) {
            var color = status ? 'success' : 'danger'; // secondary, warning, danger
            return color;
        },
        getBadgeText (status) {
            var text = status ? 'Active' : 'Inactive';
            return text;
        },
        rowClicked (item, index, event) {
            console.log('rowClicked', item, index, event);
            this.toggleActive(item);
        },
        toggleActive (user) {
            if (this.isActive(user)) {
                this.setInactive(user);
            } else {
                this.setActive(user);
            };
        },
        isActive (user) {
            if (this.$store.users_in_campaign_object.hasOwnProperty(user.id)) return true;
            return false;
        },
        setActive (user) {
            this.$store.users_in_campaign_array.push(user);
            this.$store.users_in_campaign_object = this.toObject(this.$store.users_in_campaign_array, 'id');
            this.update_campaign_user_table();
        },
        setInactive (user) {
            delete this.$store.users_in_campaign_object[user.id];
            this.$store.users_in_campaign_array = this.toArray(this.$store.users_in_campaign_object)
            this.update_campaign_user_table();
        },
        pageChange (val) {
            this.$router.push({ query: { page: val }})
        },
        get_campaign_id () {
            if (!this.$store.campaign) return false;
            return this.$store.campaign.id;
        },
        fetch_campaign_users () {

            // users of account stored on account level
            // users in campaign stored on separate key campaign:id:users
            // our campaign GUI list must have available both lists, so we can toggle on/off
            // users should be mutated to an object by key in GUI
            // campaign users must be sent to API on PUT /campaigns/id/users
            // account users should be fetched here also, since they're not always prefetched
            // --
            // when to get users, campaign users? asap.
            // 
            // --
            // todo: 
            // 1. get account users
            // 2. get campaign users
            // 3. parse into common object
            // --
            // API addUsers takes array of user_ids
            // perhaps cleaner with setUsers, so no mistakes with adding/removing
            // otherwise a lot of tinkering when adding/removing users in GUI, API call for both adding/removing
            // although, setUsers would potentially entail sending hundreds of ids for a simple change... 
            // this goes for all changes, what's better?! 
            // every update on campaign entails a lot of work serverside with rescheduling, etc. 
            // decision: add/remove
            // --
            // TABLE needs an array of users with active key added... ie. a special list, parsed client-side
            // could perhaps just be added to 

            // -------------
            // USERS (in account) should be stored on this.$store.users, READ-ONLY (except when editing users)
            // CAMPAIGNS (in account) should be stored on this.$store.campaigns, READ-ONLY (except when editing campaigns)
            // 

            // // ensure campaign id
            // var campaign_id = this.get_campaign_id();
            // if (!campaign_id) return console.error('no campaign_id!?')
            // ==========
            // todo: 5 des, 2020
            // - implement user table in "create campaign" GUI
            // - check and document Auth / account_id / middleware
            // - add more info to table, with popout... see: https://coreui.io/vue/docs/components/table.html
            // - 

            // get campaign users
            this.pull_campaign_users(function () {

                // get all users
                this.pull_account_users(function () {

                    // update table data
                    this.update_campaign_user_table(); // 

                }.bind(this));

            }.bind(this))
           
        },

        pull_campaign_users (callback) {

            // API: get campaign users
            this.GET_campaign_users(function (result) {

                console.log('[GET_campaign_users]: result', result);

                // clean up results
                var users_in_campaign_array = _.filter(result.data, function (r) {
                    return !(r==null);
                });

                // store as array
                this.$store.users_in_campaign_array = _.clone(users_in_campaign_array);

                // store as object
                this.$store.users_in_campaign_object = this.toObject(users_in_campaign_array, 'id');

                // store as pre-saved
                this.$store.users_in_campaign_array_presave = _.clone(users_in_campaign_array);
            
                // done
                callback();

            }.bind(this));

        },
        GET_campaign_users (callback) {
            this.$http.get('/campaigns/' + this.get_campaign_id() + '/users')
            .then(callback)
            .catch((error) => {
                console.error('[GET_account_users]: axios error: ', error);
                callback();
            });
        },
        update_campaign_user_table () {
            
            // clean 
            this.$store.campaign_user_table = [];

            // iterate account users
            this.$store.users.forEach(function (user) {

                // check if user is in campaign object
                if (this.$store.users_in_campaign_object.hasOwnProperty(user.id)) {
                    // mark as active
                    user.active = true;
                } else {
                    user.active = false;
                }
                // add to campaign table
                this.$store.campaign_user_table.push(user);

            }.bind(this));

            // update items
            this.table = this.$store.campaign_user_table;

            // update GUI
            this.$forceUpdate();
        },

        pull_account_users (callback) {

            // GET /accounts/:id/users
            this.GET_account_users(function (result) {
                console.log('[GET_account_users]: result', result);
                
                // clean up results
                var users = _.filter(result.data.users, function (r) {
                    return !_.isNull(r);
                });

                // store globally
                this.$store.users = users;

                // done
                callback();

            }.bind(this));
        },

        GET_account_users (callback) {
            this.$http.get('/accounts/' + getAccountId() + '/users')
            .then(callback)
            .catch((error) => {
                console.error('[GET_account_users]: axios error: ', error);
                callback();
            });
        },
        toArray (obj) {
            var arr = [];
            for (var o in obj) {
                arr.push(obj[o]);
            }
            return arr;
        },

        toObject (users, key) {
            if (!users || !key) {
                console.log('[toObject][error]:', users, key);
                return {};
            }
            var sorted = {};
            users.forEach(function (u) {
                sorted[u[key]] = u;
            })
            return sorted;
        },
        datepickerFormatter (date) {
            var d = new Date(date);
            return d.toDateString();
        },
        getChecked (active) {
            if (active) return 'checked';
            return '';
        },
        onClickUpdateCampaign (val) {

            // save campaign data
            this.push_campaign();

            // save campaign user data
            this.push_campaign_users();

            // return to campaigns screen
            this.$router.push({path: '/campaigns'})

        },

        push_campaign () {

            if (_.isEqual(this.$store.campaign, this.$store.campaign_presave)) {
                return console.log('nothing to save');
            }

            // set endpoint
            var endpoint = '/campaigns/' + this.get_campaign_id();
            this.$http.put(endpoint, this.$store.campaign, getHeaders())
            .then(function (response) {
                console.log('[push_campaign]: response ', response);
            })
            .catch(function (err) {
                console.log('axios post error: ', err, err.response);
            });
        },
        push_campaign_users () {
           
            // get ids only
            var old_ids = _.map(this.$store.users_in_campaign_array_presave, function (i) {
                return i.id;
            })

            // get ids only
            var new_ids = _.map(this.$store.users_in_campaign_array, function (i) {
                return i.id;
            })

            // find added
            var add = _.difference(new_ids, old_ids);

            // find removed
            var rem = _.difference(old_ids, new_ids);

            // add to API
            this.add_campaign_users(add);

            // remove from API
            this.rem_campaign_users(rem);
        },

        add_campaign_users (add) {
            if (_.isEmpty(add)) return console.log('nothing to add');

            // set endpoint
            var endpoint = '/campaigns/' + this.get_campaign_id() + '/users';
            this.$http.put(endpoint, add, getHeaders())
            .then(function (response) {
                console.log('[add campaign users]: response ', response);
            })
            .catch(function (err) {
                console.log('axios post error: ', err, err.response);
            });
        },
        rem_campaign_users (rem) {
            if (_.isEmpty(rem)) return console.log('nothing to rem');

            // set endpoint
            var endpoint = '/campaigns/' + this.get_campaign_id() + '/users/remove';
            this.$http.put(endpoint, rem, getHeaders())
            .then(function (response) {
                console.log('[rem campaign users]: response ', response);
            })
            .catch(function (err) {
                console.log('axios post error: ', err, err.response);
            });
        },

        onCancel () {
          this.$router.push({path: '/campaigns'})
        },
        validator(val) {
            return val ? val.length >= 4 : false
        },
        onInput(key, val) {
            this.$store.campaign[key] = val;
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
        onCampaignUserActiveCheckbox(val) {
            console.log('onCampaignUserActiveCheckbox', val);
        },

        onClickDeleteCampaign () {
            console.log('delete campaign');
            // this.modal.title = 'Missing information'
            // this.modal.content = 'Please fill in the required information: \n' + missing.join(', ') + '.';
            this.warningModal = true;
        },

        onConfirmDeleteCancel () {
            console.log('confirm delete cancel');
            this.warningModal = false;
        },
        onConfirmDeleteDelete () {
            console.log('confirmed delete');
            this.warningModal = false;

            // delete campaign
            this.delete_campaign();
        },

        delete_campaign () {
            var campaign_id = this.get_campaign_id();
            console.log('campaign_id', campaign_id);
            console.log('this.$store.campaign',this.$store.campaign);

            // set endpoint
            var endpoint = '/campaigns/' + this.get_campaign_id();
            this.$http.delete(endpoint, getHeaders())
            .then(function (response) {
                console.log('[delete campaign]: response ', response);
            })
            .catch(function (err) {
                console.log('[delete campaign]: axios post error: ', err, err.response);
            });

            // return to campaigns screen
            this.$router.push({path: '/campaigns'}, function (e) {
                console.log('onComplete? ', e, this);
            })
            this.$forceUpdate();

        },
    }
}
</script>
