import { Container } from '@/components/container';
import { withAuth } from '@repo/auth/server';
import { ButtonLink } from '@repo/ui/components/button';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { user } = await withAuth();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <Container className="py-24">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to StartupKit
          </h1>
          <p className="text-xl text-muted-foreground">
            A modern SaaS template with authentication built-in
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <ButtonLink href="/sign-in" size="lg">
            Sign In
          </ButtonLink>
          <ButtonLink href="/dashboard" variant="outline" size="lg">
            Dashboard
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
