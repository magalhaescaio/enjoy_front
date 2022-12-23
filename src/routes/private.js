import React from 'react'

const Home = React.lazy(() => import('./../pages/private/Home'))
const Agendamentos = React.lazy(() => import('./../pages/private/Agendamentos'))
const Contatos = React.lazy(() => import('./../pages/private/Contatos'))
const Dispositivos = React.lazy(() => import('./../pages/private/Dispositivos'))
const Grupos = React.lazy(() => import('./../pages/private/Grupos'))
const NewGroup = React.lazy(() => import('./../pages/private/Grupos/newGroup'))
const Logout = React.lazy(() => import('./../pages/private/Logout'))

const Private = [
    { 
        path: "/", 
        exact: true, 
        name: "Home", 
        component: Home 
    },

    { 
        path: "/home", 
        name: "Home", 
        component: Home 
    },

    { 
        path: "/agendamentos", 
        exact: true, 
        name: "Agendamentos", 
        component: Agendamentos 
    },

    { 
        path: "/contatos", 
        exact: true, 
        name: "Contatos", 
        component: Contatos 
    },

    { 
        path: "/dispositivos", 
        exact: true, 
        name: "Dispositivos", 
        component: Dispositivos 
    },

    { 
        path: "/grupos", 
        exact: true, 
        name: "Grupos", 
        component: Grupos 
    },

    { path: "/edit/:id", name: "Edit Group", component: NewGroup },
    { path: "/register_new_group", name: "New Group", component: NewGroup },
    
    { path: "/logout", name: "Logout", component: Logout },

]

export default Private