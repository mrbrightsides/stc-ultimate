# Contributing to STC Ultimate

Thank you for your interest in contributing to STC Ultimate! This document provides guidelines for contributing to the project.

---

## 🤝 How to Contribute

### Ways to Contribute

1. **Report Bugs** - Found a bug? Let us know!
2. **Suggest Features** - Have ideas for improvements?
3. **Fix Issues** - Pick an open issue and submit a PR
4. **Improve Documentation** - Help make our docs better
5. **Write Tests** - Increase test coverage
6. **Code Review** - Review open pull requests

---

## 🐛 Reporting Bugs

### Before Submitting a Bug Report

1. **Check existing issues** - Your bug might already be reported
2. **Update to latest** - Make sure you're using the latest version
3. **Reproduce the bug** - Confirm it's reproducible
4. **Check console** - Look for error messages in browser DevTools

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - Browser: [e.g. Chrome 120]
 - OS: [e.g. Windows 11]
 - Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information.
```

---

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature.

**Problem it Solves**
What problem does this feature address?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
What other solutions did you consider?

**Additional Context**
Screenshots, mockups, or examples.
```

---

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Git
- MetaMask browser extension

### Setup Steps

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/stc-ultimate.git
cd stc-ultimate

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## 📝 Code Guidelines

### TypeScript Standards

1. **Strict Type Checking**
   ```typescript
   // ✅ GOOD - Explicit types
   const calculateTotal = (price: string, days: number): string => {
     return (parseFloat(price) * days).toString();
   };

   // ❌ BAD - Implicit any
   const calculateTotal = (price, days) => {
     return (price * days).toString();
   };
   ```

2. **Interfaces for Complex Types**
   ```typescript
   // ✅ GOOD - Clear interface
   interface Booking {
     id: string;
     destination: string;
     totalAmount: string;
   }

   // ❌ BAD - Inline types
   const booking: { id: string; destination: string } = {...};
   ```

3. **No Implicit Any**
   ```typescript
   // ✅ GOOD - Proper typing
   const getValue = <T extends Record<string, unknown>>(
     obj: T, 
     key: keyof T
   ) => obj[key];

   // ❌ BAD - Implicit any
   const getValue = (obj: any, key: string) => obj[key];
   ```

### React Best Practices

1. **Client Components**
   ```typescript
   // ✅ GOOD - Explicit 'use client'
   'use client'
   
   import { useState } from 'react';
   
   export default function Component() { ... }
   ```

2. **Component Structure**
   ```typescript
   // ✅ GOOD - Clear structure
   interface Props {
     title: string;
     onClose: () => void;
   }
   
   export default function Modal({ title, onClose }: Props) {
     return <div>...</div>;
   }
   ```

3. **State Management**
   ```typescript
   // ✅ GOOD - Typed state
   const [count, setCount] = useState<number>(0);
   
   // ❌ BAD - Untyped state
   const [count, setCount] = useState(0);
   ```

### Styling Guidelines

1. **Tailwind CSS**
   - Use existing design system colors
   - Follow mobile-first approach
   - Use semantic class names

   ```tsx
   // ✅ GOOD
   <div className="bg-cyan-500 hover:bg-cyan-600 transition-colors">
   
   // ❌ BAD
   <div style={{ backgroundColor: '#00ffff' }}>
   ```

2. **Responsive Design**
   ```tsx
   // ✅ GOOD - Mobile first
   <div className="w-full md:w-1/2 lg:w-1/3">
   
   // ❌ BAD - Desktop first
   <div className="w-1/3 sm:w-full">
   ```

### Naming Conventions

1. **Files**
   - Components: `kebab-case.tsx` (e.g., `package-builder.tsx`)
   - Utils: `kebab-case.ts` (e.g., `destinations-config.ts`)
   - Types: `types.ts` or in component file

2. **Variables**
   - camelCase for variables: `totalAmount`, `userAddress`
   - PascalCase for components: `PackageBuilder`, `IoTEngine`
   - SCREAMING_SNAKE_CASE for constants: `GAS_PRICE`, `MAX_RETRIES`

3. **Functions**
   - Descriptive verbs: `calculateTotal()`, `releaseMilestone()`
   - Event handlers: `handleClick()`, `onSubmit()`

