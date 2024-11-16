import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FC } from "react"
import { useCreateGroup } from "@/hooks/use-create-group"
import { useCheckSignIn } from "@/hooks/auth/use-check-signin"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CHAIN_OPTIONS = [
  { id: "1", name: "Ethereum Mainnet" },
  // { id: "23293", name: "Sapphire Localnet" },
] as const

const formSchema = z.object({
  name: z.string().min(1, { message: "Group name is required" }),
  chainId: z.string().min(1, { message: "Chain is required" }),
  tokenAddress: z.string().min(1, { message: "Token address is required" }),
  requiredAmount: z.string().min(1, { message: "Required amount is required" }),
})

const CreateGroupDialog: FC<Props> = ({ open, onOpenChange }) => {
  const { auth } = useCheckSignIn()
  const { mutateAsync: createGroup, isPending } = useCreateGroup()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      chainId: "1",
      tokenAddress: "",
      requiredAmount: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!auth) return

    await createGroup({
      auth,
      name: values.name,
      chainId: parseInt(values.chainId),
      tokenAddress: values.tokenAddress as `0x${string}`,
      requiredAmount: values.requiredAmount,
    })

    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chainId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chain</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select chain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CHAIN_OPTIONS.map((chain) => (
                        <SelectItem key={chain.id} value={chain.id}>
                          {chain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tokenAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter token address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requiredAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter required token amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={!form.formState.isValid || isPending}
              className="w-full"
            >
              Create Group
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateGroupDialog
