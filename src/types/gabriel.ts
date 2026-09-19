export type GabrielCopy = {
  /** First-person opener shown in the compact homepage section. */
  headline: string
  /** 3–4 short paragraphs, in his voice — used by both variants. */
  paragraphs: string[]
  /** e.g. "— Gabriel". */
  signOff: string
  /** Full /about page — its own <h1>, separate from the homepage headline. */
  aboutTitle: string
  aboutIntro: string
  /** Longer version of his story for the dedicated /about page. */
  aboutBody: string[]
}
