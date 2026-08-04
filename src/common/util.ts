import isErr from 'licia/isErr'
import toStr from 'licia/toStr'

export function toErrorMessage(error: unknown): string {
  return isErr(error) ? error.message : toStr(error)
}
