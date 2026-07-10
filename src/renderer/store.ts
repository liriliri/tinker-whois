import { makeAutoObservable } from 'mobx'
import isStrBlank from 'licia/isStrBlank'
import trim from 'licia/trim'
import { toErrorMessage } from '../common/errorMessage'
import type { WhoisResult } from '../common/types'

class Store {
  query: string = ''
  result: WhoisResult | null = null
  loading: boolean = false

  constructor() {
    makeAutoObservable(this)
  }

  setQuery(query: string) {
    this.query = query
  }

  setResult(result: WhoisResult | null) {
    this.result = result
  }

  setLoading(loading: boolean) {
    this.loading = loading
  }

  async queryWith(query: string) {
    this.setQuery(query)
    await this.executeQuery()
  }

  async executeQuery() {
    if (isStrBlank(this.query)) {
      return
    }

    this.setLoading(true)
    this.setResult(null)

    try {
      const res = await whois.query(trim(this.query))
      this.setResult(res)
    } catch (error) {
      this.setResult({
        success: false,
        error: toErrorMessage(error),
      })
    } finally {
      this.setLoading(false)
    }
  }
}

const store = new Store()

export default store
