import get from 'lodash/get'
import axios from 'axios'

import { getAPIHostname } from './apiTarget'

export interface CreateTradePayload {
  idempotencyKey: string
  quoteId: string
}

const instance = axios.create({
  baseURL: getAPIHostname(),
})

/**
 * Global error handler:
 * Intercepts all axios reponses and maps
 * to errorHandler object
 */
instance.interceptors.response.use(
  function (response) {
    if (get(response, 'data.data')) {
      return response.data.data
    }
    return response
  },
  function (error) {
    let response = get(error, 'response')
    if (!response) {
      response = error.toJSON()
    }
    return Promise.reject(response)
  }
)

const nullIfEmpty = (prop: string | undefined) => {
  if (prop !== undefined && prop.trim() === '') {
    return undefined
  }
  return prop
}

/** Returns the axios instance */
function getInstance() {
  return instance
}

/**
 * Create trade
 * @param {*} payload
 */
function createTrade(payload: CreateTradePayload) {
  const url = 'v1/exchange/trades'
  return instance.post(url, payload)
}

/**
 * Get trade
 * @param {String} tradeId
 */
function getTradeById(tradeId: string) {
  const url = `v1/exchange/trades/${tradeId}`

  return instance.get(url)
}

/**
 * Get trades
 * @param {String} status
 * @param {String} settlementId
 * @param {String} from
 * @param {String} to
 * @param {String} pageBefore
 * @param {String} pageAfter
 * @param {String} pageSize
 */
function getTrades(
  status: string,
  settlementId: string,
  from: string,
  to: string,
  pageBefore: string,
  pageAfter: string,
  pageSize: string
) {
  const queryParams = {
    status: nullIfEmpty(status),
    context: nullIfEmpty(settlementId),
    from: nullIfEmpty(from),
    to: nullIfEmpty(to),
    pageBefore: nullIfEmpty(pageBefore),
    pageAfter: nullIfEmpty(pageAfter),
    pageSize: nullIfEmpty(pageSize),
  }

  const url = 'v1/exchange/trades'

  return instance.get(url, { params: queryParams })
}
export default {
  getInstance,
  createTrade,
  getTradeById,
  getTrades,
}
