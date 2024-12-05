import get from 'lodash/get'
import axios from 'axios'

import { getAPIHostname } from './apiTarget'

export interface CreateQuotePayload {
  from: {
    amount?: string
    currency: string
  }
  to: {
    amount?: string
    currency: string
  }
  type: string
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

/** Returns the axios instance */
function getInstance() {
  return instance
}

/**
 * Create Payout
 * @param {*} payload
 */
function createQuote(payload: CreateQuotePayload) {
  const url = 'v1/exchange/quotes'
  return instance.post(url, payload)
}

export default {
  getInstance,
  createQuote,
}
