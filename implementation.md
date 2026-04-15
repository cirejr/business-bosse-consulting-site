# Implementation Plan: Adding Social Links to Company Section

## 1. Technical Approach

Based on the project structure using Next.js 16 + Tailwind CSS with shadcn/ui and Lucide React icons, the implementation will follow these principles:

- **Component Location**: Add social links to the `Footer.tsx` component in the company section (Business & Bosse Consulting SARL section)
- **Icon Library**: Use Lucide React icons (already configured in the project)
- **Styling**: Use existing Tailwind CSS utility classes consistent with the design system
- **Link Behavior**: Open in new tab with `rel="noopener noreferrer"` for security
- **Accessibility**: Include proper `aria-label` attributes for screen readers

## 2. File Modifications

### Primary File: `components/Footer.tsx`

**Location**: Lines 43-61 (social links section)

**Current Implementation** (lines 43-57):
```jsx
<div className="flex space-x-4">
  <Link 
    href="https://www.facebook.com/share/1B6DdxE7qX/" 
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 border border-white/10 hover:border-accent hover:text-accent transition-colors"
    aria-label="Facebook"
  >
    <Facebook className="h-5 w-5" />
  </Link>
  <Link href="#" className="p-2 border border-white/10 hover:border-accent hover:text-accent transition-colors">
    <Share className="h-5 w-5" />
  </Link>
  <Link href="#" className="p-2 border border-white/10 hover:border-accent hover:text-accent transition-colors">
    <Mail className="h-5 w-5" />
  </Link>
</div>
```

**Modified Implementation**:
```jsx
<div className="flex space-x-4">
  <Link 
    href="https://www.facebook.com/share/1B6DdxE7qX/" 
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 border border-white/10 hover:border-accent hover:text-accent transition-colors"
    aria-label="Facebook"
  >
    <Share className="h-5 w-5" />
  </Link>
  <Link 
    href="https://www.linkedin.com/company/business-and-bosse-consulting-sarl/" 
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 border border-white/10 hover:border-accent hover:text-accent transition-colors"
    aria-label="LinkedIn"
  >
    <Share className="h-5 w-5" />
  </Link>
  <Link 
    href="https://www.instagram.com/b.and.bc/" 
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 border border-white/10 hover:border-accent hover:text-accent transition-colors"
    aria-label="Instagram"
  >
    <Share className="h-5 w-5" />
  </Link>
  <Link href="#" className="p-2 border border-white/10 hover:border-accent hover:text-accent transition-colors">
    <Mail className="h-5 w-5" />
  </Link>
</div>
```

**Note**: The current implementation uses `Share` icon for all social links. For better UX, consider using specific icons:
- LinkedIn: Use a LinkedIn-specific icon if available, otherwise `Share` is acceptable
- Instagram: Use an Instagram-specific icon if available, otherwise `Share` is acceptable

## 3. Best Practices

### Accessibility
- Add `aria-label` to each link describing the platform
- Use `target="_blank"` with `rel="noopener noreferrer"` to prevent security vulnerabilities
- Ensure sufficient color contrast (already handled by Tailwind classes)

### Link Behavior
- All social links should open in new tabs to prevent losing the current page
- Use proper `rel` attribute for security when opening external links
- Consider adding `nofollow` attribute if SEO is a concern

### Design System Compliance
- Use existing border and hover styles: `border border-white/10 hover:border-accent hover:text-accent transition-colors`
- Maintain consistent padding: `p-2`
- Use transition for smooth hover effects: `transition-colors`
- Follow the existing flex layout pattern: `flex space-x-4`

### Icon Usage
- Use Lucide React icons as per project configuration
- Maintain consistent icon sizes: `h-5 w-5`
- Current implementation uses generic `Share` icon; consider platform-specific icons if available

## 4. Verification Steps

### Functional Verification
1. **Visual Inspection**: Verify links appear in the footer company section
2. **Click Testing**: 
   - Click LinkedIn link → should open `https://www.linkedin.com/company/business-and-bosse-consulting-sarl/` in new tab
   - Click Instagram link → should open `https://www.instagram.com/b.and.bc/` in new tab
   - Verify current page remains unchanged (new tab behavior)
3. **Accessibility Testing**:
   - Check that `aria-label` attributes are present
   - Verify links are keyboard navigable (Tab → Enter)
   - Test with screen reader if available

### Code Verification
1. **TypeScript Compilation**: Ensure no type errors
   ```bash
   npm run typecheck
   ```
2. **Linting**: Check for code style issues
   ```bash
   npm run lint
   ```
3. **Build**: Verify the project builds successfully
   ```bash
   npm run build
   ```

### Responsive Testing
1. Test on desktop view → links should be horizontally aligned
2. Test on mobile view → links should remain accessible and properly spaced
3. Verify hover states work correctly on supported devices

### Cross-Browser Testing
- Test in Chrome, Firefox, and Safari
- Verify new tab behavior is consistent
- Check link styling is consistent across browsers

## 5. Design System Considerations

### Current Design System Settings
- **Border radius**: 0rem (sharp edges as per project guidelines)
- **Primary color**: Deep Navy/Charcoal (`oklch(0.2 0.04 260)`)
- **Accent color**: Muted Gold (`oklch(0.75 0.08 85)`)
- **Typography**: Manrope (sans), Playfair Display (serif)

### Social Links Section Styling
The social links section currently uses:
- Flex container with `flex space-x-4`
- Individual link styling: `p-2 border border-white/10 hover:border-accent hover:text-accent transition-colors`
- Icon sizing: `h-5 w-5`

### Enhancement Recommendations (Optional)
Consider using platform-specific icons if available:
- LinkedIn: Look for `Linkedin` icon in Lucide
- Instagram: Look for `Instagram` icon in Lucide
- If not available, the generic `Share` icon is acceptable per current implementation
