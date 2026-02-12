# Coinbase Marketplace

A demo showcasing Coinbase Payments APIs — enabling easy checkout for both crypto and non-crypto users.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration values.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Public Tunnel with ngrok

To share your local development server externally (for testing on mobile devices, sharing with teammates, etc.), you can use ngrok.

### Prerequisites

Install ngrok if you haven't already:

```bash
# macOS with Homebrew
brew install ngrok

# Or download from https://ngrok.com/download
```

### Running the tunnel

1. First, start the development server in one terminal:

```bash
npm run dev
```

2. In a separate terminal, start the ngrok tunnel:

```bash
npm run dev:tunnel
```

ngrok will provide a public URL (e.g., `https://abc123.ngrok.io`) that forwards to your local server.

### Secure tunnel with basic authentication (recommended)

For added security, use basic authentication to protect access:

```bash
ngrok http 3000 --basic-auth="username:password"
```

Replace `username:password` with your own credentials. Only users with these credentials can access your tunnel.

### Security considerations

- **Use tunnels only for development/testing** — not for production
- **Don't share the URL publicly** — only with trusted collaborators
- **Close ngrok when not in use** — the tunnel stays open until you stop it
- **Never expose sensitive variables** — only use `NEXT_PUBLIC_` prefix for truly public data

## Environment Variables

| Variable | Type | Description |
|----------|------|-------------|
| `NEXT_PUBLIC_BASE_APP_URL` | Public | Base App download URL |
| `NEXT_PUBLIC_BASE_APP_IOS_URL` | Public | iOS App Store URL |
| `NEXT_PUBLIC_BASE_APP_ANDROID_URL` | Public | Google Play Store URL |
| `NEXT_PUBLIC_MARKETPLACE_URL` | Public | Marketplace redirect URL |

**Note:** Variables with `NEXT_PUBLIC_` prefix are exposed to the browser. Never put API keys or secrets in these variables.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### 🆓 Free Deployment Option: Using Vercel CLI (No GitHub Integration Required)

**Important:** If you're deploying from a private GitHub organization, Vercel requires a Pro plan for GitHub integration. However, you can deploy **completely free** using Vercel CLI without connecting GitHub!

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate with your Vercel account (works with free Hobby plan).

#### Step 3: Link Your Project (First Time Only)

```bash
# Run this in your project root directory
vercel link
```

You'll be prompted to:
- Select or create a Vercel project
- Choose your team (use your personal account, not the organization)
- Confirm project settings

This creates a `.vercel` folder with your project configuration.

#### Step 4: Deploy

```bash
# Deploy as preview (staging)
npm run deploy:preview

# Or deploy to production
npm run deploy:production
```

**Benefits of CLI deployment:**
- ✅ Works with free Hobby plan
- ✅ No GitHub integration needed
- ✅ Works with private repositories
- ✅ Full control over deployments
- ✅ Can deploy any branch manually

**Note:** With CLI deployment, you won't get automatic deployments on git push. You'll need to run the deploy command manually or set up GitHub Actions (see below).

#### Alternative Free Options

**Option A: Make Repository Public (if acceptable)**
- Public repositories can use GitHub integration with free Hobby plan
- Go to GitHub repository → Settings → Change visibility to Public

**Option B: Use 14-Day Pro Trial**
- Click "Start Pro Trial" in Vercel dashboard
- Get 14 days free to test Pro features
- After trial, you can switch back to CLI deployment

**Option C: Connect Personal GitHub Account (instead of organization)**
- Fork the repository to your personal GitHub account
- Connect Vercel to your personal fork
- Free Hobby plan works with personal repositories

### Automated Deployment with GitHub Actions

This project includes a GitHub Actions workflow that automatically deploys the `cleanup/prepare-for-deployment` branch to Vercel on every push.

#### Step 1: Get Vercel Credentials

1. **Get your Vercel Token:**
   - Go to [Vercel Account Tokens](https://vercel.com/account/tokens)
   - Click "Create" and give it a name (e.g., "GitHub Actions")
   - Copy the token

2. **Get your Org ID and Project ID:**

   ```bash
   # Install Vercel CLI globally
   npm install -g vercel

   # Link your project (run in project root)
   vercel link
   ```

   After linking, the IDs will be in `.vercel/project.json`:

   ```json
   {
     "orgId": "your-org-id",
     "projectId": "your-project-id"
   }
   ```

#### Step 2: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

| Secret Name | Description |
|-------------|-------------|
| `VERCEL_TOKEN` | Your Vercel API token |
| `VERCEL_ORG_ID` | Your organization/account ID |
| `VERCEL_PROJECT_ID` | Your project ID |

#### Step 3: Push to Deploy

Once configured, any push to the `cleanup/prepare-for-deployment` branch will automatically trigger a preview deployment. The deployment URL will be:
- Posted as a comment on the commit
- Available in the GitHub Actions summary
- Visible in your Vercel dashboard

### Manual Deployment with npm Scripts

For manual deployments, use the following npm scripts (requires Vercel CLI):

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy as preview (staging)
npm run deploy:preview

# Deploy to production
npm run deploy:production
```

### Configuring Specific Branches (Manual)

You can also deploy specific branches manually from the Vercel dashboard:

#### Option 1: Preview Deployment
1. Go to your Vercel project dashboard
2. Click **"Deployments"** → **"Add New..."**
3. Select the branch you want to deploy
4. Vercel will create a preview deployment with a unique URL

#### Option 2: Set as Production Branch
1. Go to **Settings** → **Git**
2. Under **"Production Branch"**, select your desired branch
3. This branch will be used for production deployments

**Note:** Make sure your environment variables are configured in Vercel's dashboard for each environment (Production, Preview, Development).

### Troubleshooting: Branch Not Appearing in Vercel

If your branch doesn't appear in Vercel's branch selector, try these steps:

#### Step 1: Verify Branch is Pushed to GitHub
```bash
# Check if your branch exists on remote
git branch -r

# If not, push it
git push origin <branch-name>
```

#### Step 2: Refresh Repository Connection
1. Go to **Settings** → **Git** in your Vercel project
2. Click **"Disconnect"** (if available) or **"Reconnect"**
3. Re-authorize GitHub access if prompted
4. Wait a few seconds for branches to sync

#### Step 3: Check Git Integration Settings
1. Go to **Settings** → **Git**
2. Verify the repository is correctly connected: `wakeuplabs-io/coinbase-marketplace`
3. Check if there are any branch filters or restrictions enabled
4. Ensure **"Automatically deploy every push"** is enabled if you want automatic deployments

#### Step 4: Manual Deployment via CLI
If the branch still doesn't appear, deploy manually using Vercel CLI:

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Deploy specific branch
vercel --prod --branch <branch-name>
```

#### Step 5: Check GitHub Permissions
1. Go to [GitHub Settings → Applications → Authorized OAuth Apps](https://github.com/settings/applications)
2. Find **Vercel** in the list
3. Click **"Configure"** and ensure it has access to your repository
4. Grant necessary permissions (read repository, read/write deployments)

#### Common Issues:
- **Branch is too new**: Wait 1-2 minutes after pushing, then refresh Vercel dashboard
- **Repository not fully connected**: Disconnect and reconnect the repository
- **GitHub permissions**: Vercel needs read access to your repository to see branches
- **Branch name with special characters**: Some branch names may not appear; try renaming the branch
