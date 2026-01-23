# OIDC Setup Status for @microting/password-strength

## ✅ Current Status

- **Package exists on npm**: YES (version 16.0.0 published on 2026-01-23)
- **OIDC Configured**: NO - This needs to be done!

## 🔧 What Needs To Be Done

To enable automated npm publishing from GitHub Actions, configure OIDC Trusted Publishing:

### Step-by-Step Instructions

1. **Go to the package access page**:
   ```
   https://www.npmjs.com/package/@microting/password-strength/access
   ```

2. **Log in** with the `renesmadsen` account (or another maintainer with admin access)

3. **Find the "Publishing access" section** (or "Trusted publishers")
   - This may also be called "Automation tokens" or "Publishing providers"

4. **Click "Add trusted publisher"** (or similar button)

5. **Select "GitHub Actions"** as the authentication provider

6. **Enter the following configuration**:
   - **Repository owner**: `microting`
   - **Repository name**: `password-strength`
   - **Workflow filename**: `.github/workflows/release.yml`
   - **Environment name**: Leave blank (or omit)

7. **Save** the configuration

8. **Test it** by pushing a new version tag:
   ```bash
   git tag v20.0.0
   git push origin v20.0.0
   ```

## 📚 Documentation

- Detailed setup guide: [NPM_RELEASE_SETUP.md](./NPM_RELEASE_SETUP.md)
- Manual publishing guide: [MANUAL_PUBLISH_GUIDE.md](./MANUAL_PUBLISH_GUIDE.md)

## ❓ Why OIDC?

OIDC (OpenID Connect) Trusted Publishing is the modern, secure way to publish npm packages:
- ✅ No long-lived tokens to manage
- ✅ Automatic provenance attestation for supply chain security
- ✅ Simpler and more auditable

## 🐛 Current Error

Without OIDC configuration, the workflow fails with:
```
npm error 404 Not Found - PUT https://registry.npmjs.org/@microting%2fpassword-strength - Not found
npm error code E404
```

This is misleading - the package DOES exist, but npm rejects the OIDC authentication because the trusted publisher isn't configured yet.

## ✨ After Configuration

Once OIDC is set up, releasing new versions is simple:

1. Update version in `projects/angular-material-extensions/password-strength/package.json`
2. Commit and push the change
3. Create and push a tag: `git tag v20.0.1 && git push origin v20.0.1`
4. GitHub Actions automatically builds, tests, and publishes! 🎉
