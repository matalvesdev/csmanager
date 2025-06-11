import { type NextRequest, NextResponse } from "next/server"
import Docker from "dockerode"

const docker = new Docker({ socketPath: "/var/run/docker.sock" })

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const container = docker.getContainer(params.id)
    const inspect = await container.inspect()
    const stats = await container.stats({ stream: false })

    return NextResponse.json({
      id: inspect.Id,
      name: inspect.Name.replace("/", ""),
      image: inspect.Config.Image,
      status: inspect.State.Status,
      created: inspect.Created,
      cpu: calculateCpuPercent(stats),
      memory: Math.round((stats.memory_stats?.usage || 0) / 1024 / 1024),
    })
  } catch (error) {
    console.error("Error fetching container:", error)
    return NextResponse.json({ error: "Container not found" }, { status: 404 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { action } = body
    const container = docker.getContainer(params.id)

    switch (action) {
      case "start":
        await container.start()
        break
      case "stop":
        await container.stop()
        break
      case "restart":
        await container.restart()
        break
      case "remove":
        await container.remove({ force: true })
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ message: `Container ${action} successful` })
  } catch (error) {
    console.error(`Error performing container action:`, error)
    return NextResponse.json({ error: "Failed to perform container action" }, { status: 500 })
  }
}

function calculateCpuPercent(stats: any): number {
  const cpuDelta = stats.cpu_stats?.cpu_usage?.total_usage - stats.precpu_stats?.cpu_usage?.total_usage
  const systemDelta = stats.cpu_stats?.system_cpu_usage - stats.precpu_stats?.system_cpu_usage
  const numberCpus = stats.cpu_stats?.online_cpus || 1

  if (systemDelta > 0 && cpuDelta > 0) {
    return (cpuDelta / systemDelta) * numberCpus * 100
  }
  return 0
}
