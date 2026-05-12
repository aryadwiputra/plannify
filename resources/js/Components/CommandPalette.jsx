import * as React from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/Components/ui/command"
import { Search } from "lucide-react"
import { router } from "@inertiajs/react"

export function CommandPalette({ workspaces }) {
  const [open, setOpen] = React.useState(false)
  const workspaceItems = workspaces?.data ?? []

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:w-64"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline-flex">Search workspace...</span>
        <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Quick Links">
            <CommandItem onSelect={() => { setOpen(false); router.visit(route('dashboard')) }}>
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); router.visit(route('mytasks.index')) }}>
              My Tasks
            </CommandItem>
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Workspaces">
            {workspaceItems.map((workspace) => (
              <CommandItem 
                key={workspace.memberable.id}
                onSelect={() => {
                  setOpen(false);
                  router.visit(route('workspaces.show', [workspace.memberable.slug]))
                }}
              >
                {workspace.memberable.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
