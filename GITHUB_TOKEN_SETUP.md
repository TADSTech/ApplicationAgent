# GitHub Token Setup Guide

## How to Get a GitHub Token

### Step 1: Go to GitHub Settings
1. Log in to your GitHub account
2. Click on your profile picture in the top-right corner
3. Select "Settings" from the dropdown menu

### Step 2: Generate Personal Access Token
1. In the left sidebar, click on "Developer settings"
2. Click on "Personal access tokens" → "Tokens (classic)"
3. Click "Generate new token" → "Generate new token (classic)"

### Step 3: Configure Token Permissions
For the JobJockey application, you need the following permissions:
- **public_repo** - Access public repositories (required for portfolio showcase)
- **read:org** - Read org and team membership (optional, for organization repos)
- **read:user** - Read user profile data (optional)

### Step 4: Generate and Copy Token
1. Give your token a descriptive name (e.g., "JobJockey Backend")
2. Set an expiration date (recommended: 90 days or less for security)
3. Select the permissions mentioned above
4. Click "Generate token"
5. **Important:** Copy the token immediately - you won't be able to see it again!

### Step 5: Add Token to Environment Variables
Add the token to your `backend/.env` file:
```
GITHUB_TOKEN=ghp_your_actual_token_here
```

## Testing GitHub Token Without Frontend

### Using PowerShell (Windows)
```powershell
# Test GitHub endpoint
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/portfolio/github" -Method Post -ContentType "application/json" -Body '{"github_username": "your-github-username"}'
```

### Using curl (Windows PowerShell)
```powershell
curl -X POST http://127.0.0.1:8000/api/v1/portfolio/github -H "Content-Type: application/json" -d '{"github_username": "your-github-username"}'
```

### Expected Response (Success)
```json
{
  "github_username": "your-username",
  "repos": [
    {
      "name": "repo-name",
      "description": "Repository description",
      "language": "Python",
      "stars": 42,
      "forks": 10,
      "url": "https://github.com/your-username/repo-name",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "status": "success",
  "total_count": 15
}
```

### Expected Response (No Token Configured)
```json
{
  "github_username": "your-username",
  "repos": [],
  "status": "failed",
  "message": "GitHub token not configured or API call failed"
}
```

## Security Notes

### Best Practices
- Never commit your GitHub token to version control
- Use environment variables or secret management services
- Rotate tokens regularly (every 90 days recommended)
- Use the minimum required permissions
- Revoke tokens when no longer needed

### Token Scopes Explained
- **public_repo**: Full control of public repositories (read/write)
- **repo**: Full control of private and public repositories (if you need private repo access)
- **read:org**: Read org and team membership, read org projects
- **read:user**: Read user profile data

## Troubleshooting

### Token Not Working
1. Verify the token is correctly copied (no extra spaces)
2. Check that the token hasn't expired
3. Ensure the token has the required permissions
4. Verify the token is added to the correct `.env` file

### Rate Limits
- GitHub API has rate limits: 5,000 requests per hour for authenticated requests
- Unauthenticated requests: 60 requests per hour
- Using a token significantly increases your rate limit

### Common Errors
- **401 Unauthorized**: Token is invalid or expired
- **403 Forbidden**: Token lacks required permissions
- **404 Not Found**: User doesn't exist or token can't access the resource
