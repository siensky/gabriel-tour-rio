import { describe, expect, it } from 'vitest'

import { LOCALES } from '@/lib/i18n'
import { getChildTours, getHubTour, getTour, getToursByCategory, tours } from '@/content/tours'

describe('tours content', () => {
  it('has 24 tours, per the plan\'s cluster tables', () => {
    expect(tours).toHaveLength(24)
  })

  it('has unique slugs', () => {
    const slugs = tours.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('gives every tour copy in all four locales', () => {
    for (const tour of tours) {
      for (const locale of LOCALES) {
        expect(tour.i18n[locale], `${tour.slug} is missing ${locale} copy`).toBeDefined()
      }
    }
  })

  it('marks exactly the two cluster hubs as hub: true', () => {
    const hubSlugs = tours.filter((t) => t.hub).map((t) => t.slug).sort()
    expect(hubSlugs).toEqual(['favela-tours', 'hiking-rio-de-janeiro'])
  })

  it('never sets both hub and parent on the same tour', () => {
    for (const tour of tours) {
      expect(tour.hub && tour.parent !== null).toBe(false)
    }
  })

  it('points every parent at a tour that actually exists and is a hub', () => {
    for (const tour of tours) {
      if (tour.parent === null) continue
      const parent = getTour(tour.parent)
      expect(parent, `${tour.slug}'s parent "${tour.parent}" does not exist`).toBeDefined()
      expect(parent?.hub, `${tour.slug}'s parent "${tour.parent}" is not a hub`).toBe(true)
    }
  })

  it('splits into 10 tier-1 and 14 tier-2 tours, as approved for the rollout', () => {
    expect(tours.filter((t) => t.tier === 1)).toHaveLength(10)
    expect(tours.filter((t) => t.tier === 2)).toHaveLength(14)
  })

  it('lists favela-tours\' three communities as its children', () => {
    const children = getChildTours('favela-tours').map((t) => t.slug)
    expect(children.sort()).toEqual([
      'rocinha-favela-tour',
      'santa-marta-favela-tour',
      'vidigal-favela-tour',
    ])
  })

  it('lists hiking-rio-de-janeiro\'s three trails as its children', () => {
    const children = getChildTours('hiking-rio-de-janeiro').map((t) => t.slug)
    expect(children.sort()).toEqual([
      'pedra-da-gavea-hike',
      'tijuca-forest-hike',
      'two-brothers-hill-vidigal-hike',
    ])
  })

  it('getHubTour refuses a slug that exists but is not a hub', () => {
    expect(getHubTour('rocinha-favela-tour')).toBeUndefined()
    expect(getHubTour('favela-tours')).toBeDefined()
  })

  it('getToursByCategory returns tours sorted by their declared order', () => {
    const water = getToursByCategory('water')
    const orders = water.map((t) => t.order)
    expect(orders).toEqual([...orders].sort((a, b) => a - b))
  })
})
