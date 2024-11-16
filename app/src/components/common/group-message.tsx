import { format } from "date-fns"
import { FC } from "react"
import Jazzicon from "react-jazzicon"
import { cn } from "../../lib/utils"

interface Props {
  message: Message
  address: string
  showDate?: boolean
}

const GroupMessage: FC<Props> = ({ message, address, showDate }) => {
  const isOwn = message.sender === address
  const messageDate = new Date(Number(message.timestamp) * 1000)

  return (
    <div
      className={cn(
        "border-b border-border transition-colors p-4",
        isOwn ? "bg-primary/5" : "hover:bg-accent/50"
      )}
    >
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "rounded-full p-1",
              isOwn ? "bg-primary/10" : "bg-accent/10"
            )}
          >
            <Jazzicon
              diameter={40}
              seed={parseInt(message.sender.slice(2, 10), 16)}
            />
          </div>
          <div
            className={cn(
              "w-0.5 flex-1 my-2",
              isOwn ? "bg-primary/20" : "bg-border"
            )}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-bold text-base",
                isOwn && "text-black dark:text-black"
              )}
            >
              {isOwn
                ? "Me"
                : `${message.sender.slice(0, 6)}...${message.sender.slice(-4)}`}
            </span>
            <span className="text-sm text-muted-foreground">
              ・ {format(messageDate, "aa h:mm")}
            </span>
          </div>

          <div
            className={cn(
              "mt-2 text-sm leading-relaxed p-3 rounded-2xl",
              isOwn
                ? "bg-primary/10 text-black dark:text-black font-medium"
                : "bg-accent/10"
            )}
          >
            {message.content}
          </div>

          <div className="flex gap-6 mt-3">
            <button className="text-muted-foreground hover:text-primary flex items-center gap-1.5 text-sm rounded-full px-3 py-1.5 hover:bg-primary/10 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              Reply
            </button>
            <button className="text-muted-foreground hover:text-primary flex items-center gap-1.5 text-sm rounded-full px-3 py-1.5 hover:bg-primary/10 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              Like
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupMessage
