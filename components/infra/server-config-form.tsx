"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Save, TestTube } from "lucide-react"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/components/ui/use-toast"
import type { ServerConfig } from "@/types/infra"

const serverConfigSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  image: z.string().min(1, "Imagem é obrigatória"),
  type: z.enum(["cs-server", "hltv", "api", "db", "web"]),
  autoRestart: z.boolean(),
  cpuLimit: z.number().min(0.1).max(8),
  memoryLimit: z.number().min(64).max(8192),
  networkMode: z.string(),
})

type ServerConfigForm = z.infer<typeof serverConfigSchema>

interface ServerConfigFormProps {
  config?: ServerConfig
  onSave: (config: Omit<ServerConfig, "id"> | ServerConfig) => Promise<void>
  onCancel: () => void
}

export function ServerConfigForm({ config, onSave, onCancel }: ServerConfigFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [envVars, setEnvVars] = useState<Record<string, string>>(config?.env || {})
  const [ports, setPorts] = useState(config?.ports || [{ internal: 27015, external: 27015, protocol: "udp" }])
  const [volumes, setVolumes] = useState(config?.volumes || [{ host: "", container: "" }])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ServerConfigForm>({
    resolver: zodResolver(serverConfigSchema),
    defaultValues: {
      name: config?.name || "",
      image: config?.image || "cs16-server:latest",
      type: config?.type || "cs-server",
      autoRestart: config?.autoRestart ?? true,
      cpuLimit: config?.cpuLimit || 1,
      memoryLimit: config?.memoryLimit || 512,
      networkMode: config?.networkMode || "bridge",
    },
  })

  const serverType = watch("type")

  const addEnvVar = () => {
    setEnvVars({ ...envVars, "": "" })
  }

  const updateEnvVar = (oldKey: string, newKey: string, value: string) => {
    const newEnvVars = { ...envVars }
    if (oldKey !== newKey) {
      delete newEnvVars[oldKey]
    }
    newEnvVars[newKey] = value
    setEnvVars(newEnvVars)
  }

  const removeEnvVar = (key: string) => {
    const newEnvVars = { ...envVars }
    delete newEnvVars[key]
    setEnvVars(newEnvVars)
  }

  const addPort = () => {
    setPorts([...ports, { internal: 27015, external: 27015, protocol: "udp" }])
  }

  const updatePort = (index: number, field: keyof (typeof ports)[0], value: string | number) => {
    const newPorts = [...ports]
    newPorts[index] = { ...newPorts[index], [field]: value }
    setPorts(newPorts)
  }

  const removePort = (index: number) => {
    setPorts(ports.filter((_, i) => i !== index))
  }

  const addVolume = () => {
    setVolumes([...volumes, { host: "", container: "" }])
  }

  const updateVolume = (index: number, field: keyof (typeof volumes)[0], value: string) => {
    const newVolumes = [...volumes]
    newVolumes[index] = { ...newVolumes[index], [field]: value }
    setVolumes(newVolumes)
  }

  const removeVolume = (index: number) => {
    setVolumes(volumes.filter((_, i) => i !== index))
  }

  const testConfiguration = async () => {
    setIsTesting(true)
    try {
      // Simulate configuration test
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Configuração válida",
        description: "A configuração foi testada com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro na configuração",
        description: "A configuração contém erros.",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const onSubmit = async (data: ServerConfigForm) => {
    setIsLoading(true)
    try {
      const configData = {
        ...data,
        env: envVars,
        ports,
        volumes: volumes.filter((v) => v.host && v.container),
        ...(config && { id: config.id }),
      }

      await onSave(configData)
      toast({
        title: config ? "Configuração atualizada" : "Configuração criada",
        description: `A configuração do servidor foi ${config ? "atualizada" : "criada"} com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar configuração",
        description: "Ocorreu um erro ao salvar a configuração do servidor.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getDefaultEnvVars = () => {
    switch (serverType) {
      case "cs-server":
        return {
          RCON_PASSWORD: "admin123",
          SV_PASSWORD: "",
          MAXPLAYERS: "10",
          MAP: "de_dust2",
          HOSTNAME: "CS 1.6 Server",
        }
      case "hltv":
        return {
          HLTV_PASSWORD: "",
          DELAY: "90",
          RATE: "10000",
        }
      case "api":
        return {
          NODE_ENV: "production",
          PORT: "4000",
          DATABASE_URL: "postgresql://user:pass@db:5432/tournament",
        }
      case "db":
        return {
          POSTGRES_USER: "admin",
          POSTGRES_PASSWORD: "secret",
          POSTGRES_DB: "tournament",
        }
      default:
        return {}
    }
  }

  const loadDefaults = () => {
    const defaults = getDefaultEnvVars()
    setEnvVars({ ...envVars, ...defaults })
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>{config ? "Editar Configuração" : "Nova Configuração"}</CardTitle>
        <CardDescription>
          Configure os parâmetros do servidor {serverType === "cs-server" ? "CS 1.6" : serverType.toUpperCase()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="environment">Ambiente</TabsTrigger>
              <TabsTrigger value="network">Rede</TabsTrigger>
              <TabsTrigger value="resources">Recursos</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Servidor</Label>
                  <Input id="name" {...register("name")} placeholder="CS Server #1" />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Servidor</Label>
                  <Select onValueChange={(value) => setValue("type", value as any)} defaultValue={serverType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs-server">CS 1.6 Server</SelectItem>
                      <SelectItem value="hltv">HLTV Server</SelectItem>
                      <SelectItem value="api">API Server</SelectItem>
                      <SelectItem value="db">Database</SelectItem>
                      <SelectItem value="web">Web Server</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Imagem Docker</Label>
                  <Input id="image" {...register("image")} placeholder="cs16-server:latest" />
                  {errors.image && <p className="text-sm text-red-500">{errors.image.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="networkMode">Modo de Rede</Label>
                  <Select onValueChange={(value) => setValue("networkMode", value)} defaultValue="bridge">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bridge">Bridge</SelectItem>
                      <SelectItem value="host">Host</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="autoRestart" {...register("autoRestart")} />
                <Label htmlFor="autoRestart">Reinicialização Automática</Label>
              </div>
            </TabsContent>

            <TabsContent value="environment" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Variáveis de Ambiente</Label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={loadDefaults}>
                    Carregar Padrões
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={addEnvVar}>
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {Object.entries(envVars).map(([key, value], index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="VARIAVEL"
                      value={key}
                      onChange={(e) => updateEnvVar(key, e.target.value, value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="valor"
                      value={value}
                      onChange={(e) => updateEnvVar(key, key, e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => removeEnvVar(key)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {serverType === "cs-server" && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Variáveis Comuns para CS 1.6:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Badge variant="outline">RCON_PASSWORD</Badge>
                    <Badge variant="outline">SV_PASSWORD</Badge>
                    <Badge variant="outline">MAXPLAYERS</Badge>
                    <Badge variant="outline">MAP</Badge>
                    <Badge variant="outline">HOSTNAME</Badge>
                    <Badge variant="outline">SV_LAN</Badge>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="network" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Portas</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPort}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Porta
                </Button>
              </div>

              <div className="space-y-2">
                {ports.map((port, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="Porta Interna"
                      value={port.internal}
                      onChange={(e) => updatePort(index, "internal", Number.parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Porta Externa"
                      value={port.external}
                      onChange={(e) => updatePort(index, "external", Number.parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <Select
                      onValueChange={(value) => updatePort(index, "protocol", value)}
                      defaultValue={port.protocol}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tcp">TCP</SelectItem>
                        <SelectItem value="udp">UDP</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="sm" onClick={() => removePort(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label>Volumes</Label>
                <Button type="button" variant="outline" size="sm" onClick={addVolume}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Volume
                </Button>
              </div>

              <div className="space-y-2">
                {volumes.map((volume, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Caminho no Host"
                      value={volume.host}
                      onChange={(e) => updateVolume(index, "host", e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Caminho no Container"
                      value={volume.container}
                      onChange={(e) => updateVolume(index, "container", e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => removeVolume(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpuLimit">Limite de CPU (cores)</Label>
                  <Input
                    id="cpuLimit"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="8"
                    {...register("cpuLimit", { valueAsNumber: true })}
                  />
                  {errors.cpuLimit && <p className="text-sm text-red-500">{errors.cpuLimit.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memoryLimit">Limite de Memória (MB)</Label>
                  <Input
                    id="memoryLimit"
                    type="number"
                    min="64"
                    max="8192"
                    {...register("memoryLimit", { valueAsNumber: true })}
                  />
                  {errors.memoryLimit && <p className="text-sm text-red-500">{errors.memoryLimit.message}</p>}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Recomendações de Recursos:</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>CS 1.6 Server:</strong> 0.5-1 CPU core, 256-512 MB RAM
                  </p>
                  <p>
                    <strong>HLTV Server:</strong> 0.2-0.5 CPU core, 128-256 MB RAM
                  </p>
                  <p>
                    <strong>Database:</strong> 1-2 CPU cores, 512-2048 MB RAM
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-4">
            <div className="flex gap-2">
              <LoadingButton
                type="button"
                variant="outline"
                onClick={testConfiguration}
                loading={isTesting}
                loadingText="Testando..."
              >
                <TestTube className="mr-2 h-4 w-4" />
                Testar Configuração
              </LoadingButton>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <LoadingButton type="submit" loading={isLoading} loadingText="Salvando...">
                <Save className="mr-2 h-4 w-4" />
                Salvar Configuração
              </LoadingButton>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
