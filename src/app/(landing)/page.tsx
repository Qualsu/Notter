import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Script from "next/script"
import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { About } from "./_components/about";
import { Premium } from "./_components/premium";
import { pages } from "@/config/routing/pages.route"

export default function Landing() {
  const redirectEnabled = cookies().get("redirect")?.value === "true"

  if (redirectEnabled) {
    redirect(pages.DASHBOARD())
  }

  return (
    <div className="min-h-full flex flex-col">
      <Script id="landing-redirect-bootstrap" strategy="beforeInteractive">
        {`
          (function () {
            try {
              var cookieMatch = document.cookie.split('; ').find(function (row) {
                return row.indexOf('redirect=') === 0;
              });

              if (cookieMatch && cookieMatch.split('=')[1] === 'true') {
                window.location.replace('/dashboard');
                return;
              }

              if (localStorage.getItem('redirect') === 'true') {
                document.cookie = 'redirect=true; Path=/; Max-Age=31536000; SameSite=Lax';
                window.location.replace('/dashboard');
              }
            } catch (error) {}
          })();
        `}
      </Script>
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10 m-0 p-0">
        <div className="w-full max-w-6xl mx-auto relative">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-logo-yellow dark:bg-logo-light-yellow rounded-full filter blur-3xl opacity-30 -z-10" />
          <div className="absolute -bottom-36 -left-24 w-96 h-96 bg-logo-cyan rounded-full filter blur-3xl opacity-20 -z-10" />
          <Heading />
        </div>

        <div className="w-full max-w-6xl mx-auto">
          <About />
        </div>

        <div className="w-full max-w-6xl mx-auto">
          <Premium />
        </div>
      </div>
      <Footer/>
    </div>
  )
}
