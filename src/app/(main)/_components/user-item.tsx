import { OrganizationSwitcher } from "@clerk/clerk-react"

export function UserItem(){
    return (
        <div className="flex items-center m-2">
            <OrganizationSwitcher/>
        </div>
    )
}