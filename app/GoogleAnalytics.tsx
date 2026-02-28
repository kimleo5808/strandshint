"use client";

import Script from "next/script";
import * as gtag from "../gtag.js";

const GoogleAnalytics = () => {
  const trackingId = gtag.GA_TRACKING_ID;

  return (
    <>
      {trackingId ? (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(trackingId)}`}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', ${JSON.stringify(trackingId)}, {
                page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default GoogleAnalytics;
