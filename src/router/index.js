import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

// Auth
// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')
const Confirm = () => import('@/views/pages/Confirm')

// Users
const Users = () => import('@/views/users/Users')
const User = () => import('@/views/users/User')
const UserCreate = () => import('@/views/users/UserCreate')

// Campaigns
const Campaigns = () => import('@/views/campaigns/Campaigns')
const CampaignCreate = () => import('@/views/campaigns/CampaignCreate')
const Campaign = () => import('@/views/campaigns/Campaign')

Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
    return [
    
    {
        path: '/',
        redirect: '/dashboard',
        name: 'Home',
        component: TheContainer,
        
        children: [
        {
            path: 'dashboard',
            name: 'Dashboard',
            component: Dashboard, // a view
        },
        {
            path: 'campaigns',
            meta: {
                label: 'Campaigns',
            },
            component: {
                render(c) {
                    return c('router-view')
                }
            },
            
            children: [
            {
                path: '',
                name: '',
                component: Campaigns,
            },
            {
                path: 'create',
                meta: {
                    label: 'Create campaign',
                },
                name: 'Create Campaign',
                component: CampaignCreate
            },
            {
                path: ':id',
                meta: {
                    label: 'Campaign Details',
                },
                name: 'Campaign',
                component: Campaign
            }],
        },
        {
            path: 'users',
            meta: {
                label: 'Users'
            },
            component: {
                render(c) {
                    return c('router-view')
                }
            },
            
            children: [
                {
                    path: '',
                    name: '',
                    component: Users
                },
                {
                    path: 'create',
                    meta: {
                        label: 'Create user'
                    },
                    name: 'Create User',
                    component: UserCreate
                },
                {
                    path: ':id',
                    meta: {
                        label: 'User Details'
                    },
                    name: 'User',
                    component: User
                }],
            }],
        },

        {
            path: '/login',
            name: 'Authentication',
            component : Login,
            meta : {
                guest : true // auth not needed
            }
        },

        { 
            path: '/register', 
            name: 'Register',
            component : Register,
            meta : {
                guest : true // auth not needed
            }
        },
        { 
            path: '/confirm', 
            name: 'Confirm',
            component : Confirm,
            meta : {
                guest : true // auth not needed
            }
        }
    ]
}

