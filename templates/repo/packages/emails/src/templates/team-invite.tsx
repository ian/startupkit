import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

export interface TeamInviteEmailProps {
	email: string;
	invitedByName: string;
	teamName: string;
	inviteLink: string;
}

export const TeamInviteEmail = ({
	invitedByName,
	teamName,
	inviteLink,
}: TeamInviteEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>You've been invited to join {teamName}</Preview>
			<Tailwind>
				<Body className="bg-[#f5f5f7] font-sans">
					<Container className="mx-auto my-[40px] w-full max-w-[500px] rounded-[16px] bg-white p-[32px]">
						<Section>
							<Heading className="mx-0 my-[24px] p-0 text-[24px] font-bold text-black">
								Join {teamName}
							</Heading>

							<Text className="mx-0 my-[16px] p-0 text-[16px] leading-[24px] text-[#333333]">
								Hello,
							</Text>

							<Text className="mx-0 my-[16px] p-0 text-[16px] leading-[24px] text-[#333333]">
								<strong>{invitedByName}</strong> has invited you to collaborate
								on <strong>{teamName}</strong>. Join the team to start working
								together.
							</Text>

							<Section className="my-[32px] text-center">
								<Button
									className="box-border rounded-[8px] bg-black px-[24px] py-[12px] text-[14px] font-medium text-white no-underline"
									href={inviteLink}
								>
									Accept Invitation
								</Button>
							</Section>

							<Text className="mx-0 my-[16px] p-0 text-[14px] leading-[24px] text-[#666666]">
								If the button doesn't work, copy and paste this link into your
								browser:
							</Text>

							<Text className="mx-0 my-[16px] p-0 text-[14px] leading-[24px] text-[#666666]">
								<Link href={inviteLink} className="text-black underline">
									{inviteLink}
								</Link>
							</Text>

							<Text className="mx-0 my-[16px] p-0 text-[14px] leading-[24px] text-[#666666]">
								This invitation will expire in 7 days.
							</Text>
						</Section>

						<Section className="mt-[32px] border-t border-solid border-[#e6e6e6] pt-[32px]">
							<Text className="m-0 text-[12px] leading-[20px] text-[#8a8a8a]">
								© {new Date().getFullYear()} StartupKit. All rights reserved.
							</Text>
							<Text className="m-0 text-[12px] leading-[20px] text-[#8a8a8a]">
								2121 E Lohmans Crossing, Suite 504-702, Lakeway, TX 78734
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

TeamInviteEmail.PreviewProps = {
	inviterName: "Alex Johnson",
	inviteeEmail: "ian@startupkit.com",
	teamName: "StartupKit",
	inviteLink: "https://example.com/invite/abc123",
};

export default TeamInviteEmail;
