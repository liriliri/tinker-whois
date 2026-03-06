import { makeAutoObservable } from 'mobx'
import type { WhoisResult } from '../common/types'

class Store {
  isDark: boolean = false

  query: string = ''
  result: WhoisResult | null = null
  loading: boolean = false

  constructor() {
    makeAutoObservable(this)
    this.initTheme()
  }

  setIsDark(isDark: boolean) {
    this.isDark = isDark
  }

  protected async initTheme() {
    try {
      const theme = await tinker.getTheme()
      this.isDark = theme === 'dark'

      tinker.on('changeTheme', async () => {
        const newTheme = await tinker.getTheme()
        this.setIsDark(newTheme === 'dark')
      })
    } catch (err) {
      console.error('Failed to initialize theme:', err)
    }
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

  async executeQuery() {
    if (!this.query.trim()) {
      return
    }

    this.setLoading(true)
    this.setResult(null)

    try {
      const res = await whois.query(this.query.trim())
      this.setResult(res)
    } catch (error) {
      this.setResult({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      this.setLoading(false)
    }
  }
}

const store = new Store()

export default store
