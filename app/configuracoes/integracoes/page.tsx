"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DiscordWebhook } from "@/components/integracao/discord-webhook"

export default function IntegracoesPage() {
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Integrações</h1>

      <Tabs defaultValue="discord">
        <TabsList>
          <TabsTrigger value="discord">Discord</TabsTrigger>
          <TabsTrigger value="telegram">Telegram</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="discord" className="space-y-6 pt-4">
          <DiscordWebhook />
        </TabsContent>

        <TabsContent value="telegram" className="space-y-6 pt-4">
          <div className="text-center py-12 text-muted-foreground">Integração com Telegram em breve</div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6 pt-4">
          <div className="text-center py-12 text-muted-foreground">Documentação da API em breve</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
