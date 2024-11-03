import { LogOut, Origami } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { NAV_ITEMS } from "@/lib/constants"
import { useAccount } from "wagmi"
import { useSetAtom, useAtomValue } from "jotai"
import { FC } from "react"
import { selectionAtom } from "@/lib/store"

const IconSidebar: FC = () => {
  const { setOpen } = useSidebar()
  const { address } = useAccount()
  const setSelection = useSetAtom(selectionAtom)
  const selection = useAtomValue(selectionAtom)

  const disconnect = () => {
    if (address) localStorage.removeItem(`lastSignIn_${address}`)
    disconnect()
  }

  return (
    <Sidebar
      collapsible="none"
      className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="md:h-8 md:p-0">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Origami className="size-4" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-1.5 md:px-0">
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={{
                      children: item.title,
                      hidden: false,
                    }}
                    onClick={() => {
                      const view = item.title === "Direct Messages" ? "dm" : "group"
                      setSelection({ view, id: null })
                      setOpen(true)
                    }}
                    isActive={selection.view === (item.title === "Direct Messages" ? "dm" : "group")}
                    className="px-2.5 md:px-2"
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex justify-center items-center">
        <SidebarMenuButton
          tooltip={{
            children: "Disconnect",
            hidden: false,
          }}
          onClick={disconnect}
          className="px-2.5 md:px-2"
        >
          <LogOut className="size-4 text-destructive cursor-pointer" />
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}

export default IconSidebar