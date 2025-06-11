"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Check, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface DiscordWebhookProps {
  torneioId?: string
}

export function DiscordWebhook({ torneioId }: DiscordWebhookProps) {
  const { toast } = useToast()
  const [webhookUrl, setWebhookUrl] = useState("")
  const [testando, setTestando] = useState(false)
  const [salvando, setSalvando] = useState(false)

  // Configurações de notificação
  const [config, setConfig] = useState({
    partidaInicio: true,
    partidaFim: true,
    roundVitoria: false,
    torneioInicio: true,
    torneioFim: true,
    grupoResultados: true,
  })

  const updateConfig = (key: keyof typeof config, value: boolean) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const testarWebhook = async () => {
    if (!webhookUrl) return

    setTestando(true)

    try {
      // Simulação de teste
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Webhook testado com sucesso",
        description: "A mensagem de teste foi enviada para o Discord",
      })
    } catch (error) {
      toast({
        title: "Erro ao testar webhook",
        description: "Verifique a URL e tente novamente",
        variant: "destructive",
      })
    } finally {
      setTestando(false)
    }
  }

  const salvarConfiguracao = async () => {
    if (!webhookUrl) return

    setSalvando(true)

    try {
      // Simulação de salvamento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Configuração salva",
        description: "As notificações do Discord foram configuradas com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar configuração",
        description: "Ocorreu um erro ao salvar as configurações",
        variant: "destructive",
      })
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integração com Discord</CardTitle>
        <CardDescription>Configure notificações automáticas para um canal do Discord</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="webhook">URL do Webhook</Label>
          <div className="flex gap-2">
            <Input
              id="webhook"
              placeholder="https://discord.com/api/webhooks/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <Button variant="outline" onClick={testarWebhook} disabled={!webhookUrl || testando}>
              {testando ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
              Testar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Crie um webhook no Discord: Configurações do Servidor &gt; Integrações &gt; Webhooks
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Eventos para notificar</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="partidaInicio" className="font-medium">
                  Início de partida
                </Label>
                <p className="text-xs text-muted-foreground">Notificar quando uma partida começar</p>
              </div>
              <Switch
                id="partidaInicio"
                checked={config.partidaInicio}
                onCheckedChange={(checked) => updateConfig("partidaInicio", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="partidaFim" className="font-medium">
                  Fim de partida
                </Label>
                <p className="text-xs text-muted-foreground">Notificar quando uma partida terminar</p>
              </div>
              <Switch
                id="partidaFim"
                checked={config.partidaFim}
                onCheckedChange={(checked) => updateConfig("partidaFim", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="roundVitoria" className="font-medium">
                  Vitória de round
                </Label>
                <p className="text-xs text-muted-foreground">Notificar a cada round vencido (muitas notificações)</p>
              </div>
              <Switch
                id="roundVitoria"
                checked={config.roundVitoria}
                onCheckedChange={(checked) => updateConfig("roundVitoria", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="torneioInicio" className="font-medium">
                  Início de torneio
                </Label>
                <p className="text-xs text-muted-foreground">Notificar quando um torneio começar</p>
              </div>
              <Switch
                id="torneioInicio"
                checked={config.torneioInicio}
                onCheckedChange={(checked) => updateConfig("torneioInicio", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="torneioFim" className="font-medium">
                  Fim de torneio
                </Label>
                <p className="text-xs text-muted-foreground">Notificar quando um torneio terminar</p>
              </div>
              <Switch
                id="torneioFim"
                checked={config.torneioFim}
                onCheckedChange={(checked) => updateConfig("torneioFim", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="grupoResultados" className="font-medium">
                  Resultados de grupo
                </Label>
                <p className="text-xs text-muted-foreground">
                  Notificar quando os resultados de um grupo forem finalizados
                </p>
              </div>
              <Switch
                id="grupoResultados"
                checked={config.grupoResultados}
                onCheckedChange={(checked) => updateConfig("grupoResultados", checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto" onClick={salvarConfiguracao} disabled={!webhookUrl || salvando}>
          {salvando && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Salvar Configuração
        </Button>
      </CardFooter>
    </Card>
  )
}
