import type { ParsedWhoisData } from '../common/types'

const NOT_FOUND_PATTERNS = [
  'no match',
  'not found',
  'no data found',
  'no entries found',
  'domain not found',
  'no match for',
  'no matching record',
  'does not exist',
  'not registered',
  'available for registration',
]

function extractField(text: string, patterns: string[]): string | undefined {
  for (const pattern of patterns) {
    const regex = new RegExp(`${pattern}:?\\s*(.+)`, 'i')
    const match = text.match(regex)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  return undefined
}

function extractMultipleFields(text: string, patterns: string[]): string[] {
  const seen = new Set<string>()
  const results: string[] = []
  for (const pattern of patterns) {
    const regex = new RegExp(`${pattern}:?\\s*(.+)`, 'gi')
    let match
    while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
        const value = match[1].trim()
        if (value && !seen.has(value)) {
          seen.add(value)
          results.push(value)
        }
      }
    }
  }
  return results
}

export function parseWhoisData(rawData: string): ParsedWhoisData | null {
  const lowerData = rawData.toLowerCase()

  if (NOT_FOUND_PATTERNS.some((pattern) => lowerData.includes(pattern))) {
    return null
  }

  const parsed: ParsedWhoisData = {}

  parsed.domainName = extractField(rawData, ['Domain Name', 'domain', 'Domain'])

  parsed.registrar = extractField(rawData, [
    'Registrar',
    'Sponsoring Registrar',
    'Registrar Name',
  ])

  parsed.registrarUrl = extractField(rawData, [
    'Registrar URL',
    'Registrar Web',
  ])

  parsed.creationDate = extractField(rawData, [
    'Creation Date',
    'Created',
    'Created Date',
    'Registration Time',
    'Registered',
    'Domain Registration Date',
  ])

  parsed.expiryDate = extractField(rawData, [
    'Expiry Date',
    'Expiration Date',
    'Expires',
    'Registry Expiry Date',
    'Expiration Time',
    'Paid-till',
  ])

  parsed.updatedDate = extractField(rawData, [
    'Updated Date',
    'Last Updated',
    'Modified',
    'Last Modified',
  ])

  const statusList = extractMultipleFields(rawData, [
    'Domain Status',
    'Status',
    'state',
  ])
  if (statusList.length > 0) {
    parsed.status = statusList
  }

  const nameServers = extractMultipleFields(rawData, [
    'Name Server',
    'Nameserver',
    'nserver',
    'DNS',
  ])
  if (nameServers.length > 0) {
    parsed.nameServers = nameServers
  }

  parsed.dnssec = extractField(rawData, ['DNSSEC', 'dnssec'])

  const hasMinimalData =
    parsed.registrar && (parsed.creationDate || parsed.expiryDate)

  if (!hasMinimalData) {
    return null
  }

  return parsed
}
