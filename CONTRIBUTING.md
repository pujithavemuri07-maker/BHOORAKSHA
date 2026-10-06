# Contributing to Bhooraksha (भूरक्षा)

Thank you for your interest in contributing to the **Bhooraksha** platform! Bhooraksha is an enterprise-grade, AI-powered land record verification system adhering to strict role-based access control and high availability standards.

## Code of Conduct
We are committed to providing a welcoming and harassment-free environment. All contributors are expected to uphold integrity, transparency, and professional respect.

## Development Workflow
1. **Branching Strategy**:
   - `main`: Production-ready code.
   - `develop`: Integration branch.
   - `feature/<name>`: Feature branches.
   - `hotfix/<name>`: Urgent patches.

2. **Commit Guidelines**:
   Use Conventional Commits format:
   - `feat(auth): add OTP resend rate limiting`
   - `fix(gis): resolve cadastral boundary intersection bug`
   - `docs: update API documentation`

3. **Pre-commit Hooks**:
   Run pre-commit checks before pushing:
   ```bash
   pre-commit run --all-files
   ```

4. **Testing Requirements**:
   - Every backend API endpoint must have accompanying unit tests.
   - Micro-frontends must pass TypeScript type checks.
   - Automated CI runs linting, testing, and Docker build checks.
