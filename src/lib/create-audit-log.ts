import { auth, currentUser } from '@clerk/nextjs'
import { ACTION, ENTITY_TYPE } from '@prisma/client'
import { dbPrisma } from './db'

interface ICreateAuditLog {
	entityId: string
	entityType: ENTITY_TYPE
	entityTitle: string
	action: ACTION
}

export const createAuditLog = async (props: ICreateAuditLog) => {
	try {
		const { orgId } = auth()
		const user = await currentUser()

		if (!user || !orgId) throw new Error('User not found!')

		const { action, entityId, entityTitle, entityType } = props

		await dbPrisma.auditLog.create({
			data: {
				orgId,
				entityId,
				entityTitle,
				entityType,
				action,
				userId: user.id,
				userImage: user.imageUrl,
				userName: `${user.firstName} ${user.lastName}`,
			},
		})
	} catch (error) {
		console.log('[AUDIT_LOG_ERROR]', error)
	}
}
