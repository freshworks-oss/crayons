# Release Process

Crayons will be having 2 branches:

1. **master** - release branch
2. **next** - pre-release branch (experimental branch)

**Steps**:

1. Any new PRs will be merged to the `next` branch after approval. Feature, refactor, and bug fix branches are created from `next`

2. **Weekly pre-release**

   1. The `next` branch will be used for pre-release. (3.1.1-beta.1).
   2. It will be published to npm with dist-tag as `next` - 3.1.1-beta.1@next.

3. **Stable release**
   1. The `next` branch will be merged to the `master` branch.
   2. The pre-release version will be graduated to a stable release version (3.1.2).
   3. It will be published to npm with dist-tag as `latest` - 3.1.2

Merge `main` branch into `next` branch post releasing stable version.

The above release process is described as below:

<img alt="Release Process" src=".github/assets/crayons-release.svg">

## Dew pre-release (`feat/dew2.0`)

Dew is a separate prerelease line (`4.x.x-dew.N`) published with dist-tag **`dew`**. It is not covered by the `next` / `latest` flow above.

The git repo lives in **`freshworks-oss/crayons`**. Packages are still named **`@freshworks/...`** and publish to **GitHub Packages** (`npm.pkg.github.com`). The npm scope `@freshworks` maps to the **`freshworks`** GitHub org, not `freshworks-oss`. That is why two GitHub accounts are required.

### Accounts

| Work | Account | Credential |
| --- | --- | --- |
| `git push` to `freshworks-oss/crayons`, `npm run update-dew` (version bump + GitHub Release) | **`arvindanta`** | SSH key authorized for **SAML SSO** on `freshworks-oss`. `gh` active account = `arvindanta`. |
| `npm run release-dew:ci` (publish `@freshworks/*` to GitHub Packages) | **`aashwathanarayanan_fwinc`** | PAT in **local** `.npmrc` (`//npm.pkg.github.com/:_authToken=...`) with `read:packages`, `write:packages`, and `repo`. |

`gh auth switch` does **not** change `npm whoami`. npm always uses `.npmrc`. Confirm before each step:

```bash
gh auth status                    # arvindanta for update-dew
npm whoami --registry=https://npm.pkg.github.com   # aashwathanarayanan_fwinc for release-dew:ci
```

Do not commit `.npmrc` (it is gitignored).

### One-time SSH SSO (`arvindanta`)

`ssh -T git@github.com` succeeding as `arvindanta` is not enough to push to `freshworks-oss`. Authorize the crayons SSH key for org SSO:

1. Sign in as `arvindanta` and complete SSO at [github.com/orgs/freshworks-oss/sso](https://github.com/orgs/freshworks-oss/sso).
2. [github.com/settings/keys](https://github.com/settings/keys) → key `arvindanta@github` → **Configure SSO** → **Authorize** `freshworks-oss`.

This repo is configured to use `~/.ssh/id_ed25519_arvindanta` via `core.sshCommand`.

### Commands

From the repo root, on branch `feat/dew2.0`, with Node matching the project engines:

1. **Version bump** (as `arvindanta` — git + `gh`):

   ```bash
   gh auth switch --user arvindanta
   npm run update-dew
   ```

   This runs translations + build, `lerna version` with `--preid dew`, creates a GitHub Release, then `update-tag:dew` (changelog cleanup commit and `git push origin feat/dew2.0` plus tags).

2. **Publish to GitHub Packages** (as `aashwathanarayanan_fwinc` — npm PAT):

   ```bash
   npm whoami --registry=https://npm.pkg.github.com   # must be aashwathanarayanan_fwinc
   npm run release-dew:ci
   ```

   This runs `lerna publish from-package --dist-tag dew`, then `update-lock:dew`.

Install in other projects:

```bash
npm i @freshworks/crayons@dew
```

If publish returns `E404` on `https://npm.pkg.github.com/@freshworks%2f...`, the npm token’s GitHub user cannot write `@freshworks` packages (org `freshworks`). Git access to `freshworks-oss` does not grant that. Use the `aashwathanarayanan_fwinc` PAT, or ask a `freshworks` admin for package write.
