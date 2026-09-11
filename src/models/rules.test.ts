import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../api/extension', () => ({
    Storage: {
        addListener: vi.fn(),
        get: vi.fn(),
        set: vi.fn(),
    },
}))

import { type Rule, RuleMatchMode } from '../types/rules.types'
import Rules from './rules'

const rule = (matchMode: RuleMatchMode, query: string): Rule => ({
    id: 'rule-id',
    matchMode,
    query,
})

describe('rule matching', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('matches contains rules without regard to case', () => {
        expect(
            Rules.contains(
                rule(RuleMatchMode.Contains, 'GitHub.com/Issues'),
                'https://github.COM/issues/123',
            ),
        ).toBe(true)
    })

    it('matches exact rules without regard to case', () => {
        expect(
            Rules.isExactly(
                rule(RuleMatchMode.Exact, 'https://GitHub.com/Issues'),
                'https://github.COM/issues',
            ),
        ).toBe(true)
    })
})
