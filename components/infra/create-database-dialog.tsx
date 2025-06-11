import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface CreateDatabaseDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreated?: () => void
}

export function CreateDatabaseDialog({ open, onOpenChange, onCreated }: CreateDatabaseDialogProps) {
    const { toast } = useToast()
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)

    const handleCreate = async () => {
        setLoading(true)
        try {
            // Cria um container Docker do banco de dados (ex: postgres)
            const res = await fetch("/api/docker/containers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name || "cs16-db",
                    image: "postgres:15-alpine",
                    env: [
                        "POSTGRES_USER=cs16",
                        "POSTGRES_PASSWORD=cs16",
                        "POSTGRES_DB=cs16tournament"
                    ],
                    ports: ["5432:5432"]
                }),
            })
            if (!res.ok) throw new Error("Erro ao criar banco de dados")
            toast({
                title: "Banco de Dados criado",
                description: `O banco de dados ${name || "cs16-db"} foi criado com sucesso via Docker.`,
            })
            setName("")
            onOpenChange(false)
            onCreated?.()
        } catch (e) {
            toast({
                title: "Erro",
                description: "Erro ao criar banco de dados.",
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
                    <DialogTitle>Criar Banco de Dados (Docker)</DialogTitle>
                    <DialogDescription>Provisiona um container Postgres local para testes</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Nome do container (opcional)"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={loading}
                    />
                    <div className="text-xs text-muted-foreground">
                        Imagem: <b>postgres:15-alpine</b> | Usuário: <b>cs16</b> | Senha: <b>cs16</b> | DB: <b>cs16tournament</b>
                    </div>
                    <Button onClick={handleCreate} disabled={loading} className="w-full">
                        Criar Banco de Dados
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
