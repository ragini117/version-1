"use client";

import { Inter } from "next/font/google";
import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { Providers } from "@/redux/provider";
import { AnnouncementModal } from "@/components/Announcementmodal";
import NextNProgressClient from "@/components/progressLoader";
import Chatbot from "@/components/Chatbot";
import { GoogleAnalytics } from "@next/third-parties/google";
import * as fbq from "@/lib/fbpixel";
import "bootstrap/dist/css/bootstrap.css";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Facebook Pixel PageView on route change
  useEffect(() => {
    if (typeof window !== "undefined") {
      fbq.pageview();
    }
  }, [pathname]);

  // GTM dataLayer pageview
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "pageview",
        page: pathname,
      });
    }
  }, [pathname]);

  return (
    <Providers>
      <html lang="en">
        <head>
          <title>Decentrawood</title>
          <meta
            name="description"
            content="Explore Decentrawood, an innovative AI-powered metaverse platform offering immersive games, cultural experiences, and glamorous virtual worlds."
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css"
          />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,700;1,100&display=swap"
            rel="stylesheet"
          />

          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.css"
            integrity="sha512-UTNP5BXLIptsaj5WdKFrkFov94lDx+eBvbKyoe1YAfjeRPC+gT5kyZ10kOHCfNZqEui1sxmqvodNUx3KbuYI/A=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />

          <link
            rel="stylesheet"
            href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
          />

          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />

          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.green.css"
            integrity="sha512-riTSV+/RKaiReucjeDW+Id3WlRLVZlTKAJJOHejihLiYHdGaHV7lxWaCfAvUR0ErLYvxTePZpuKZbrTbwpyG9w=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />

          <meta name="google-site-verification" content="3xR5PeajIr9oiXSVHg_CzeVPmGIpJeZuxkea6sSX7DQ" />
          {/* Google Analytics */}
          {/* <GoogleAnalytics gaId="G-QC9NPLE2GE" /> */}

          {/* Google Ads */}
          {/* <Script
          id="google-ads"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5930430760456334"
          crossOrigin="anonymous"
        /> */}

          {/* <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M8HLD2TV');`,
          }}
        /> */}

          {/* Facebook Pixel */}
          <Script
            id="facebook-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '843898488489861');
              fbq('track', 'PageView');
            `,
            }}
          />
        </head>

        <body className={inter.className}>
          {/* <AnnouncementModal /> */}
          {/* (Google Tag Manager) */}
          <Script id="gtm-script" strategy="afterInteractive">
            {`
        (function(w,d,s,l,i){w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-WVCSWXXQ');
      `}
          </Script>

          {/* GTM NoScript */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-WVCSWXXQ"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>

          {/* Facebook Pixel NoScript */}
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=843898488489861&ev=PageView&noscript=1"
            />
          </noscript>

          {children}
          <NextNProgressClient />
          <Chatbot />
          <Script
            src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
            integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            strategy="beforeInteractive"
          />
          <Script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        </body>
      </html>
    </Providers>
  );
}
