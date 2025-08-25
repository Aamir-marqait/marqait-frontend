import { Facebook, Twitter, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SocialLinks() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Facebook className="h-4 w-4 text-blue-600" />
        <span className="sr-only">Facebook</span>
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Twitter className="h-4 w-4 text-foreground" />
        <span className="sr-only">Twitter</span>
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Linkedin className="h-4 w-4 text-blue-600" />
        <span className="sr-only">LinkedIn</span>
      </Button>
    </div>
  )
}