import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Without this, each render() within a file piles onto the same jsdom
// document, so a later test can match elements a previous test left behind.
afterEach(cleanup)
