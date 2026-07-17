# Releasing LightSpec

LightSpec is distributed via **git tags on the public GitHub repo**
(`github.com/retronoodle/lightspec`) — not npm (the npm name `lightspec` is
taken by an unrelated package). `lightspec upgrade` installs the newest tag via
`npm install -g 'retronoodle/lightspec#semver:*'`.

## Cutting a release

1. Land all changes on `main`.
2. Bump `version` in `package.json` (semver).
3. Tag and push:
   ```sh
   git tag v0.2.0
   git push origin v0.2.0
   ```
4. (Optional) Create a GitHub Release from the tag for changelog notes.

That's it. The next `lightspec upgrade` anywhere resolves `semver:*` to this tag.

Keep the tag (`v0.2.0`) and `package.json` `version` (`0.2.0`) in sync — the
version stamp written to a repo's `lightspec/.version` comes from `package.json`.

## Who can release

Releases require **write (push) access** to this repo — that's the owner and
any collaborators explicitly added. "Public" only grants read/clone access.

- **Contributors** open pull requests from forks. Their tags live on *their*
  fork and never affect `lightspec upgrade`, which resolves only against tags on
  this repo.
- **You** review/merge PRs and are the only one who tags releases (unless you
  grant someone write access).

So the project is open to contributions but closed to releases — the standard
open-source model.
