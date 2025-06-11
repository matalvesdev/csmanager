import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface CreateContainerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreated?: () => void
}

export function CreateContainerDialog({ open, onOpenChange, onCreated }: CreateContainerDialogProps) {
    const { toast } = useToast()
    const [name, setName] = useState("")
    const [image, setImage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleCreate = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/docker/containers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, image }),
            })
            if (!res.ok) throw new Error("Erro ao criar container")
            toast({
                title: "Container criado",
                description: `O container ${name} foi criado com sucesso.`,
            })
            setName("")
            setImage("")
            onOpenChange(false)
            onCreated?.()
        } catch (e) {
            toast({
                title: "Erro",
                description: "Erro ao criar container.",
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
                    <DialogTitle>Criar Novo Container</DialogTitle>
                    <DialogDescription>Provisionar um novo container Docker</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Nome do container"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={loading}
                    />
                    <Input
                        placeholder="Imagem Docker (ex: cs16-server:latest)"
                        value={image}
                        onChange={e => setImage(e.target.value)}
                        disabled={loading}
                    />
                    <Button onClick={handleCreate} disabled={!name || !image || loading} className="w-full">
                        {loading ? "Criando..." : "Criar Container"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
