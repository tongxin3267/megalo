import { App, Page } from './mp-runtime'
import Vue from './entry-runtime-with-compiler'

export function initMPEnvironment () {
  global.Page = Page
  global.App = App
}

initMPEnvironment()

export function tick (delay) {
  jasmine.clock().install()
  jasmine.clock().tick(delay)
  jasmine.clock().uninstall()
}

export function spyFn (...args) {
  return jasmine.createSpy(...args)
}

export function getPageData (page, id) {
  return page.data.$root[id]
}

export function createPage (options, delay) {
  let shouldCloseOnEnd

  try {
    jasmine.clock().install()
    shouldCloseOnEnd = true
  } catch (e) {}

  options = Object.assign({}, options, {
    mpType: 'page'
  })

  Vue.config.warnHandler = console.warn

  new Vue(options).$mount()
  const page = Page.createInstance()
  page._init()

  // setData with throttle with leading delay
  try {
    jasmine.clock().tick(delay || 1000)
  } catch (e) {
    console.error('[createPage Error]', e)
  }

  try {
    shouldCloseOnEnd && jasmine.clock().uninstall()
  } catch (e) {
    console.error(e)
  }
  return {
    page,
    vm: page.rootVM
  }
}

export {
  App,
  Page,
  Vue
}
