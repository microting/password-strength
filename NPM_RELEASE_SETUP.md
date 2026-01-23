# NPM Release Setup Instructions (OIDC Trusted Publishing)

This document explains how to configure OIDC Trusted Publishing to enable automated npm package publishing via GitHub Actions.

**OIDC Trusted Publishing** is the modern, secure way to publish npm packages from CI/CD systems. It eliminates the need for long-lived npm tokens by using short-lived credentials generated on each workflow execution.

## Benefits of OIDC Trusted Publishing

- 🔒 **More Secure**: No long-lived tokens to manage or rotate
- 🎯 **Automatic Provenance**: Supply chain transparency built-in
- ✅ **Simpler**: No need to create or store tokens in GitHub Secrets
- 🔍 **Auditable**: Clear record of which workflow published each version

## Prerequisites

1. **NPM Account**: You must have an npm account at [npmjs.com](https://npmjs.com)
2. **Organization Membership**: Your npm account must be a member of the `microting` organization on npmjs.com
3. **Package Access**: Ensure the organization has access to publish packages under the `@angular-material-extensions` scope
4. **NPM CLI Version**: The workflow uses Node.js 22.x which includes npm 10.x (compatible with OIDC)

## Required Setup on npmjs.com

### Configure Trusted Publishing for Your Package

1. **Log in to npmjs.com** with an account that has admin access to the package

2. **Navigate to Package Settings**:
   - If the package doesn't exist yet, you'll configure this after the first manual publish
   - For existing packages: Go to `https://www.npmjs.com/package/@angular-material-extensions/password-strength/access`

3. **Add GitHub Actions as a Trusted Publisher**:
   - Click on "Publishing access" or "Trusted publishers" section
   - Click "Add trusted publisher"
   - Select "GitHub Actions" as the provider
   - Fill in the configuration:
     - **Repository owner**: `microting`
     - **Repository name**: `password-strength`
     - **Workflow file**: `.github/workflows/release.yml`
     - **Environment** (optional): Leave blank or specify if you use GitHub Environments
   - Click "Add" to save

4. **Verify Configuration**:
   - The trusted publisher should now be listed
   - GitHub Actions from the specified workflow can now publish without an npm token

### First-Time Package Publishing

If the package `@angular-material-extensions/password-strength` doesn't exist on npmjs.com yet, you'll need to:

1. **Publish the first version manually** (one-time only):
   ```bash
   cd /path/to/repository
   npm install --legacy-peer-deps
   npm run build:lib
   cd dist/angular-material-extensions/password-strength
   npm publish --access public
   ```

2. **Then configure OIDC Trusted Publishing** as described above

3. **All subsequent releases** will use the automated GitHub Actions workflow

## No GitHub Secrets Required!

Unlike traditional token-based publishing, **OIDC Trusted Publishing does not require any secrets to be stored in GitHub**. The authentication happens automatically through OpenID Connect.

## How to Create a Release

Once the manual setup is complete, creating a release is simple:

1. Ensure all changes are committed and pushed to the main branch
2. Create and push a version tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
3. The GitHub Actions workflow will automatically:
   - Run all tests and builds
   - Verify the version matches the tag
   - Authenticate using OIDC (no token needed!)
   - Publish with automatic provenance attestation
   - The package will be available at: `https://www.npmjs.com/package/@angular-material-extensions/password-strength`

## Provenance and Supply Chain Security

When using OIDC Trusted Publishing, npm automatically generates and attaches **provenance attestations** to your package. This provides:

- 🔍 **Transparency**: Anyone can verify where and how the package was built
- 🛡️ **Security**: Proof that the package came from your GitHub repository and workflow
- 📋 **Auditability**: Complete build information is cryptographically signed

View provenance information on the npm package page after publishing.

## Tag Naming Convention

The workflow is triggered by tags matching the pattern `v*`:
- ✅ `v1.0.0` - Will trigger release
- ✅ `v2.1.3` - Will trigger release
- ✅ `v1.0.0-beta.1` - Will trigger release
- ❌ `1.0.0` - Will NOT trigger (missing 'v' prefix)
- ❌ `release-1.0.0` - Will NOT trigger (doesn't match pattern)

## Package Version Synchronization

**Important**: The version in the built package's `package.json` (`projects/angular-material-extensions/password-strength/package.json`) must match the git tag version. The workflow includes an automatic validation step that will fail the release if versions don't match.

Steps to create a release:

1. Update the version in `projects/angular-material-extensions/password-strength/package.json`
2. Commit the change
3. Create a matching git tag (e.g., if package.json has `16.0.1`, tag should be `v16.0.1`)
4. Push both the commit and the tag

## Verifying OIDC Configuration

After setting up OIDC Trusted Publishing on npmjs.com, you can verify it's working:

1. Push a test tag to trigger the workflow
2. Monitor the workflow execution at: `https://github.com/microting/password-strength/actions`
3. The "Publish to npm with provenance" step should succeed without any token
4. Check the npm package page - it should show provenance information

## Alternative: Token-Based Publishing (Not Recommended)

If you cannot use OIDC Trusted Publishing for some reason, you can fall back to traditional token-based publishing:

### Fallback Configuration:

1. **Create NPM Automation Token** on npmjs.com (Automation type)
2. **Add to GitHub Secrets** as `NPM_TOKEN`
3. **Modify the workflow**: Change the publish step to:
   ```yaml
   - name: Publish to npm
     run: npm publish ./dist/angular-material-extensions/password-strength --access public
     env:
       NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
   ```
4. **Remove OIDC permissions**: Change `id-token: write` to just `contents: read`

However, **OIDC is strongly recommended** for better security and automatic provenance.

## Troubleshooting

### Publishing Fails with OIDC Authentication Error
- Verify the trusted publisher is correctly configured on npmjs.com
- Ensure the repository owner, name, and workflow file match exactly
- Check that the workflow has `id-token: write` permission
- Confirm npm supports OIDC on the package (may need manual first publish)

### "Package does not exist" Error
- You need to publish the first version manually before OIDC can be configured
- Follow the "First-Time Package Publishing" steps above

### Provenance Not Showing
- Ensure you're using `--provenance` flag in the publish command
- Verify the workflow has `id-token: write` permission
- Check that npm CLI version is 11.5.1 or later (Node 22.x includes compatible npm)

### Version Mismatch Error
- The package.json version must exactly match the git tag (without the 'v' prefix)
- Update package.json before creating the tag
- Example: package.json has `"version": "16.0.1"` → tag must be `v16.0.1`

## Documentation References

- [npm: Trusted Publishing with OIDC](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub: npm Trusted Publishing Announcement](https://github.blog/changelog/2025-07-31-npm-trusted-publishing-with-oidc-is-generally-available/)
- [npm: Configuring Trusted Publishers](https://docs.npmjs.com/trusted-publishers)
- [npm: Creating and publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
- [GitHub: Publishing Node.js packages](https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages)
