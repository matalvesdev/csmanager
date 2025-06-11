import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ServerDetailsDialogProps {
    server: any
    onClose: () => void
}

export function ServerDetailsDialog({ server, onClose }: ServerDetailsDialogProps) {
    if (!server) return null
    return (
        <Card className="max-w-2xl w-full">
            <CardHeader>
                <CardTitle>Detalhes do Servidor</CardTitle>
                <CardDescription>{server.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="font-medium">Endereço:</span>
                        <div>{server.ip}:{server.port}</div>
                    </div>
                    <div>
                        <span className="font-medium">Status:</span>
                        <Badge variant={server.status === "online" ? "success" : "destructive"}>{server.status}</Badge>
                    </div>
                    <div>
                        <span className="font-medium">Jogadores:</span>
                        <div>{server.players} / {server.maxPlayers}</div>
                    </div>
                    <div>
                        <span className="font-medium">Mapa:</span>
                        <div>{server.map || "-"}</div>
                    </div>
                    <div>
                        <span className="font-medium">CPU:</span>
                        <div>{server.cpu}%</div>
                    </div>
                    <div>
                        <span className="font-medium">Memória:</span>
                        <div>{server.memory} MB</div>
                    </div>
                    <div>
                        <span className="font-medium">Uptime:</span>
                        <div>{Math.floor(server.uptime / 3600000)}h {Math.floor((server.uptime % 3600000) / 60000)}m</div>
                    </div>
                    <div>
                        <span className="font-medium">Último Restart:</span>
                        <div>{new Date(server.lastRestart).toLocaleString("pt-BR")}</div>
                    </div>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                    <Button variant="outline" onClick={onClose}>Fechar</Button>
                    <Button
                        variant="destructive"
                        onClick={async () => {
                            if (!server.id) return
                            try {
                                const res = await fetch(`/api/docker/containers/${server.id}`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ action: "restart" })
                                })
                                if (!res.ok) {
                                    alert("Erro ao reiniciar o servidor.")
                                } else {
                                    alert("Servidor reiniciado com sucesso!")
                                    window.location.reload()
                                }
                            } catch (e) {
                                alert("Erro ao reiniciar o servidor.")
                            }
                        }}
                    >
                        Reiniciar Servidor
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
