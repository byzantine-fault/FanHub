import { useMemo, FC } from "react"
import { SidebarGroupContent } from "@/components/ui/sidebar"
import Jazzicon from "react-jazzicon"
import { cn } from "@/lib/utils"
import { useGetAllGroups } from "@/hooks/use-get-all-groups"
import { selectionAtom } from "@/lib/store"
import { useAtomValue, useSetAtom } from "jotai"

interface GroupsProps {
  searchTerm: string
}

const Groups: FC<GroupsProps> = ({ searchTerm }) => {
  const { data: groups = [] } = useGetAllGroups()
  const setSelection = useSetAtom(selectionAtom)
  const selection = useAtomValue(selectionAtom)

  const filteredGroups = useMemo(() => {
    return groups.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, groups])

  return (
    <SidebarGroupContent>
      {filteredGroups.length > 0 ? (
        filteredGroups.map((group) => (
          <div
            onClick={() =>
              setSelection({ view: "group", id: group.groupId.toString() })
            }
            key={group.groupId}
            className={cn(
              "flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer",
              selection.view === "group" &&
                selection.id === group.groupId.toString() &&
                "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <Jazzicon diameter={32} seed={parseInt(group.groupId.toString())} />
            <div className="grid">
              <span className="font-medium">{group.name}</span>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  {group.members.length} members
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          No groups found
        </div>
      )}
    </SidebarGroupContent>
  )
}

export default Groups
