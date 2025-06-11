import { type NextRequest, NextResponse } from "next/server"
import Docker from "dockerode"

const docker = new Docker({ socketPath: "/var/run/docker.sock" })

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const container = docker.getContainer(params.id)
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      tail: 100,
      timestamps: true,
    })

    const logLines = logs
      .toString()
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\x00|\x01|\x02/g, "").trim())

    return NextResponse.json({ logs: logLines })
  } catch (error) {
    console.error("Error fetching container logs:", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}
