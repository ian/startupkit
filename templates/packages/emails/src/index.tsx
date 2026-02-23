import { render } from '@react-email/render';
import { Resend } from 'resend';
import { previewEmailInBrowser } from './lib/preview-email';
import TeamInviteEmail from './templates/team-invite';
import VerifyCodeEmail from './templates/verify-code';

const templates = {
  TeamInvite: TeamInviteEmail,
  VerifyCode: VerifyCodeEmail,
} as const;

export async function sendEmail<T extends keyof typeof templates>({
  template,
  from,
  to,
  subject,
  props,
}: {
  template: T;
  from: string;
  to: string;
  subject: string;
  props: Parameters<(typeof templates)[T]>[0];
}) {
  const Template = templates[template] as React.ComponentType<typeof props>;
  const html = await render(<Template {...props} />);

  if (
    process.env.NODE_ENV === 'development' &&
    process.env.RESEND_ENABLED !== 'true'
  ) {
    await previewEmailInBrowser({
      from,
      to,
      subject,
      html,
    });
    return { data: null, error: null };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  return {
    data,
    error,
  };
}
