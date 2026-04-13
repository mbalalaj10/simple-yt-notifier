# Contributing to Simple YT Notifier
Thank you for your interest in improving the Simple YT Notifier project!
We welcome contributions from the community to help make sure this tool is more robust and feature-rich.

## Getting Started
Before you start making any changes, please ensure you have a clear understanding of this project's [background and purpose](README.md).

## Reporting issues and Requesting Features
If you find a bug or have an idea for a new feature, the best way to start is by opening an issue.

### How to Open an Issue
1. Navigate to the **[Issues Tab](https://github.com/mbalalaj10/simple-yt-notifier/issues)**.
2. Click **"New Issue."**
3. **Categorize your issue** using the available labels:
    * `bug`: Something isn't working as expected.
    * `enhancement`: New feature requests or improvements.
    * `documentation`: Corrections or additions to the README and guides.
    * `security`: *Note: Please use the [Security Policy](SECURITY.md) for vulnerability reports instead of public issues.*

Please provide as much detail as possible, including your environment (Docker version, Node version) and steps to reproduce the behavior.

## Development Workflow
We follow a standard GitHub Flow for all contributions:
1. **Fork** the repository and create your branch from `main`.
2. **Implement** your changes and ensure your code follows existing patterns.
3. **Open a Pull Request (PR)** with a clear description of the changes.
4. **Pass Status Checks:** Your PR must pass all automated scans and checks before it can be merged.

## Contribution Requirements & Coding Standards
To maintain project quality and security, all contributions must meet the following requirements:

1. **Code Quality:** We utilize [ESLint](https://eslint.org/) for JavaScript linting. Please ensure your code follows standard Node.js best practices and contains no linting errors.
2. **Security Standards:** All Pull Requests must pass the automated [GitHub CodeQL](https://codeql.github.com/) analysis and the general build checker. 
3. **Least Privilege:** New features must adhere to the principle of least privilege, especially regarding GitHub Action token permissions.
4. **No Hardcoded Secrets:** Ensure no API keys, webhooks, or secrets are included in your commits. Use environment variables for all sensitive data.

## Code of Conduct
By participating in this project, you agree to maintain a respectful and collaborative environment for all contributors.