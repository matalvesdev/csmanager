export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatStatus(
  status: "agendada" | "em_andamento" | "finalizada" | "agendado" | "em_andamento" | "finalizado",
): string {
  const statusMap: Record<string, string> = {
    agendada: "Agendada",
    em_andamento: "Em Andamento",
    finalizada: "Finalizada",
    agendado: "Agendado",
    finalizado: "Finalizado",
  }

  return statusMap[status] || status
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    agendada: "bg-yellow-500",
    em_andamento: "bg-green-500",
    finalizada: "bg-blue-500",
    agendado: "bg-yellow-500",
    em_andamento: "bg-green-500",
    finalizado: "bg-blue-500",
  }

  return colorMap[status] || "bg-gray-500"
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

export function formatUptime(uptime: number): string {
  return formatDuration(uptime)
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return "0%"
  return ((value / total) * 100).toFixed(1) + "%"
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("pt-BR").format(num)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount)
}
