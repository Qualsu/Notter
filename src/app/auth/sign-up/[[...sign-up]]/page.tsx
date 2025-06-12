import { SignUp } from '@clerk/nextjs';
import { Metadata } from 'next';
import "../../style.css"

export const metadata: Metadata = {
  title: "Qual ID Auth",
  description: "SignUp",
  icons: {
    icon: 'https://id.qual.su/_next/static/media/ID.7c4a7838.svg',
  }
};

export default function SiginInPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center my-12">
      <SignUp />
      <div id='clerk-captcha'/>
    </main>
  );
}