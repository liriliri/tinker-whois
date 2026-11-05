import endWith from 'licia/endWith'
import filter from 'licia/filter'
import has from 'licia/has'
import isArr from 'licia/isArr'
import isEmpty from 'licia/isEmpty'
import isIp from 'licia/isIp'
import isStr from 'licia/isStr'
import isUrl from 'licia/isUrl'
import keys from 'licia/keys'
import lowerCase from 'licia/lowerCase'
import map from 'licia/map'
import safeGet from 'licia/safeGet'
import startWith from 'licia/startWith'
import toInt from 'licia/toInt'
import trim from 'licia/trim'
import Url from 'licia/Url'
import psl from 'psl'
import { whoisDomain, whoisIp, whoisAsn } from 'whoiser'
import { errorMessage } from '../common/util'
import { parseWhoisData } from './whoisParser'
import type { WhoisResult } from '../common/types'

const WHOIS_TIMEOUT = 10000

interface WhoisDataBase {
  __raw?: string
  __comments?: string[]
  [key: string]: unknown
}

function isASN(str: string): boolean {
  return /^(?:as|asn)?\d+$/i.test(str)
}

/** Accept bare domains/IPs/ASNs, or URLs like https://www.google.com/path. */
function normalizeResource(resource: string): string {
  let value = lowerCase(trim(resource))
  if (!value) return value

  if (isUrl(value) || startWith(value, '//')) {
    const parsed = new Url(startWith(value, '//') ? `http:${value}` : value)
    if (parsed.hostname) {
      value = parsed.hostname
    }
  }

  const slashIdx = value.indexOf('/')
  if (slashIdx !== -1) {
    value = value.slice(0, slashIdx)
  }

  if (startWith(value, '[') && endWith(value, ']')) {
    value = value.slice(1, -1)
  }

  if (endWith(value, '.')) {
    value = value.slice(0, -1)
  }

  return value
}

/** WHOIS is for registrable domains (eTLD+1), not subdomains like www. */
function toRegistrableDomain(hostname: string): string {
  return psl.get(hostname) || hostname
}

function extractRawData(result: WhoisDataBase): string {
  if (has(result, '__raw') && result.__raw) {
    return result.__raw as string
  }

  return map(
    filter(result, (_, key) => !startWith(key, '__')),
    (value, key) => {
      if (isArr(value)) {
        return map(value, (v) => `${key}: ${v}`).join('\n')
      }
      return `${key}: ${value}`
    },
  ).join('\n')
}

function extractServerInfo(result: WhoisDataBase): string {
  const source = safeGet(result, 'source')
  return isStr(source) ? source : 'ianaWhois'
}

async function queryWhoiserResource(
  fetcher: () => Promise<WhoisDataBase>,
): Promise<WhoisResult> {
  try {
    const result = await fetcher()
    return {
      success: true,
      data: extractRawData(result),
      server: extractServerInfo(result),
    }
  } catch (error) {
    return {
      success: false,
      error: errorMessage(error),
    }
  }
}

async function queryDomainResource(domain: string): Promise<WhoisResult> {
  try {
    const results = (await whoisDomain(domain, {
      timeout: WHOIS_TIMEOUT,
      follow: 2,
      raw: true,
    })) as Record<string, WhoisDataBase>

    const servers = keys(results)
    if (isEmpty(servers)) {
      return {
        success: false,
        error: 'noWhoisData',
      }
    }

    const primaryServer = servers[0]
    const result = results[primaryServer]

    if (has(result, 'error')) {
      return {
        success: false,
        error: result.error as string,
      }
    }

    const rawData = extractRawData(result)
    const parsed = parseWhoisData(rawData)

    return {
      success: true,
      data: rawData,
      ...(parsed && { parsed }),
      server: primaryServer,
    }
  } catch (error) {
    return {
      success: false,
      error: errorMessage(error),
    }
  }
}

export async function whoisQuery(resource: string): Promise<WhoisResult> {
  const normalized = normalizeResource(resource)

  if (!normalized) {
    return {
      success: false,
      error: 'emptyResource',
    }
  }

  if (isIp(normalized)) {
    return queryWhoiserResource(() =>
      whoisIp(normalized, { timeout: WHOIS_TIMEOUT }),
    )
  }

  if (isASN(normalized)) {
    const asnNumber = toInt(normalized.replace(/^(?:as|asn)/i, ''))
    return queryWhoiserResource(() =>
      whoisAsn(asnNumber, { timeout: WHOIS_TIMEOUT }),
    )
  }

  return queryDomainResource(toRegistrableDomain(normalized))
}
