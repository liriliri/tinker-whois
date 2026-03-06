import { contextBridge } from 'electron'
import { whoisQuery } from './whoisQuery'
import type { WhoisResult } from '../common/types'

const whoisObj = {
  query: (resource: string): Promise<WhoisResult> => {
    return whoisQuery(resource)
  },
}

contextBridge.exposeInMainWorld('whois', whoisObj)

declare global {
  const whois: typeof whoisObj
}
