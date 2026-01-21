# Email Templates for Career Na Mimi Hub

Custom branded email templates for Supabase Auth emails.

## Templates Included

1. **confirmation.html** - Email confirmation for new signups
2. **recovery.html** - Password reset emails
3. **magic_link.html** - Magic link authentication emails

## How to Apply These Templates in Supabase

### Option 1: Via Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project: `pmcxanorldofcazuwefw`

2. **Navigate to Authentication Settings**
   - Click on "Authentication" in the left sidebar
   - Click on "Email Templates" tab

3. **Update Each Template**

   **For Email Confirmation:**
   - Select "Confirm signup" template
   - Copy the contents of `confirmation.html`
   - Paste into the HTML editor
   - Click "Save"

   **For Password Recovery:**
   - Select "Reset password" template
   - Copy the contents of `recovery.html`
   - Paste into the HTML editor
   - Click "Save"

   **For Magic Link:**
   - Select "Magic Link" template
   - Copy the contents of `magic_link.html`
   - Paste into the HTML editor
   - Click "Save"

### Option 2: Via Supabase CLI

If you have Supabase CLI installed:

```bash
# Update confirmation email
supabase functions deploy --project-ref pmcxanorldofcazuwefw

# Or use the API
curl -X PUT 'https://api.supabase.com/v1/projects/pmcxanorldofcazuwefw/config/auth/email-templates/confirm' \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d @confirmation.html
```

## Template Variables

These templates use Supabase's built-in template variables:

- `{{ .ConfirmationURL }}` - The confirmation/action URL
- `{{ .Token }}` - The auth token (if needed)
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your site URL from Supabase settings

## Customization

### Update URLs
Make sure to update these URLs in the templates to match your actual domains:

- Website: `https://careernamimi.org`
- Support email: `support@careernamimi.org`
- Social media links

### Brand Colors
Current brand colors used:
- Primary Pink: `#FB067F`
- Primary Green: `#006708`
- Gradient: `linear-gradient(135deg, #FB067F 0%, #006708 100%)`

### Logo
The templates use a text-based logo (🎯 Career Na Mimi Hub). To use an image logo:

1. Upload your logo to your public assets
2. Replace the text logo in the header with:
```html
<img src="YOUR_LOGO_URL" alt="Career Na Mimi Hub" style="max-width: 200px; height: auto;">
```

## Testing

After applying templates, test them by:

1. Creating a new user account
2. Requesting a password reset
3. Requesting a magic link login

Check that:
- ✅ Branding matches Career Na Mimi Hub
- ✅ Links work correctly
- ✅ Images load (if using image logo)
- ✅ Responsive design works on mobile
- ✅ No Supabase branding or "powered by Supabase" text

## Troubleshooting

**Problem:** Templates not updating
- Clear your browser cache
- Wait a few minutes for changes to propagate
- Check if you saved the changes

**Problem:** Links not working
- Verify your Site URL in Authentication > Settings
- Check that redirect URLs are configured correctly

**Problem:** Emails going to spam
- Configure SPF, DKIM, and DMARC records
- Consider using a custom domain for emails
- Use Supabase's recommended email settings

## Support

For issues with:
- Email templates: Check Supabase Auth documentation
- Platform features: Contact support@careernamimi.org
- Branding updates: Edit the HTML files in this directory

## Future Enhancements

Consider adding these templates:
- Welcome email after onboarding completion
- Weekly digest emails
- Mentor connection notifications
- Achievement/badge unlock emails
- Newsletter templates
