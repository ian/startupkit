import { render } from "@react-email/render";
import { ServerClient } from "postmark";
import {
	TeamInviteEmail,
	type TeamInviteEmailProps,
} from "./templates/team-invite";
import { OTPEmail, type OTPEmailProps } from "./templates/verifiy-code";

const client = new ServerClient(process.env.POSTMARK_API_KEY as string);

export async function sendOTPEmail(props: OTPEmailProps) {
	const emailHtml = await render(<OTPEmail {...props} />);
	await client.sendEmail({
		From: "app@local.net",
		To: props.email,
		Subject: "Your verification code",
		HtmlBody: emailHtml,
	});
}

export async function sendTeamInviteEmail(props: TeamInviteEmailProps) {
	const emailHtml = await render(<TeamInviteEmail {...props} />);
	await client.sendEmail({
		From: "app@local.net",
		To: props.email,
		Subject: `You've been invited to join ${props.teamName}`,
		HtmlBody: emailHtml,
	});
}
