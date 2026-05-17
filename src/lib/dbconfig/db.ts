import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as authSchema from './schema'
import * as atomquestSchema from './atomquest'

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
}

const pg = neon(process.env.DATABASE_URL)
export const db = drizzle({
    client: pg,
    schema: { ...authSchema, ...atomquestSchema },
})
