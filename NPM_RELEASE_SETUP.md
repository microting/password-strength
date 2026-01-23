# NPM Release Setup Instructions

This document explains what needs to be configured manually to enable automated npm package publishing via GitHub Actions.

## Prerequisites

1. **NPM Account**: You must have an npm account at [npmjs.com](https://npmjs.com)
2. **Organization Membership**: Your npm account must be a member of the `microting` organization on npmjs.com
3. **Package Access**: Ensure the organization has access to publish packages under the `@angular-material-extensions` scope

## Required Manual Setup

### 1. Create NPM Automation Token

1. Log in to [npmjs.com](https://npmjs.com)
2. Click on your profile picture → "Access Tokens"
3. Click "Generate New Token"
4. Select "Automation" as the token type (this bypasses 2FA requirements for CI/CD)
5. Give it a descriptive name like "GitHub Actions - microting/password-strength"
6. Copy the token value immediately (you won't be able to see it again)

**Important**: Automation tokens are specifically designed for CI/CD systems and bypass 2FA requirements, making them ideal for GitHub Actions workflows.

### 2. Add Token to GitHub Secrets

1. Go to the GitHub repository: `https://github.com/microting/password-strength`
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste the npm token you created in step 1
6. Click "Add secret"

### 3. Verify Package Configuration

Ensure the library's `package.json` has the correct configuration:
- Package name: `@angular-material-extensions/password-strength`
- Version will be managed through git tags
- The workflow publishes with `--access public` flag for public availability

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
   - If tests pass, publish the package to npmjs.com
   - The package will be available at: `https://www.npmjs.com/package/@angular-material-extensions/password-strength`

## Tag Naming Convention

The workflow is triggered by tags matching the pattern `v*`:
- ✅ `v1.0.0` - Will trigger release
- ✅ `v2.1.3` - Will trigger release
- ✅ `v1.0.0-beta.1` - Will trigger release
- ❌ `1.0.0` - Will NOT trigger (missing 'v' prefix)
- ❌ `release-1.0.0` - Will NOT trigger (doesn't match pattern)

## Package Version Synchronization

**Important**: The version in the built package's `package.json` (`projects/angular-material-extensions/password-strength/package.json`) should match the git tag version. You need to:

1. Update the version in `projects/angular-material-extensions/password-strength/package.json`
2. Commit the change
3. Create a matching git tag (e.g., if package.json has `16.0.1`, tag should be `v16.0.1`)
4. Push both the commit and the tag

## Alternative: OIDC Trusted Publishing (Optional)

For enhanced security, npm now supports OIDC-based trusted publishing which eliminates the need for long-lived tokens:

1. Configure trusted publishing on npmjs.com in your package settings
2. Specify GitHub Actions as the trusted publisher
3. Update the workflow to use OIDC authentication
4. Requires npm CLI version 11.5.1 or later

This is more secure but requires npm CLI 11.5.1+. The current setup uses the traditional token-based approach which is simpler and widely supported.

## Troubleshooting

### Publishing Fails with Authentication Error
- Verify the `NPM_TOKEN` secret is correctly set in GitHub
- Ensure the token is an "Automation" type token
- Check that the token hasn't expired

### Publishing Fails with Permission Error
- Verify your npm account is a member of the microting organization
- Ensure the organization has permission to publish to the `@angular-material-extensions` scope
- Check that the token has publish permissions

### Tests Pass but Package Not Published
- Check the GitHub Actions logs for specific error messages
- Verify the package name in `package.json` is exactly `@angular-material-extensions/password-strength`
- Ensure the `--access public` flag is present in the publish command

## Documentation References

- [npm: Creating and publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
- [npm: Creating and publishing an organization scoped package](https://docs.npmjs.com/creating-and-publishing-an-organization-scoped-package)
- [GitHub: Publishing Node.js packages](https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages)
