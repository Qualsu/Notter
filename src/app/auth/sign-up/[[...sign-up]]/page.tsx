import { SignUp } from '@clerk/nextjs';
import { Metadata } from 'next';
import { images } from '@/config/routing/image.route';
import "../../style.css"

export const metadata: Metadata = {
  title: "Qual ID Auth",
  description: "SignUp",
  icons: {
    icon: images.IMAGE.DARK_ICON,
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
