import { AdminWorkspace } from '@/components/atomquest/admin-workspace'
import { db } from '@/lib/dbconfig/db'
import { listActiveThrustAreas } from '@/lib/queries/atomquest/catalog'
import { UserRole, usersTable } from '@/lib/dbconfig/schema'
import { isEmployeeRole } from '@/lib/atomquest/roles'
import {
    getPerformanceYear,
    listPerformanceCycles,
} from '@/services/atomquest/cycles'

export default async function AdminAtomquestPage() {
    const performanceYear = getPerformanceYear()
    const [cycles, allUsers, thrustAreas] = await Promise.all([
        listPerformanceCycles(performanceYear),
        db.select().from(usersTable),
        listActiveThrustAreas(),
    ])

    const employees = allUsers
        .filter((u) => isEmployeeRole((u.role ?? UserRole.EMPLOYEE) as UserRole))
        .map((u) => ({ id: u.id, name: u.name, email: u.email }))

    return (
        <AdminWorkspace
            cycles={cycles}
            performanceYear={performanceYear}
            employees={employees}
            thrustAreas={thrustAreas.map((t) => ({
                id: t.id,
                name: t.name,
                description: t.description,
            }))}
        />
    )
}
