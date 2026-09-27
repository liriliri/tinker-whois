import trim from 'licia/trim'
import type { Store } from './store'

export function createMcpApi(getStore: () => Store) {
  const callTool = (name: string, args: Record<string, unknown>) => {
    if (name !== 'query') {
      throw new Error(`Unknown tool "${name}"`)
    }
    return query(getStore(), args as { resource: string })
  }

  tinker.registerMcp({ callTool })

  return { callTool }
}

async function query(store: Store, args: { resource: string }) {
  await store.queryWith(trim(args.resource))
  return {
    query: store.query,
    loading: store.loading,
    result: store.result,
  }
}
