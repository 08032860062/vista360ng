## Summary

Describe the change and why it matters.

## What I changed
- Brief list of changes

## How to preview
1. Push the branch and open a PR.
2. On the PR, the **Visual regression** workflow will run and upload `artwork/` and baselines as artifacts.
3. To publish a preview to GitHub Pages, merge to `main` and the Pages deploy workflow will publish the `public/` directory.

## Notes
- To update visual baselines after intentional UI changes: run `npm run screenshot` and `npm run visual:update-baseline`, commit the updated baseline images, and push the branch.
