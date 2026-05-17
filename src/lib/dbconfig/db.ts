import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as authSchema from './schema'
import * as atomquestSchema from './atomquest'

function createDb() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set')
    }
    const pg = neon(process.env.DATABASE_URL)
    return drizzle({
        client: pg,
        schema: { ...authSchema, ...atomquestSchema },
    })
}

// Lazily initialised so the module can be imported during build
// without DATABASE_URL being present. The error is deferred until
// the first actual database call at request time.
let _db: ReturnType<typeof createDb> | undefined
export const db = new Proxy({} as ReturnType<typeof createDb>, {
    get(_target, prop) {
        if (!_db) _db = createDb()
        return (_db as unknown as Record<string | symbol, unknown>)[prop]
    },
})

