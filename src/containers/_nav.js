// - dette er hva som faktisk dukker opp i UI'en... 
// - handlingene styres i routes/index.js
// - ved å fjerne begge, blir det borte i UI'en og handlingen blir borte
// - ved å fjerne bare routeren, forblir den i UI'en, men redirecter til tom side på path
// - html til sidene ligger i /views/ folderen


export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer',
        // badge: {
        //   color: 'primary',
        //   text: 'NEW'
        // }
      },
     
      {
        _name: 'CSidebarNavTitle',
        _children: ['Overview']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Campaigns',
        to: '/campaigns',
        icon: 'cil-layers'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Users',
        to: '/users',
        icon: 'cil-user'
      },
      
      {
        _name: 'CSidebarNavDivider',
        _class: 'm-2'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Extras']
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Pages',
        route: '/login',
        icon: 'cil-star',
        items: [
          {
            name: 'Login',
            to: '/login'
          },
          {
            name: 'Register',
            to: '/pages/register'
          },
          {
            name: 'Error 404',
            to: '/pages/404'
          },
          {
            name: 'Error 500',
            to: '/pages/500'
          }
        ]
      },
     
    ]
  }
]