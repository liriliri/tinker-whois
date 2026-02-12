import isIp from 'licia/isIp'
import { whoisDomain, whoisIp, whoisAsn } from 'whoiser'
import { parseWhoisData, ParsedWhoisData } from './whoisParser'

const WHOIS_TIMEOUT = 10000

export interface WhoisResult {
  success: boolean
  data?: string
  parsed?: ParsedWhoisData
  error?: string
  server?: string
}

// Type definitions for whoiser responses
interface WhoisDataBase {
  __raw?: string
  __comments?: string[]
  [key: string]: unknown
}

function isASN(str: string): boolean {
  return /^(?:as|asn)?\d+$/i.test(str)
}

function extractRawData(result: WhoisDataBase): string {
  if ('__raw' in result && result.__raw) {
    return result.__raw as string
  }
  // If no __raw, return a formatted version of the data
  return Object.entries(result)
    .filter(([key]) => !key.startsWith('__'))
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${key}: ${v}`).join('\n')
      }
      return `${key}: ${value}`
    })
    .join('\n')
}

function extractServerInfo(result: WhoisDataBase): string {
  if ('source' in result && typeof result.source === 'string') {
    return result.source
  }
  return 'IANA WHOIS'
}

async function queryDomainResource(domain: string): Promise<WhoisResult> {
  try {
    const results = (await whoisDomain(domain, {
      timeout: WHOIS_TIMEOUT,
      follow: 2,
      raw: true,
    })) as Record<string, WhoisDataBase>

    const servers = Object.keys(results)
    if (servers.length === 0) {
      return {
        success: false,
        error: 'No WHOIS data found for this domain',
      }
    }

    // Get the first (primary) result
    const primaryServer = servers[0]
    const result = results[primaryServer]

    if ('error' in result) {
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
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

async function queryIPResource(ip: string): Promise<WhoisResult> {
  try {
    const result = (await whoisIp(ip, {
      timeout: WHOIS_TIMEOUT,
    })) as WhoisDataBase

    const rawData = extractRawData(result)
    const server = extractServerInfo(result)

    return {
      success: true,
      data: rawData,
      server,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

async function queryASNResource(asn: string): Promise<WhoisResult> {
  try {
    const normalizedASN = asn.replace(/^(?:as|asn)/i, '')
    const asnNumber = parseInt(normalizedASN, 10)

    if (isNaN(asnNumber)) {
      return {
        success: false,
        error: 'Invalid ASN format',
      }
    }

    const result = (await whoisAsn(asnNumber, {
      timeout: WHOIS_TIMEOUT,
    })) as WhoisDataBase

    const rawData = extractRawData(result)
    const server = extractServerInfo(result)

    return {
      success: true,
      data: rawData,
      server,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function whoisQuery(resource: string): Promise<WhoisResult> {
  const trimmedResource = resource.trim().toLowerCase()

  if (!trimmedResource) {
    return {
      success: false,
      error: 'Please enter a domain, IP address, or ASN',
    }
  }

  if (isIp(trimmedResource)) {
    return queryIPResource(trimmedResource)
  } else if (isASN(trimmedResource)) {
    return queryASNResource(trimmedResource)
  } else {
    return queryDomainResource(trimmedResource)
  }
}
