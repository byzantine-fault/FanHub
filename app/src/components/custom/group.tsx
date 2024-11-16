import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FC, useRef, useEffect, useState } from "react"
import { useGetGroupMessages } from "@/hooks/use-get-group-messages"
import { useSendGroupMessage } from "@/hooks/use-send-group-message"
import { useAccount } from "wagmi"
import { useCheckSignIn } from "@/hooks/auth/use-check-signin"
import { useCheckGroupAccess } from "@/hooks/use-check-group-access"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import WarningIcon from "@/icons/warning-icon"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import GroupMessage from "../common/group-message"

interface PageProps {
  id: string
}

const messageFormSchema = z.object({
  message: z.string().min(1),
})

type MessageFormValues = z.infer<typeof messageFormSchema>

const Group: FC<PageProps> = ({ id }) => {
  const { address } = useAccount()
  const { auth } = useCheckSignIn()
  const {
    isMember,
    isPending,
    isLoading,
    requestAccess,
    pendingMembers,
    acceptMember,
    removeMember,
    isOwner,
    members,
    refetchMembership,
    refetchPending,
    refetchPendingMembers,
    refetchOwner,
    refetchMembers,
  } = useCheckGroupAccess({
    auth,
    groupId: id,
    address: address as `0x${string}`,
  })
  const { data: messages } = useGetGroupMessages(auth, Number(id))
  const { mutateAsync, isPending: isSendingMessage } = useSendGroupMessage()

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: "",
    },
  })

  const onSubmit = async (data: MessageFormValues) => {
    await mutateAsync({
      auth,
      groupId: Number(id),
      content: data.message,
    })
    form.reset()
  }

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (messages?.length) {
      const viewport = scrollAreaRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]"
      )
      if (viewport) {
        if (isFirstRender.current) {
          viewport.scrollTop = viewport.scrollHeight
          isFirstRender.current = false
        } else {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: "instant",
          })
        }
      }
    }
  }, [messages])

  if (!address) return null
  if (isLoading) return <div>Loading...</div>

  if (!isMember) {
    return (
      <SidebarInset>
        <div className="h-screen relative">
          <header
            className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <SidebarTrigger className="-ml-1" />
          </header>
          {isOpen && (
            <div className="flex flex-col items-center gap-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center gap-4">
                <WarningIcon />
                <h2 className="text-2xl font-semibold">Access Required</h2>
              </div>
              <p className="text-center text-muted-foreground">
                {isPending
                  ? "Your access request is pending approval... Check back later"
                  : "You need to be a member of this group to view messages"}
              </p>
              {!isPending && (
                <Button
                  className="h-12 rounded-full w-64"
                  disabled={requestAccess.isPending}
                  onClick={() => requestAccess.mutateAsync()}
                >
                  Request Access
                </Button>
              )}
            </div>
          )}
        </div>
      </SidebarInset>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage className="opacity-60">Group</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {(pendingMembers?.length || isOwner) && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Group Setting
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Group Setting</SheetTitle>
              </SheetHeader>

              <Tabs defaultValue="members" className="mt-6">
                <TabsList>
                  <TabsTrigger value="members">
                    Members ({members?.length})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({pendingMembers?.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="mt-4 space-y-4">
                  {members?.map((member) => (
                    <div
                      key={member}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${member}.png`}
                          />
                          <AvatarFallback>
                            {member.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium">
                          {" "}
                          {member.slice(0, 6)}...{member.slice(-4)}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          await removeMember.mutateAsync(member)
                          await refetchMembers()
                        }}
                        disabled={removeMember.isPending}
                      >
                        {removeMember.isPending ? "Removing..." : "Remove"}
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="pending" className="mt-4 space-y-4">
                  {pendingMembers?.map((member) => (
                    <div
                      key={member}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${member}.png`}
                          />
                          <AvatarFallback>
                            {member.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium">
                          {member.slice(0, 6)}...{member.slice(-4)}
                        </p>
                      </div>
                      <Button
                        onClick={async () => {
                          await acceptMember.mutateAsync(member)
                          await refetchPendingMembers()
                        }}
                        disabled={acceptMember.isPending}
                      >
                        {acceptMember.isPending ? "Accepting..." : "Accept"}
                      </Button>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </SheetContent>
          </Sheet>
        )}
      </header>
      <div className="flex flex-1 flex-col min-h-0">
        <ScrollArea className="flex-1 w-full" ref={scrollAreaRef}>
          <div className="flex flex-col gap-4 p-4 min-h-full">
            {messages?.length ? (
              messages.map((message, index) => {
                const currentDate = new Date(Number(message.timestamp) * 1000)
                const previousMessage = messages[index - 1]
                const previousDate = previousMessage
                  ? new Date(Number(previousMessage.timestamp) * 1000)
                  : null

                const showDate =
                  !previousDate ||
                  format(currentDate, "yyyy-MM-dd") !==
                    format(previousDate, "yyyy-MM-dd")

                return (
                  <GroupMessage
                    key={index}
                    message={message}
                    address={address}
                    showDate={showDate}
                  />
                )
              })
            ) : (
              <div className="flex items-center justify-center h-full">
                <Badge
                  variant="secondary"
                  className="font-normal border px-3 py-1.5"
                >
                  No Threads yet
                </Badge>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t bg-background p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Type a message..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSendingMessage || !form.getValues("message").trim()}
              >
                {isSendingMessage ? "Sending..." : "Send"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Group