---

## 🧪 Testing Requirements

### Before Submitting PR

1. **Run Build**
   ```bash
   npm run build
   ```

2. **Check TypeScript**
   ```bash
   npx tsc --noEmit
   ```

3. **Test Locally**
   - [ ] Feature works as expected
   - [ ] No console errors
   - [ ] Responsive on mobile
   - [ ] Works in Chrome, Firefox, Safari

### Writing Tests (Future)

```typescript
// Example test structure
describe('MilestoneEscrow', () => {
  it('should initialize escrow with correct amount', () => {
    // Test implementation
  });
  
  it('should release payment on milestone completion', () => {
    // Test implementation
  });
});
```

---

## 📤 Submitting Pull Requests

### PR Process

1. **Fork the Repository**
   ```bash
   # Fork via GitHub UI
   # Clone your fork
   git clone https://github.com/YOUR_USERNAME/stc-ultimate.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Changes**
   - Follow code guidelines
   - Add comments for complex logic
   - Update documentation if needed

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   **Commit Message Format:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

5. **Push to Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open Pull Request**
   - Go to original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out PR template

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?
- [ ] Local testing
- [ ] Build passes
- [ ] No console errors

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings

## Screenshots (if applicable)
Add screenshots to demonstrate changes.
```

---

## 📚 Documentation Guidelines

### Code Comments

```typescript
// ✅ GOOD - Explains WHY
// Use checksum format to prevent address validation errors
const address = ethers.utils.getAddress(vendorAddress);

// ❌ BAD - Explains WHAT (obvious from code)
// Get the address
const address = ethers.utils.getAddress(vendorAddress);
```

### JSDoc for Public APIs

```typescript
/**
 * Releases payment for a completed milestone
 * @param bookingId - Unique booking identifier
 * @param milestoneIndex - Index of milestone (0-14)
 * @param iotProofHash - IPFS hash of IoT verification proof
 * @returns Promise resolving to transaction result
 * @throws Error if milestone already completed or invalid index
 */
export async function releaseMilestonePayment(
  bookingId: string,
  milestoneIndex: number,
  iotProofHash: string
): Promise<TransactionResult> {
  // Implementation
}
```

---

## 🎨 Design Guidelines

### UI/UX Principles

1. **Mobile-First** - Design for mobile, enhance for desktop
2. **Accessibility** - WCAG 2.1 AA compliance
3. **Performance** - Fast loading, smooth animations
4. **Consistency** - Use existing design patterns

### Color Palette

```css
/* Primary */
--cyan: #06b6d4
--purple: #a855f7

/* Status */
--success: #10b981
--warning: #f59e0b
--error: #ef4444

/* Neutral */
--gray-50: #f9fafb
--gray-900: #111827
```

---

## 🔍 Code Review Process

### For Reviewers

1. **Check Functionality** - Does it work as described?
2. **Review Code Quality** - Follows guidelines?
3. **Test Locally** - Run and test changes
4. **Provide Feedback** - Constructive comments
5. **Approve or Request Changes**

### Review Checklist

- [ ] Code follows TypeScript strict mode
- [ ] No console.log() statements (use proper logging)
- [ ] Error handling implemented
- [ ] Responsive design works
- [ ] No accessibility issues
- [ ] Performance impact considered
- [ ] Documentation updated

---

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

---

## 📞 Getting Help

- **GitHub Discussions** - Ask questions, share ideas
- **GitHub Issues** - Report bugs, request features
- **Documentation** - Check /docs folder

---

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:
- Age, body size, disability
- Ethnicity, gender identity
- Experience level
- Nationality, race, religion
- Sexual identity and orientation

### Our Standards

**Positive Behavior:**
- Using welcoming language
- Respecting differing viewpoints
- Accepting constructive criticism
- Focusing on what's best for community
- Showing empathy

**Unacceptable Behavior:**
- Harassment, trolling, insults
- Public or private harassment
- Publishing private information
- Unprofessional conduct

### Enforcement

Report violations to project maintainers. All complaints reviewed and investigated promptly and fairly.

---

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to STC Ultimate!** 🚀

Together, we're building the future of digital tourism.
