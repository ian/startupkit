import { prisma } from "@repo/db";
import { sendEmail } from "@repo/emails";
import { createAuth } from "@startupkit/auth";

async function sendVerificationOTP({
	email,
	otp
}: { email: string; otp: string }) {
	console.log("Sending email to", { email, otp })

	await sendEmail({
		template: "VerifyCode",
		from: "hello@startupkit.com",
		to: email,
		subject: "Verify your email",
		props: {
			email,
			otpCode: otp,
			expiryTime: "10 minutes"
		}
	})
}

export const auth = createAuth({
	prisma,
	sendEmail: sendVerificationOTP
})
