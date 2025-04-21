import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

export interface OTPEmailProps {
	email: string;
	otpCode: string;
	expiryTime: string;
}

export const OTPEmail = ({ otpCode, expiryTime }: OTPEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>Your verification code: {otpCode}</Preview>
			<Tailwind>
				<Body className="bg-[#f5f5f7] py-[40px] font-sans">
					<Container className="mx-auto my-[40px] w-full max-w-[500px] rounded-[16px] bg-white p-[32px]">
						<Section>
							<Heading className="mx-0 my-[24px] p-0 text-[24px] font-bold text-black">
								Verification Code
							</Heading>

							<Text className="mx-0 my-[16px] p-0 text-[16px] leading-[24px] text-[#333333]">
								Hello,
							</Text>

							<Text className="mx-0 my-[16px] p-0 text-[16px] leading-[24px] text-[#333333]">
								Please use the verification code below to complete your
								authentication:
							</Text>

							<Section className="my-[32px] text-center">
								<Text className="mx-0 my-0 p-[16px] text-[32px] font-bold tracking-[4px] text-black bg-[#f5f5f7] rounded-[8px] inline-block">
									{otpCode}
								</Text>
							</Section>

							<Text className="mx-0 my-[16px] p-0 text-[14px] leading-[24px] text-[#666666]">
								This code will expire in {expiryTime}.
							</Text>

							<Text className="mx-0 my-[16px] p-0 text-[14px] leading-[24px] text-[#666666]">
								If you didn't request this code, you can safely ignore this
								email. Someone may have entered your email address by mistake.
							</Text>

							<Text className="mx-0 my-[16px] p-0 text-[14px] leading-[24px] text-[#666666]">
								For security reasons, please do not share this code with anyone.
							</Text>
						</Section>

						<Section className="mt-[32px] border-t border-solid border-[#e6e6e6] pt-[32px]">
							<Text className="m-0 text-[12px] leading-[20px] text-[#8a8a8a]">
								© {new Date().getFullYear()} Your Company. All rights reserved.
							</Text>
							<Text className="m-0 text-[12px] leading-[20px] text-[#8a8a8a]">
								123 Security Ave, Suite 200, San Francisco, CA 94107
							</Text>
							<Text className="m-0 text-[12px] leading-[20px] text-[#8a8a8a]">
								This is an automated message, please do not reply.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

OTPEmail.PreviewProps = {
	userEmail: "ian@01.studio",
	otpCode: "123456",
	expiryTime: "10 minutes",
};

export default OTPEmail;
