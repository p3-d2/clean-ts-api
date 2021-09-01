export class ServerError extends Error {
  constructor (stack: string | null = null) {
    super('Internal server error')
    this.name = 'ServerError'
    this.stack = stack
  }
}
