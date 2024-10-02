# Security Checker Chrome Extension

## Overview

Security Checker is a Chrome extension that helps you determine the security status of websites. It checks for SSL certificate integrity, as well as security headers like Content-Security-Policy (CSP) and Strict-Transport-Security (HSTS).

## Features

- Check if a website uses HTTPS.
- Verify SSL certificates using SSL Labs API.
- Check for the presence of critical security headers (CSP and HSTS).

## Installation

To install this extension locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/security-checker-extension.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the project folder.
5. The extension will be loaded and visible in your toolbar.

## Usage

- Click the extension icon in your browser toolbar to check the security status of the active tab.
- The extension will display whether the site is secure or insecure based on SSL certificates and security headers.

## Development

To contribute to the extension, fork the repository, make your changes, and submit a pull request.

### Running the Extension

To see changes in the extension during development:

1. Make your changes in the codebase.
2. Reload the extension in `chrome://extensions/`.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
