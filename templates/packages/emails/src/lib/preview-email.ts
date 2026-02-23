import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import open from 'open';

export async function previewEmailInBrowser(email: {
    from: string;
    to: string;
    subject: string;
    html: string;
}) {
    const timestamp = Date.now();
    const tempDir = join(tmpdir(), 'email-previews');
    await mkdir(tempDir, { recursive: true });

    const filename = `email-${timestamp}.html`;
    const filepath = join(tempDir, filename);

    const htmlWithMetadata = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${email.subject}</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
    .email-meta { 
      background: #f5f5f5; 
      border-bottom: 2px solid #e0e0e0;
      padding: 20px; 
      font-size: 14px;
    }
    .email-meta div { margin: 5px 0; }
    .email-meta strong { display: inline-block; width: 80px; }
    .email-content { padding: 20px; }
  </style>
</head>
<body>
  <div class="email-meta">
    <div><strong>From:</strong> ${email.from}</div>
    <div><strong>To:</strong> ${email.to}</div>
    <div><strong>Subject:</strong> ${email.subject}</div>
  </div>
  <div class="email-content">
    ${email.html}
  </div>
</body>
</html>`;

    await writeFile(filepath, htmlWithMetadata);

    try {
        await open(filepath, { wait: false });
        console.log(`📧 Email preview opened in browser: ${filepath}`);
    } catch (error) {
        console.error('Failed to open email preview:', error);
        console.log(`📧 Email saved to: ${filepath}`);
        console.log('Please open it manually in your browser.');
    }
}

