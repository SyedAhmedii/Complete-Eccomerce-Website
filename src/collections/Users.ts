import type { CollectionConfig } from 'payload'
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields"
import { isSuperAdmin } from '@/lib/access'
import type { User, Tenant } from '@/payload-types'


const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },

  tenantFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
})

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
    update: ({ req, id }) => {
      if(isSuperAdmin(req.user)) return true;

      return req.user?.id === id;
    }
  },
  admin: {
    useAsTitle: 'email',
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  hooks: {
    /**
     * When a super-admin deletes a user, cascade-delete all tenants that were
     * linked to that user. Each tenant has a unique `slug` equal to the
     * user's username — without this hook, the slug stays in the DB and
     * prevents anyone from re-registering with the same username.
     */
    afterDelete: [
      async ({ doc, req }) => {
        const user = doc as User;

        // user.tenants is an array of { tenant: Tenant | string }
        const tenantEntries = (user.tenants ?? []) as Array<{ tenant: Tenant | string }>;

        for (const entry of tenantEntries) {
          const tenantId =
            typeof entry.tenant === 'string'
              ? entry.tenant
              : entry.tenant?.id;

          if (!tenantId) continue;

          try {
            await req.payload.delete({
              collection: 'tenants',
              id: tenantId,
              overrideAccess: true, // bypass collection-level delete access check
            });
          } catch (err) {
            // Log but don't re-throw — the user is already deleted,
            // tenant cleanup is best-effort
            req.payload.logger.error(
              { err, tenantId },
              `[Users.afterDelete] Failed to delete tenant ${tenantId}`
            );
          }
        }
      },
    ],
  },
  auth: {
    // Email verification disabled — users are auto-verified on signup
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutes
    // 7-day token lifetime so sessions survive server restarts
    tokenExpiration: 60 * 60 * 24 * 7,
  },
  fields: [
    {
      name: "username",
      required: true,
      unique: true,
      type: "text"
    },
    {
      admin: {
        position: "sidebar",
      },
      name: "roles",
      type: "select",
      defaultValue: ["user"],
      hasMany: true,
      options: ["super-admin", "user"],
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      }
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: "sidebar",
      }
    },
    {
      name: "googleId",
      type: "text",
      admin: {
        position: "sidebar",
        description: "Google OAuth user ID (set automatically)",
        readOnly: true,
      },
      access: {
        read: ({ req }) => isSuperAdmin(req.user),
        create: () => true,
        update: () => true,
      },
    },
  ],
}
