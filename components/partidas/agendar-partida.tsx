"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AgendarPartidaProps {
  torneioId?: string
  onClose?: () => void
}

export function AgendarPartida({ torneioId, onClose }: AgendarPartidaProps) {
  const router = useRouter()
  const { torneios, agendarPartida, isLoading } = useAppStore()

  const [selectedTorneio, setSelectedTorneio] = useState<string>(torneioId || "")
  const [timeA, setTimeA] = useState<string>("")
  const [timeB, setTimeB] = useState<string>("")
  const [mapa, setMapa] = useState<string>("de_dust2")
  const [data, setData] = useState<Date | undefined>(new Date())
  const [hora, setHora] = useState<string>("18:00")

  const torneio = torneios.find((t) => t.id === selectedTorneio)

  const mapasDisponiveis = torneio?.configuracao.mapas || [
    "de_dust2",
    "de_inferno",
    "de_nuke",
    "de_train",
    "de_mirage",
    "de_cache",
    "de_overpass",
  ]

  const timesDisponiveis = torneio ? torneio.grupos.flatMap((g) => g.times) : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTorneio || !timeA || !timeB || !data || !hora || !mapa) {
      return
    }

    // Combinar data e hora
    const [hours, minutes] = hora.split(":").map(Number)
    const dataHora = new Date(data)
    dataHora.setHours(hours, minutes)

    const timeAObj = timesDisponiveis.find((t) => t.id === timeA)
    const timeBObj = timesDisponiveis.find((t) => t.id === timeB)

    if (!timeAObj || !timeBObj) return

    await agendarPartida({
      torneioId: selectedTorneio,
      timeA: timeAObj,
      timeB: timeBObj,
      mapa,
      inicioPrevisto: dataHora.toISOString(),
    })

    if (onClose) {
      onClose()
    } else {
      router.push("/partidas")
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Agendar Partida</CardTitle>
          <CardDescription>Crie uma nova partida para o torneio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!torneioId && (
            <div className="space-y-2">
              <Label htmlFor="torneio">Torneio</Label>
              <Select value={selectedTorneio} onValueChange={setSelectedTorneio}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um torneio" />
                </SelectTrigger>
                <SelectContent>
                  {torneios.map((torneio) => (
                    <SelectItem key={torneio.id} value={torneio.id}>
                      {torneio.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeA">Time A</Label>
              <Select value={timeA} onValueChange={setTimeA}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o time A" />
                </SelectTrigger>
                <SelectContent>
                  {timesDisponiveis.map((time) => (
                    <SelectItem key={time.id} value={time.id}>
                      {time.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeB">Time B</Label>
              <Select value={timeB} onValueChange={setTimeB}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o time B" />
                </SelectTrigger>
                <SelectContent>
                  {timesDisponiveis
                    .filter((t) => t.id !== timeA)
                    .map((time) => (
                      <SelectItem key={time.id} value={time.id}>
                        {time.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mapa">Mapa</Label>
            <Select value={mapa} onValueChange={setMapa}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o mapa" />
              </SelectTrigger>
              <SelectContent>
                {mapasDisponiveis.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !data && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data ? format(data, "PPP", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={data} onSelect={setData} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora">Horário</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="hora"
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading || !selectedTorneio || !timeA || !timeB || !data || !hora || !mapa}>
            {isLoading ? "Agendando..." : "Agendar Partida"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
