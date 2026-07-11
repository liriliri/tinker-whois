import type { Store } from './store'

export function createMcpApi(getStore: () => Store) {
  const callTool = (name: string, args: Record<string, unknown>) => {
    if (name !== 'query') {
      return `Error: Unknown tool "${name}"`
    }
    return query(getStore(), args as { resource: string })
  }

  tinker.registerMcp({ callTool })

  return { callTool }
}

async function query(store: Store, args: { resource: string }) {
  try {
    await store.queryWith(args.resource.trim())
    return {
      query: store.query,
      loading: store.loading,
      result: store.result,
    }
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : 'WHOIS query failed'}`
  }
}
