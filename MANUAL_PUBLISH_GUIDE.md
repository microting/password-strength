# Manual Publishing Guide for @microting/password-strength

This guide explains how to manually publish the first version of `@microting/password-strength` to npmjs.com. After the first manual publish, all subsequent releases will be automated via GitHub Actions.

## Why Manual First Publish?

OIDC Trusted Publishing requires the package to exist on npmjs.com before the trusted publisher configuration can be set up. Therefore, the first version (v16.0.0) must be published manually.

## Prerequisites

1. **NPM Account**: You must have an npm account at [npmjs.com](https://npmjs.com)
2. **Organization Access**: Your npm account must be a member of the `microting` organization with publish permissions
3. **Authentication**: You must be logged in to npm via CLI (`npm login`)

## Method 1: Using GitHub Actions Artifact (Recommended)

This is the easiest method as the package is already built and tested by CI.

### Step 1: Download the Built Package

1. Go to the GitHub Actions page for this repository:
   ```
   https://github.com/microting/password-strength/actions
   ```

2. Click on the most recent successful workflow run (look for the green checkmark ✓)

3. Scroll down to the "Artifacts" section at the bottom of the page

4. Download the **npm-package** artifact (it will download as `npm-package.zip`)

5. Extract the zip file:
   ```bash
   unzip npm-package.zip -d npm-package
   cd npm-package
   ```

### Step 2: Verify the Package

Before publishing, verify the package contents:

```bash
# Check package name and version
cat package.json | grep -E '"name"|"version"'

# Should show:
# "name": "@microting/password-strength",
# "version": "16.0.0",

# List package contents
ls -la
```

Expected files:
- `package.json` - Package metadata
- `README.md` - Documentation (if included)
- `esm2022/` - ES modules
- `fesm2022/` - Flattened ES modules
- `lib/` - TypeScript definitions
- `*.d.ts` - Type definition files

### Step 3: Log in to npm

```bash
npm login
```

You'll be prompted for:
- **Username**: Your npm username
- **Password**: Your npm password
- **Email**: Your npm email
- **OTP** (if 2FA is enabled): Enter the one-time password

### Step 4: Publish the Package

```bash
npm publish --access public
```

**Important**: The `--access public` flag is required for scoped packages (@microting/...) to make them publicly available.

### Step 5: Verify Publication

1. Check on npmjs.com:
   ```
   https://www.npmjs.com/package/@microting/password-strength
   ```

2. Verify you can install it:
   ```bash
   npm info @microting/password-strength
   ```

### Step 6: Configure OIDC Trusted Publishing

Now that the package exists, configure OIDC for automated releases:

1. Go to the package settings on npmjs.com:
   ```
   https://www.npmjs.com/package/@microting/password-strength/access
   ```

2. Scroll to "Publishing access" or "Trusted publishers"

3. Click "Add trusted publisher"

4. Configure:
   - **Provider**: GitHub Actions
   - **Repository owner**: `microting`
   - **Repository name**: `password-strength`
   - **Workflow file**: `.github/workflows/release.yml`
   - **Environment**: (leave blank)

5. Click "Add" to save

✅ **Done!** All future releases will be automated via GitHub Actions.

## Method 2: Building Locally

If you prefer to build the package locally instead of using the GitHub Actions artifact:

### Step 1: Clone and Build

```bash
# Clone the repository
git clone https://github.com/microting/password-strength.git
cd password-strength

# Install dependencies
npm install --legacy-peer-deps

# Build the library
npm run build:lib

# Navigate to the built package
cd dist/microting/password-strength
```

### Step 2: Verify the Package

```bash
# Check package details
cat package.json | grep -E '"name"|"version"'

# List contents
ls -la
```

### Step 3: Publish

```bash
# Make sure you're logged in
npm login

# Publish the package
npm publish --access public
```

### Step 4: Configure OIDC

Follow Step 6 from Method 1 above.

## Troubleshooting

### "You do not have permission to publish"

**Problem**: Your npm account doesn't have permission to publish under the @microting scope.

**Solution**:
1. Ensure you're a member of the microting organization on npmjs.com
2. Contact the organization owner to grant you publish permissions
3. Verify you're logged in with the correct account: `npm whoami`

### "Package name already exists"

**Problem**: Someone else has already published a package with this name.

**Solution**:
1. Check if it's actually your package: https://www.npmjs.com/package/@microting/password-strength
2. If it's your organization's package, you may already be done! Proceed to configure OIDC.
3. If it belongs to someone else, you'll need to choose a different package name.

### "402 Payment Required"

**Problem**: Private scoped packages require a paid npm account.

**Solution**: The package is configured with `"publishConfig": { "access": "public" }`, but make sure you're using the `--access public` flag when publishing.

### "ENEEDAUTH" - Need to authenticate

**Problem**: Not logged in to npm.

**Solution**:
```bash
npm login
# Enter your credentials when prompted
```

### Two-Factor Authentication Issues

**Problem**: 2FA is required but you're not being prompted for OTP.

**Solution**:
```bash
# Use the --otp flag
npm publish --access public --otp=123456
# Replace 123456 with your current OTP from your authenticator app
```

## Verification Checklist

After publishing, verify:

- [ ] Package appears on npmjs.com: https://www.npmjs.com/package/@microting/password-strength
- [ ] Package name is correct: `@microting/password-strength`
- [ ] Version is correct: `16.0.0`
- [ ] Package is public (not showing "private" badge)
- [ ] Installation works: `npm info @microting/password-strength`
- [ ] OIDC Trusted Publishing is configured for future releases

## Next Steps

Once the manual publish is complete and OIDC is configured:

1. **For future releases**, simply push a version tag:
   ```bash
   # Update version in projects/angular-material-extensions/password-strength/package.json
   git add projects/angular-material-extensions/password-strength/package.json
   git commit -m "chore: bump version to 16.0.1"
   git push
   
   # Create and push tag
   git tag v16.0.1
   git push origin v16.0.1
   ```

2. **GitHub Actions will automatically**:
   - Run all tests
   - Build the package
   - Validate version matches tag
   - Publish to npmjs.com with OIDC authentication
   - Include provenance attestation

## Additional Resources

- [npm: Publishing packages](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [npm: Configuring your npm client with your organization settings](https://docs.npmjs.com/configuring-your-npm-client-with-your-organization-settings)
- [npm: Creating and publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
- [NPM_RELEASE_SETUP.md](./NPM_RELEASE_SETUP.md) - OIDC configuration guide
