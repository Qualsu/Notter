import { SignIn } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Notter | Qual ID Auth",
  description: "SignIn",
  icons: {
    icon: 'https://id.qual.su/_next/static/media/ID.7c4a7838.svg',
  }
};

export default function SiginInPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignIn />
      <div id='clerk-captcha' />
    </main>
  );
}