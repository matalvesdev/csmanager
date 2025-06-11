"use client"

import { useState } from "react"
import { Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface Notificacao {
  id: string
  titulo: string
  mensagem: string
  data: string
  lida: boolean
  tipo: "info" | "warning" | "success" | "error"
  link?: string
}

// Mock de notificações para demonstração
const notificacoesMock: Notificacao[] = [
  {
    id: "1",
    titulo: "Partida começando",
    mensagem: "A partida Alpha Squad vs Beta Force começará em 15 minutos",
    data: new Date(Date.now() - 15 * 60000).toISOString(),
    lida: false,
    tipo: "info",
    link: "/partidas/1",
  },
  {
    id: "2",
    titulo: "Torneio finalizado",
    mensagem: "O torneio Campeonato CS 1.6 2023 foi finalizado",
    data: new Date(Date.now() - 2 * 3600000).toISOString(),
    lida: true,
    tipo: "success",
    link: "/torneios/1",
  },
  {
    id: "3",
    titulo: "Novo jogador adicionado",
    mensagem: "O jogador 'Sniper' foi adicionado ao time Alpha Squad",
    data: new Date(Date.now() - 24 * 3600000).toISOString(),
    lida: false,
    tipo: "info",
  },
  {
    id: "4",
    titulo: "Erro no servidor",
    mensagem: "Houve um problema ao iniciar a partida",
    data: new Date(Date.now() - 48 * 3600000).toISOString(),
    lida: true,
    tipo: "error",
  },
]

export function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(notificacoesMock)
  const [open, setOpen] = useState(false)

  const naoLidas = notificacoes.filter((n) => !n.lida).length

  const marcarComoLida = (id: string) => {
    setNotificacoes((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)))
  }

  const marcarTodasComoLidas = () => {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })))
  }

  const formatarData = (data: string) => {
    const date = new Date(data)
    const agora = new Date()
    const diff = agora.getTime() - date.getTime()

    const minutos = Math.floor(diff / 60000)
    const horas = Math.floor(diff / 3600000)
    const dias = Math.floor(diff / 86400000)

    if (minutos < 60) {
      return `${minutos} min atrás`
    } else if (horas < 24) {
      return `${horas}h atrás`
    } else {
      return `${dias}d atrás`
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {naoLidas > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
              variant="destructive"
            >
              {naoLidas}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card>
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">Notificações</h3>
            {naoLidas > 0 && (
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={marcarTodasComoLidas}>
                Marcar todas como lidas
              </Button>
            )}
          </div>
          <ScrollArea className="h-80">
            {notificacoes.length > 0 ? (
              <div className="divide-y">
                {notificacoes.map((notificacao) => (
                  <div key={notificacao.id} className={cn("p-4 relative", !notificacao.lida && "bg-muted/50")}>
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{notificacao.titulo}</h4>
                      <span className="text-xs text-muted-foreground">{formatarData(notificacao.data)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notificacao.mensagem}</p>
                    <div className="flex justify-between items-center mt-2">
                      {notificacao.link ? (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => {
                            window.location.href = notificacao.link!
                            setOpen(false)
                          }}
                        >
                          Ver detalhes
                        </Button>
                      ) : (
                        <span />
                      )}

                      {!notificacao.lida && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => marcarComoLida(notificacao.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-muted-foreground text-sm">Nenhuma notificação</p>
              </div>
            )}
          </ScrollArea>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
