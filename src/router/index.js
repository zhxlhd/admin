import Vue from 'vue'
// import Router from 'vue-router'
const Home = () => import('@/views/Home')   
const OAuth = () => import('@/views/OAuth')   
// const Login = () => import('@/views/Login')  
const Register = () => import('@/views/Register')   
const ForgetPwd = () => import('@/views/ForgetPwd')
const Agreement = () => import('@/views/Agreement')
const AbsManagement = () => import('@/views/AbsManagement')
const BigConclusionChart = () => import('@/views/BlockchainReport/BigConclusionChart')   
if (process.env.NODE_ENV === 'development') {
  Vue.use(VueRouter)
}
export default new VueRouter({
  mode: 'history', // 去掉路由地址的#
  routes: [
    {
      path: '/epidemicSituation',
      component: () => import('@/views/Question/EpidemicSituationMap.vue')
    },
    {
      path: '/questionnaireCommunity',
      component: () => import('@/views/Question/QuestionCommunityH5.vue')
    },
    {
      path: '/questionnaire',
      component: () => import('@/views/Question/QuestionH5.vue')
    },
    {
      path: '/lightAreaQuestionnaire',
      component: () => import('@/views/Question/LightAreaQuestionCommunityH5.vue')
    },
    {
      path: '/lightAreaSchoolQuestionnaire',
      component: () => import('@/views/Question/LightAreaQuestionSchoolH5.vue')
    },
    {
      path: '/lightAreaCompanyQuestionnaire',
      component: () => import('@/views/Question/LightAreaQuestionCompanyH5.vue')
    },
    {
      path: '/agreement',
      component: Agreement
    },
    {
      path: '/login',
      component: OAuth,
      name: '',
      hidden: true
    },
    {
      path: '/conclusionChart',
      component: BigConclusionChart,
      name: '',
      hidden: true
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/forgetPwd',
      component: ForgetPwd
    },
    {
      path: '/threg',
      component: Register,
      name: '',
      hidden: true,
      redirect: { path: '/register' }
    },
    {
      path: '/',
      component: Home
    },
    {
      path: '/absManagement',
      component: AbsManagement
    }
  ]
})
