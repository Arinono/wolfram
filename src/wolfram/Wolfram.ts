import axios, { AxiosResponse } from 'axios'

enum Units {
  METRIC = 'metric',
  IMPERIAL = 'imperial'
}

export default class Wolfram {
  #apiURL: string
  #appID: string

  constructor () {
    this.#apiURL = 'https://api.wolframalpha.com/v1/result'
    if (!process.env.WOLFRAM_APP_ID) {
      throw new Error('WOLFRAM_APP_ID required to use wolfram service.')
    }
    this.#appID = process.env.WOLFRAM_APP_ID
  }

  public answer (question: string, units: Units = Units.METRIC): Promise<string> {
    console.log(`Wolfram.answer() called with: ${question} and system of units: ${units}`)
    return new Promise((resolve, reject) => {
      axios.get(`${this.#apiURL}?i=${encodeURI(question)}&appid=${this.#appID}&units=${units}`)
        .then((res: AxiosResponse) => {
          const { status, statusText, data } = res
          if (status !== 200) {
            console.log(`Wolfram.answer() errored with: ${statusText}`)
            reject(statusText)
          }
          console.log(`Wolfram.answer() responded successfully with: ${data}`)
          resolve(data)
        })
        .catch(e => {
          const { status, statusText, data } = e.response
          console.log(`Wolfram.answer() errored with: ${data || statusText}`)
          reject({ status, statusText, data })
        })
    })
  }
}
