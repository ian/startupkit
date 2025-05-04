import { Resend } from "resend";
import { render } from "@react-email/render";
import VerifyCodeEmail from "./templates/verifiy-code";
import TeamInviteEmail from "./templates/team-invite";

const templates = {
	TeamInvite: TeamInviteEmail,
	VerifyCode: VerifyCodeEmail,
}

export async function sendEmail<T extends keyof typeof templates>(
	template: T,
	from: string,
	to: string,
	subject: string,
	props: Parameters<typeof templates[T]>[0]
) {
	const resend = new Resend(process.env.RESEND_API_KEY);
	const Template = templates[template] as React.ComponentType<typeof props>;
	const html = await render(<Template {...props} />);

	const { data, error } = await resend.emails.send({
		from,
		to,
		subject,
		html
	});

	return {
		data,
		error
	}
}