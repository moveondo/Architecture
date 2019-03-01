import Vue from 'vue'
import Router from 'vue-router'
import QuickStart from '@/components/QuickStart'
import SpreadSheets from '@/components/SpreadSheets'
import WorkSheet from '@/components/WorkSheet'
import Column from '@/components/Column'
import DataBinging from '@/components/DataBinging'
import SpreadStyle from '@/components/SpreadStyle'
import OutLine from '@/components/OutLine'
import ExcelIO from '@/components/ExcelIO'
import BindAndValidation from '@/components/BindAndValidation'
import User from '@/components/User'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'QuickStart',
      component: QuickStart
    },
    {
      path: '/QuickStart',
      name: 'QuickStart',
      component: QuickStart
    },
    {
      path: '/GC-Spread-Sheets',
      name: 'GC-Spread-Sheets',
      component: SpreadSheets
    },
    {
      path: '/WorkSheet',
      name: 'WorkSheet',
      component: WorkSheet
    },
    {
      path: '/Column',
      name: 'Column',
      component: Column
    },
    {
      path: '/DataBinging',
      name: 'DataBinging',
      component: DataBinging
    },
    {
      path: '/SpreadStyle',
      name: 'SpreadStyle',
      component: SpreadStyle
    },
    {
      path: '/OutLine',
      name: 'OutLine',
      component: OutLine
    },{
	  path: '/ExcelIO',
      name: 'ExcelIO',
      component: ExcelIO	
	},{
	  path: '/BindAndValidation',
      name: 'BindAndValidation',
      component: BindAndValidation	
	},{
	  path: '/User',
      name: 'User',
      component: User	
	}

  ]
})
