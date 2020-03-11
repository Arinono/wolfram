import Server from './wolfram/server'

let server: Server
try {
  server = new Server(process.env.PORT || 5000)
} catch (e) {
  console.error(e)
  process.exit(1)
}
server.start()
