import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
    sidebarShow: 'responsive',
    sidebarMinimize: false,
    users : [],
    auth : {},
    campaigns : [],
}

const mutations = {
    toggleSidebarDesktop (state) {
        const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
        state.sidebarShow = sidebarOpened ? false : 'responsive'
    },
    toggleSidebarMobile (state) {
        const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
        state.sidebarShow = sidebarClosed ? true : 'responsive'
    },
    set (state, [variable, value]) {
        state[variable] = value
    },
    setCampaigns (campaigns) {
        state.campaigns = campaigns;
    },
}

const getters = {
    campaigns : function (state) {
        return state.campaigns;
    }
}

export default new Vuex.Store({
    state,
    mutations,
    getters
})