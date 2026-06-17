// Fetches per-paragraph comment counts from GitHub Discussions (used by giscus)
// and writes them to data/comment-counts.json so the site can show a comment
// badge only on paragraphs that already have comments.
//
// Discussions are GraphQL-only and require auth, so this runs at build time
// (in GitHub Actions, GITHUB_TOKEN is provided automatically). Without a token
// or repo, it is a no-op that keeps any existing counts file intact.

import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

const OUTPUT_PATH = './data/comment-counts.json'

function ensureFile() {
  if (!existsSync(OUTPUT_PATH)) {
    mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
    writeFileSync(OUTPUT_PATH, '{}\n')
  }
}

async function main() {
  const repoSlug = process.env.NEXT_PUBLIC_GISCUS_REPO
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN

  if (!repoSlug || !repoSlug.includes('/')) {
    console.warn('[comment-counts] NEXT_PUBLIC_GISCUS_REPO not set; skipping fetch.')
    ensureFile()
    return
  }
  if (!token) {
    console.warn('[comment-counts] No GITHUB_TOKEN available; skipping fetch.')
    ensureFile()
    return
  }

  const [owner, name] = repoSlug.split('/')
  const query = `
    query ($owner: String!, $name: String!, $cursor: String) {
      repository(owner: $owner, name: $name) {
        discussions(first: 100, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          nodes { title comments { totalCount } }
        }
      }
    }
  `

  const counts = {}
  let cursor = null

  try {
    do {
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'comment-counts-fetcher',
        },
        body: JSON.stringify({ query, variables: { owner, name, cursor } }),
      })

      if (!res.ok) {
        throw new Error(`GitHub API responded ${res.status}: ${await res.text()}`)
      }

      const json = await res.json()
      if (json.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
      }

      const discussions = json.data?.repository?.discussions
      if (!discussions) break

      for (const node of discussions.nodes) {
        if (node?.title) {
          counts[node.title] = node.comments?.totalCount ?? 0
        }
      }

      cursor = discussions.pageInfo.hasNextPage ? discussions.pageInfo.endCursor : null
    } while (cursor)
  } catch (err) {
    console.warn(`[comment-counts] Fetch failed, keeping existing counts: ${err.message}`)
    ensureFile()
    return
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(counts, null, 2) + '\n')
  console.log(
    `[comment-counts] Wrote ${Object.keys(counts).length} discussion counts to ${OUTPUT_PATH}`
  )
}

main()
