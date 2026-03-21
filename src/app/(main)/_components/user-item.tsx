import { OrganizationSwitcher } from "@clerk/clerk-react"
import { pages } from "@/config/routing/pages.route"

export function UserItem(){
    return (
        <div className="flex items-center m-2">
            <OrganizationSwitcher afterSelectOrganizationUrl={pages.DASHBOARD()}/>
        </div>
    )
}