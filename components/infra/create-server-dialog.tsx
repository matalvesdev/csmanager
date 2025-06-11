import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

interface CreateServerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreated?: () => void
}

export function CreateServerDialog({ open, onOpenChange, onCreated }: CreateServerDialogProps) {
    const { toast } = useToast()
    const [name, setName] = useState("")
    const [matchbot, setMatchbot] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleCreate = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/docker/containers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    image: "cs16-server:latest",
                    matchbot: matchbot ? { enabled: true, version: "latest" } : undefined,
                }),
            })
            if (!res.ok) throw new Error("Erro ao criar servidor")
            toast({
                title: "Servidor criado",
                description: `O servidor ${name} foi provisionado com sucesso.`,
            })
            setName("")
            setMatchbot(false)
            onOpenChange(false)
            onCreated?.()
        } catch (e) {
            toast({
                title: "Erro",
                description: "Erro ao criar servidor.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar Novo Servidor</DialogTitle>
                    <DialogDescription>Provisionar um novo servidor CS 1.6</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Nome do servidor"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={loading}
                    />
                    <div className="flex items-center gap-2">
                        <Switch checked={matchbot} onCheckedChange={setMatchbot} disabled={loading} />
                        <span>Incluir MatchBot</span>
                    </div>
                    <Button onClick={handleCreate} disabled={!name || loading} className="w-full">
                        {loading ? "Criando..." : "Criar Servidor"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
