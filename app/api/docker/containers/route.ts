import { type NextRequest, NextResponse } from "next/server";
import Docker from "dockerode";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

export async function GET() {
  try {
    const containers = await docker.listContainers({ all: true });

    const formattedContainers = await Promise.all(
      containers.map(async (containerInfo) => {
        const container = docker.getContainer(containerInfo.Id);
        const stats = await container.stats({ stream: false });
        const inspect = await container.inspect();

        return {
          id: containerInfo.Id,
          name: containerInfo.Names[0]?.replace("/", "") || "unknown",
          image: containerInfo.Image,
          status: containerInfo.State,
          created: new Date(containerInfo.Created * 1000).toISOString(),
          ports: containerInfo.Ports.map((port) => ({
            internal: port.PrivatePort,
            external: port.PublicPort || 0,
            protocol: port.Type,
          })),
          cpu: calculateCpuPercent(stats),
          memory: Math.round((stats.memory_stats?.usage || 0) / 1024 / 1024),
          logs: [],
        };
      })
    );

    return NextResponse.json(formattedContainers);
  } catch (error) {
    console.error("Error fetching containers:", error);
    return NextResponse.json(
      { error: "Failed to fetch containers" },
      { status: 500 }
    );
  }
}

// Adiciona endpoint para criar container do MatchBot
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, image, env, ports, volumes, matchbot } = body;

    // Se matchbot estiver habilitado, injeta variáveis e plugins necessários
    let finalEnv: Record<string, string> = {};
    if (Array.isArray(env)) {
      // array de strings tipo ["FOO=bar", ...]
      env.forEach((item: string) => {
        const [key, ...rest] = item.split("=");
        finalEnv[key] = rest.join("=");
      });
    } else if (typeof env === "object" && env !== null) {
      finalEnv = { ...env };
    }

    let finalVolumes = Array.isArray(volumes) ? [...volumes] : [];
    if (matchbot && matchbot.enabled) {
      finalEnv = {
        ...finalEnv,
        MATCHBOT_ENABLED: "1",
        MATCHBOT_VERSION: matchbot.version || "latest",
      };
      // Exemplo: monta pasta de plugins do MatchBot
      finalVolumes.push({
        host: "/opt/matchbot",
        container: "/cstrike/addons/matchbot",
      });
    }

    const portsArr = Array.isArray(ports) ? ports : [];
    const container = await docker.createContainer({
      name,
      Image: image,
      Env: Object.entries(finalEnv).map(([key, value]) => `${key}=${value}`),
      ExposedPorts: portsArr.reduce((acc: any, port: any) => {
        acc[`${port.internal}/${port.protocol}`] = {};
        return acc;
      }, {}),
      HostConfig: {
        PortBindings: portsArr.reduce((acc: any, port: any) => {
          acc[`${port.internal}/${port.protocol}`] = [
            { HostPort: port.external ? port.external.toString() : port.internal.toString() },
          ];
          return acc;
        }, {}),
        Binds: finalVolumes.map((vol: any) => `${vol.host}:${vol.container}`),
      },
    });

    await container.start();

    return NextResponse.json({
      id: container.id,
      message: "Container created and started successfully",
    });
  } catch (error) {
    console.error("Error creating container:", error);
    return NextResponse.json(
      { error: "Failed to create container" },
      { status: 500 }
    );
  }
}

function calculateCpuPercent(stats: any): number {
  const cpuDelta =
    stats.cpu_stats?.cpu_usage?.total_usage -
    stats.precpu_stats?.cpu_usage?.total_usage;
  const systemDelta =
    stats.cpu_stats?.system_cpu_usage - stats.precpu_stats?.system_cpu_usage;
  const numberCpus = stats.cpu_stats?.online_cpus || 1;

  if (systemDelta > 0 && cpuDelta > 0) {
    return (cpuDelta / systemDelta) * numberCpus * 100;
  }
  return 0;
}
