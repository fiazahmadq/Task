import 'dotenv/config'
import { createServer } from 'http'
import next from 'next'
import { initSocketServer } from './src/lib/socket/server'

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME ?? 'localhost'
const port = parseInt(process.env.PORT ?? '3000', 10)

async function main() {
  const app = next({ dev, hostname, port })
  const handle = app.getRequestHandler()

  await app.prepare()

  const httpServer = createServer(async (req, res) => {
    await handle(req, res)
  })

  await initSocketServer(httpServer)

  httpServer.listen(port, () => {
    console.log(`> NexusAI ready on http://${hostname}:${port}`)
  })
}

main().catch((err) => {
  console.error('Server startup failed:', err)
  process.exit(1)
})
