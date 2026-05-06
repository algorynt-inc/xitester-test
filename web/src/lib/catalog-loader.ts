/**
 * Static test catalog generated at build time by `playwright test --list`.
 * The output is a JSON tree of suites/specs that we flatten into a flat list
 * of test cases so Suites and SuiteDetail can render the full surface area
 * even before any test has actually run.
 */

import { suiteFromFile } from './results-loader'

interface PwSpec {
    title: string
    file?: string
    line?: number
    tests?: Array<{ projectName?: string; expectedStatus?: string }>
}

interface PwSuite {
    title: string
    file?: string
    specs?: PwSpec[]
    suites?: PwSuite[]
}

interface PwListOutput {
    suites?: PwSuite[]
}

export interface CatalogTest {
    /** TC-XX-NNN parsed from the spec title, or fallback to the title slice. */
    id: string
    title: string
    /** Suite (login / signup / ...) derived from the spec file basename. */
    suite: string
    /** test.describe(...) title — null if test isn't inside one. */
    category: string | null
    /** File path of the spec, e.g. "playwright/tests/login.spec.ts". */
    file: string
    /** Project names this test runs under (chromium, mobile-chromium, ...). */
    projects: string[]
}

export interface Catalog {
    /** All known tests. */
    tests: CatalogTest[]
    /** Distinct suite names, sorted. */
    suites: string[]
    /** Mapping suite → distinct categories (in declaration order). */
    categoriesBySuite: Record<string, string[]>
    /** True when this came from a non-empty playwright --list. */
    available: boolean
}

const TC_ID_RE = /^(TC-[A-Z]{2,4}-\d{3})/

let cached: Promise<Catalog> | null = null

export async function loadCatalog(): Promise<Catalog> {
    if (!cached) cached = fetchAndParse()
    return cached
}

async function fetchAndParse(): Promise<Catalog> {
    const url = `${import.meta.env.BASE_URL}test-catalog.json`
    let raw: PwListOutput
    try {
        const res = await fetch(url, { cache: 'no-cache' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        raw = (await res.json()) as PwListOutput
    } catch {
        return { tests: [], suites: [], categoriesBySuite: {}, available: false }
    }
    return parseCatalog(raw)
}

function parseCatalog(raw: PwListOutput): Catalog {
    const tests: CatalogTest[] = []
    const seen = new Set<string>()

    const visit = (suite: PwSuite, ancestry: string[]): void => {
        const file = suite.file
        const fileSuiteName = file ? suiteFromFile(file) : ''

        for (const spec of suite.specs ?? []) {
            const specFile = spec.file ?? file ?? ''
            // Filter out infrastructure tests — auth.setup.ts and friends are
            // part of the setup project, not a user-facing suite. They
            // shouldn't show up on the Suites page, in the Trigger dropdown,
            // or in the env-status grid.
            if (/\.setup\.[tj]sx?$/.test(specFile)) continue

            const projects = (spec.tests ?? []).map(t => t.projectName ?? '').filter(Boolean)
            // Also skip if every project for this spec is `setup`.
            if (projects.length > 0 && projects.every(p => p === 'setup')) continue

            const idMatch = spec.title.match(TC_ID_RE)
            const id = idMatch?.[1] ?? spec.title.slice(0, 24)
            const category = pickCategory(ancestry)
            const dedupe = `${specFile}|${id}|${projects.join(',')}`
            if (seen.has(dedupe)) continue
            seen.add(dedupe)
            tests.push({
                id,
                title: spec.title,
                suite: suiteFromFile(specFile) || fileSuiteName || 'unknown',
                category,
                file: specFile,
                projects,
            })
        }
        for (const child of suite.suites ?? []) {
            visit(child, [...ancestry, child.title])
        }
    }

    for (const root of raw.suites ?? []) {
        visit(root, [root.title])
    }

    const suiteSet = new Set<string>()
    const catBySuite: Record<string, string[]> = {}
    for (const t of tests) {
        suiteSet.add(t.suite)
        const cats = catBySuite[t.suite] ?? []
        const key = t.category ?? 'Uncategorised'
        if (!cats.includes(key)) cats.push(key)
        catBySuite[t.suite] = cats
    }

    return {
        tests,
        suites: Array.from(suiteSet).sort(),
        categoriesBySuite: catBySuite,
        available: tests.length > 0,
    }
}

function pickCategory(ancestry: string[]): string | null {
    // Walk from deepest to shallowest, pick the first that looks like a describe
    // (no path separator, no .spec.ts, has a non-empty title).
    for (let i = ancestry.length - 1; i >= 0; i--) {
        const t = ancestry[i].trim()
        if (!t) continue
        if (t.includes('/') || t.includes('\\')) continue
        if (/\.(spec|test)\.[tj]sx?$/.test(t)) continue
        return t
    }
    return null
}

export function categoryOrUncategorised(c: string | null): string {
    return c ?? 'Uncategorised'
}
