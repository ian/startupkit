import { db, users } from "@repo/db";
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
	db,
	users,
	sendEmail: sendVerificationOTP,
	additionalUserFields: {
		// Add custom fields here if needed, e.g.:
		// companyName: {
		// 	type: "string",
		// 	required: false
		// },
		// timezone: {
		// 	type: "string",
		// 	required: false
		// }
	}
})
