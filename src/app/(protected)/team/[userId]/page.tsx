import { TeamMemberWorkspace } from '@/components/atomquest/team-member-workspace'

type PageProps = {
    params: Promise<{ userId: string }>
}

export default async function TeamMemberPage({ params }: PageProps) {
    const { userId } = await params
    return <TeamMemberWorkspace userId={userId} />
}
