export interface ParsedWhoisData {
  domainName?: string
  registrar?: string
  registrarUrl?: string
  creationDate?: string
  expiryDate?: string
  updatedDate?: string
  status?: string[]
  nameServers?: string[]
  dnssec?: string
}

export interface WhoisResult {
  success: boolean
  data?: string
  parsed?: ParsedWhoisData
  error?: string
  server?: string
}
