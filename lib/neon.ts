import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Função helper para executar queries com tratamento de erro
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await sql(query, params)
    return result as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error(`Database error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Função para verificar conexão
export async function testConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1 as test`
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}
