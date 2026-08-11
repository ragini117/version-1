import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
    return (
        <>
            <Html lang="en">
                <Head>
                    <meta
                        name="google-site-verification"
                        content="CW4c-LXrWdetryigRTPJbDGZhu_1KKdRLUlZ50aCsVs"
                    />
                    <title>Decentrawood</title>
                    <meta
                        name="description"
                        content="Explore Decentrawood, an innovative AI-powered metaverse platform offering immersive games, cultural experiences, and glamorous virtual worlds."
                    />
                    <script
                        async
                        src="https://www.googletagmanager.com/gtag/js?id=G-QC9NPLE2GE"
                    ></script>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', 'G-QC9NPLE2GE',{
             page_path:window.location.pathname,
         });
          `,
                        }}
                    ></script>
                    <link
                        rel="stylesheet"
                        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css"
                    ></link>
                </Head>

                <body>
                    <Main />
                    <NextScript />
                    <script
                        src="https://kit.fontawesome.com/f18bc99e70.js"
                        crossorigin="anonymous"
                    ></script>
                </body>
            </Html>
        </>
    );
}
