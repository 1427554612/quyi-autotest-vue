import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/workstand',
    children: [{
      path: 'workstand',
      name: '工作台',
      component: () => import('@/views/workstand/index'),
      meta: { title: '工作台', icon: 'dashboard' }
    }]
  },
  // 测试配置管理
  {
    path: '/test-config',
    component: Layout,
    redirect: '/test-config/config-list',
    name: '测试配置',
    meta: { title: '测试配置', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/config-list',
        name: '测试配置列表',
        component: () => import('@/views/test-config/config-list'),
        meta: { title: '测试配置列表', icon: 'table' }
      },
      {
        path: '/config-add',
        name: '新增测试配置',
        component: () => import('@/views/test-config/config-add'),
        meta: { title: '新增测试配置', icon: 'tree' }
      },
      {
        path: `/config-edit/:configId`,
        name: '编辑测试配置',
        component: () => import('@/views/test-config/config-add'),
        meta: { title: '编辑测试配置', icon: 'tree' },
        hidden:true
      }
    ]
  },
  // 接口用例管理
  {
    path: '/api-autotest',
    component: Layout,
    redirect: '/api-autotest',
    name: '接口用例管理',
    meta: { title: '接口用例管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/api-test-list',
        name: '接口用例列表',
        component: () => import('@/views/api-autotest/api-test-list'),
        meta: { title: '接口用例列表', icon: 'table' }
      },
      {
        path: '/api-test-edit',
        name: '编辑测试用例',
        component: () => import('@/views/api-autotest/api-test-edit'),
        meta: { title: '编辑测试用例', icon: 'table' }
      }
    ]
  },
  // 定时任务管理
  {
    path: '/test-task',
    component: Layout,
    redirect: '/test-task/task-list',
    name: '定时任务管理',
    meta: { title: '定时任务管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/task-list',
        name: '定时任务列表',
        component: () => import('@/views/test-task/task-list'),
        meta: { title: '定时任务列表', icon: 'table' }
      }
    ]
  },
  // 结果管理
  {
    path: '/test-result',
    component: Layout,
    redirect: '/test-result/result-list',
    name: '结果管理',
    meta: { title: '结果管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/result-list',
        name: '结果管理',
        component: () => import('@/views/test-result/result-list'),
        meta: { title: '结果管理', icon: 'table' }
      },
      {
        path: '/result-info-list/:result_id',
        name: '结果详情',
        component: () => import('@/views/test-result/result-info-list'),
        meta: { title: '结果详情', icon: 'table' },
        hidden:true
      },
      {
        path: '/log-list',
        name: '日志管理',
        component: () => import('@/views/test-result/log-list'),
        meta: { title: '日志管理', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
  {
    path: '/demo',
    component: Layout,
    children: [
      {
        path: '/codemirrorDemo',
        name: '插件测试',
        component: () => import('@/views/demo/codemirrorDemo'),
        meta: { title: '插件测试', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
