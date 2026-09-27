// import { clsx type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]){
//           return twMerge(clsx(inputs))
// }

export { cn } from "cn"

export function generateTenantURL(tenantSlug: string){
          return `/tenants/${tenantSlug}`;
}
