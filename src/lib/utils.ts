// import { clsx type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]){
//           return twMerge(clsx(inputs))
// }

export { cn } from "cn"

// export function generateTenantURL(tenantSlug: string ) {

//           const isDevelopment = process.env.NODE_ENV === "development"
//           const isSubdomainRoutingEnabled =process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING === "true";

//           if (isDevelopment || !isSubdomainRoutingEnabled){
//                    return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}`;
//           }

//           const protocol = "https";
//           const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;

//           // if (process.env.NODE_ENV === "development"){
//           //           protocol = "http";
//           // }

//           return `${protocol}://${tenantSlug}.${domain}`;
// }



export function generateTenantURL(tenantSlug: string) {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL;

          const isDevelopment =
                    process.env.NODE_ENV === "development";

          const isSubdomainRoutingEnabled =
                    process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING === "true";

          if (isDevelopment || !isSubdomainRoutingEnabled) {
                    if (!appUrl) {
                              throw new Error("NEXT_PUBLIC_APP_URL is missing");
                    }

                    return `${appUrl.replace(/\/$/, "")}/tenants/${tenantSlug}`;
          }

          const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

          if (!domain) {
                    throw new Error("NEXT_PUBLIC_ROOT_DOMAIN is missing");
          }

          return `https://${tenantSlug}.${domain}`;
}


export function formatCurrency(value: number | string) {
          return new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
          }).format(Number(value));
};