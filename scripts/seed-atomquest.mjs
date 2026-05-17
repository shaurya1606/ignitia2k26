import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL)
const passwordHash = await bcrypt.hash('AtomQuest@123', 10)
const year = new Date().getFullYear()

const thrustAreas = [
    ['Growth', 'Revenue and market expansion'],
    ['Operational Excellence', 'Efficiency and quality'],
    ['People & Culture', 'Team development'],
    ['Innovation', 'New products and capabilities'],
]

const cycles = [
    ['Goal Setting', 'GOAL_SETTING', `${year}-01-01`, `${year}-12-31`],
    ['Q1 Check-in', 'Q1', `${year}-01-01`, `${year}-12-31`],
    ['Q2 Check-in', 'Q2', `${year}-01-01`, `${year}-12-31`],
    ['Q3 Check-in', 'Q3', `${year}-01-01`, `${year}-12-31`],
    ['Q4 Check-in', 'Q4', `${year}-01-01`, `${year}-12-31`],
]

console.log('Seeding AtomQuest demo data…')

for (const [name, desc] of thrustAreas) {
    await sql`
      INSERT INTO thrust_area (id, name, description, is_active)
      VALUES (gen_random_uuid()::text, ${name}, ${desc}, true)
      ON CONFLICT (name) DO NOTHING
    `
}

for (const [name, phase, opens, closes] of cycles) {
    const existing = await sql`
      SELECT id FROM performance_cycle WHERE year = ${year} AND phase = ${phase} LIMIT 1
    `
    if (existing.length === 0) {
        await sql`
          INSERT INTO performance_cycle (id, name, year, phase, opens_at, closes_at, is_active)
          VALUES (gen_random_uuid()::text, ${name}, ${year}, ${phase}, ${opens}::timestamp, ${closes}::timestamp, true)
        `
    }
}

const users = [
    {
        email: 'admin@atomquest.demo',
        name: 'Admin User',
        role: 'ADMIN',
        managerId: null,
    },
    {
        email: 'manager@atomquest.demo',
        name: 'Manager User',
        role: 'MANAGER',
        managerId: null,
    },
    {
        email: 'employee@atomquest.demo',
        name: 'Employee User',
        role: 'EMPLOYEE',
        managerEmail: 'manager@atomquest.demo',
    },
]

const ids = {}

for (const u of users) {
    const existing = await sql`SELECT id FROM "user" WHERE email = ${u.email}`
    if (existing.length > 0) {
        ids[u.email] = existing[0].id
        await sql`
          UPDATE "user" SET role = ${u.role}, name = ${u.name}, password = ${passwordHash}
          WHERE email = ${u.email}
        `
        continue
    }
    const [row] = await sql`
      INSERT INTO "user" (id, email, name, password, role, "emailVerified")
      VALUES (gen_random_uuid()::text, ${u.email}, ${u.name}, ${passwordHash}, ${u.role}, NOW())
      RETURNING id
    `
    ids[u.email] = row.id
}

if (ids['manager@atomquest.demo'] && ids['employee@atomquest.demo']) {
    await sql`
      UPDATE "user" SET manager_id = ${ids['manager@atomquest.demo']}
      WHERE email = 'employee@atomquest.demo'
    `
}

console.log('Done. Demo logins (password AtomQuest@123):')
console.log('  admin@atomquest.demo')
console.log('  manager@atomquest.demo')
console.log('  employee@atomquest.demo')
