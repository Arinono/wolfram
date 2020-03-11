import express, { Application, Request, Response } from 'express'
import Wolfram from './Wolfram'
import bodyParser from 'body-parser'
import http from 'http'

export default class Server {
  readonly #app: Application
  readonly #ctrl: Wolfram
  #port: number

  constructor (port: number | string) {
    this.#app = express()
    this.initMiddlewares()
    this.initRoutes()

    if (typeof port === 'string') {
      try {
        this.#port = parseInt(port, 10)
        if (!Number.isInteger(this.#port)) {
          throw new Error('Provided port is not a valid integer.')
        } else if (this.#port <= 0 || this.#port > 65535) {
          throw new Error('Provided port should be >= 0 and < 65536.')
        }
      } catch {
        throw new Error('Provided port is not a valid integer.')
      }
    } else {
      this.#port = port
    }

    // Can throw an Error, catched at the root of the app
    this.#ctrl = new Wolfram()
  }

  public start (): http.Server {
    console.log(`🚀 Wolfram service listening on port :${this.#port}`)
    return this.#app.listen(this.#port)
  }

  private initMiddlewares (): void {
    this.#app.use(bodyParser.json())
  }

  private initRoutes (): void {
    this.#app.post('/answer', async (req: Request, res: Response) => {
      const answer = await this.#ctrl.answer(req.body.question).catch(e => {
        res.status(e.status).send(e.data || e.statusText)
        return
      })
      res.status(200).send(answer)
    })
  }
}
