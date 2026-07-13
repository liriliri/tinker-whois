import { contextBridge } from 'electron'
import { whoisQuery } from './whoisQuery'
import type { WhoisResult } from '../common/types'

const api = {
  query: (resource: string): Promise<WhoisResult> => {
    return whoisQuery(resource)
  },
}

contextBridge.exposeInMainWorld('whois', api)

declare global {
  const whois: typeof api
}
