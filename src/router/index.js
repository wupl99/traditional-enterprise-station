import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'//@就是指src目录
import NewsIndex from '@/views/news/index'
import NewsList from '@/views/news/list'
import NewsDetail from '@/views/news/detail'
import ProductIndex from '@/views/product/index'
import ProductList from '@/views/product/list'
import ProductDetail from '@/views/product/detail'
import Contact from '@/views/contact'
import Profile from '@/views/profile'
import Admin from '@/admin/admin'
import AdminIndex from '@/admin/index/index'
import AdminNews from '@/admin/news/index'
import AdminNewsAdd from '@/admin/news/add'
import AdminNewsEdit from '@/admin/news/edit'
import AdminProduct from '@/admin/product/index'
import AdminProductAdd from '@/admin/product/add'
import AdminProductEdit from '@/admin/product/edit'
import AdminContact from '@/admin/contact/index'
import AdminProfile from '@/admin/profile/index'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {//配置一个路由
      path: '/',
      name: 'index',
      component: Index
    },
    {//配置一个路由
      path: '/news',
      name: 'news',
      component: NewsIndex,
      children: [
        {//配置一个路由
          path: 'list',
          name: 'news list',
          component: NewsList
        },
        {//配置一个路由
          path: 'detail/:id',
          name: 'news detail',
          component: NewsDetail
        }
      ]
    },
    {//配置一个路由
      path: '/product',
      name: 'product',
      component: ProductIndex,
      children: [
        {//配置一个路由
          path: 'list',
          name: 'product list',
          component: ProductList
        },
        {//配置一个路由
          path: 'detail/:id',
          name: 'product detail',
          component: ProductDetail
        }
      ]
    },
    {//配置一个路由
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {//配置一个路由
      path: '/profile',
      name: 'profile',
      component: Profile
    },

    {//后台路由
      path:'/admin',
      name:'admin',
      component:Admin,
      children:[
        {
          path: 'index',
          name: 'admin index',
          component: AdminIndex,
        },
        {
          path: 'news',
          name: 'admin news',
          component: AdminNews,
        },
        {
          path: 'news/add',
          name: 'admin news add',
          component: AdminNewsAdd,
        },
        {
          path: 'news/edit/:id',
          name: 'admin news edit',
          component: AdminNewsEdit,
        },
        {
          path: 'product',
          name: 'admin product',
          component: AdminProduct,
        },
        {
          path: 'product/add',
          name: 'admin product add',
          component: AdminProductAdd,
        },
        {
          path: 'product/edit/:id',
          name: 'admin product edit',
          component: AdminProductEdit,
        },
        {
          path: 'contact',
          name: 'admin contact',
          component: AdminContact,
        },
        {
          path: 'profile',
          name: 'admin profile',
          component: AdminProfile,
        },
      ]
    }
  ]
})