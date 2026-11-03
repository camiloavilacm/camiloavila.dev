export interface Technology {
  name: string;
  iconSrc?: string | null;
}

export interface Subscore {
  name: string;
  issuesCount: number;
  rating: 'Weak' | 'Medium' | 'Strong';
  /** Level 1 to 4 indicating how many bars are filled in the progress gauge */
  level: number;
}

export interface CompetitorItem {
  key: string;
  name: string;
  url: string;
  faviconUrl: string;
  trackingScore: number;
  usesServerSide: boolean;
  categories: {
    analytics: string | null;
    advertising: string;
    cookieDurability: string;
  };
  isYourSite?: boolean;
}

export interface PageSpeedMetric {
  pageSpeedUrl: string;
  overallRank: 'POOR' | 'AVERAGE' | 'GOOD';
  inpMs: number;
  lcpSeconds: number;
  clsScore: number;
  fcpSeconds: number;
  ttfbSeconds: number;
}

export interface ScriptBreakdown {
  order: number;
  name: string;
  icon: string;
  provider: string;
  dataSentTo: string;
  categories: string[];
  transferSize: number;
  blockingTime: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  scorePercent: number;
  isCritical: boolean;
  categories: string[];
  howToVideo?: string | null;
  howToTitle?: string | null;
  guideTitle?: string | null;
  pageSpeed?: PageSpeedMetric | null;
  scripts?: ScriptBreakdown[];
}

export interface ReportData {
  siteInfo: {
    domain: string;
    scanDate: string;
    scanDateShort: string;
    screenshotUrl: string;
  };
  score: {
    overall: number;
    trackersDetected: number;
    rating: string;
    subscores: {
      analytics: Subscore;
      advertising: Subscore;
      cookieDurability: Subscore;
      seo: Subscore;
    };
  };
  detectedTechnologies: Technology[];
  trackingArchitecture: {
    properlyConfigured: Technology[];
    withIssues: { name: string; icon: string; href: string }[];
    serverSideBenefits: string[];
    businessImpact: string[];
  };
  estimatedLosses: {
    defaultAdSpend: number;
    defaultVisitors: number;
    adSpendPresets: number[];
    visitorsPresets: number[];
    shopifyBanner: {
      badges: string[];
      title: string;
      buttonText: string;
      appUrl: string;
    };
  };
  competitors: CompetitorItem[];
  recommendations: {
    summary: string;
    summaryExpanded: string;
    items: Recommendation[];
  };
}

export const reportData: ReportData = {
  siteInfo: {
    domain: 'theecowoman.es',
    scanDate: '30 October 2026 01:55 UTC',
    scanDateShort: '30 Oct 2026 01:55 UTC',
    screenshotUrl: '/sites/tracking-checker/screenshot.png',
  },

  score: {
    overall: 16,
    trackersDetected: 8,
    rating: 'Weak',
    subscores: {
      analytics: {
        name: 'Analytics',
        issuesCount: 4,
        rating: 'Weak',
        level: 1,
      },
      advertising: {
        name: 'Advertising',
        issuesCount: 6,
        rating: 'Weak',
        level: 1,
      },
      cookieDurability: {
        name: 'Cookie durability',
        issuesCount: 6,
        rating: 'Weak',
        level: 1,
      },
      seo: {
        name: 'SEO',
        issuesCount: 7,
        rating: 'Medium',
        level: 2,
      },
    },
  },

  detectedTechnologies: [
    { name: 'Cart Functionality', iconSrc: null },
    { name: 'Shopify', iconSrc: '/sites/tracking-checker/icons/Shopify.png' },
    { name: 'Google Analytics 4', iconSrc: '/sites/tracking-checker/icons/Google_Analytics.png' },
    { name: 'Universal Analytics', iconSrc: '/sites/tracking-checker/icons/Google_Universal.png' },
    { name: 'Hotjar', iconSrc: '/sites/tracking-checker/icons/Hotjar.png' },
    { name: 'Meta', iconSrc: '/sites/tracking-checker/icons/Meta.png' },
    { name: 'Google Ads', iconSrc: '/sites/tracking-checker/icons/Google_Ads.png' },
    { name: 'Klaviyo', iconSrc: '/sites/tracking-checker/icons/Klaviyo.png' },
    { name: 'Microsoft Ads', iconSrc: '/sites/tracking-checker/icons/Microsoft.png' },
    { name: 'Microsoft Clarity', iconSrc: '/sites/tracking-checker/icons/Microsoft_Clarity.png' },
    { name: 'jsDelivr', iconSrc: '/sites/tracking-checker/icons/jsdelivr-icon.png' },
    { name: 'cdnjs', iconSrc: '/sites/tracking-checker/icons/cdnjs.png' },
    { name: 'Cloudflare', iconSrc: '/sites/tracking-checker/icons/CloudFlare.png' },
    { name: 'GoDaddy', iconSrc: '/sites/tracking-checker/icons/GoDaddy.png' },
    { name: 'Pandectes', iconSrc: null },
    { name: 'Visa', iconSrc: '/sites/tracking-checker/icons/Visa.png' },
    { name: 'PayPal', iconSrc: '/sites/tracking-checker/icons/PayPal.png' },
    { name: 'Mastercard', iconSrc: '/sites/tracking-checker/icons/Mastercard.png' },
    { name: 'Google Pay', iconSrc: null },
    { name: 'Apple Pay', iconSrc: null },
    { name: 'Shop Pay', iconSrc: null },
    { name: 'UnionPay', iconSrc: null },
  ],

  trackingArchitecture: {
    properlyConfigured: [
      { name: 'Microsoft Clarity', iconSrc: '/sites/tracking-checker/icons/Microsoft_Clarity.png' },
      { name: 'Hotjar', iconSrc: '/sites/tracking-checker/icons/Hotjar.png' },
    ],
    withIssues: [
      { name: 'Meta', icon: '/sites/tracking-checker/icons/Meta.png', href: '#rec-meta' },
      {
        name: 'Google Analytics 4',
        icon: '/sites/tracking-checker/icons/Google_Analytics.png',
        href: '#rec-ga4',
      },
      {
        name: 'Google Ads',
        icon: '/sites/tracking-checker/icons/Google_Ads.png',
        href: '#rec-gads',
      },
      { name: 'Klaviyo', icon: '/sites/tracking-checker/icons/Klaviyo.png', href: '#rec-klaviyo' },
      {
        name: 'Universal Analytics',
        icon: '/sites/tracking-checker/icons/Google_Universal.png',
        href: '#rec-ua',
      },
      {
        name: 'Microsoft Ads',
        icon: '/sites/tracking-checker/icons/Microsoft.png',
        href: '#rec-msads',
      },
    ],
    serverSideBenefits: [
      'Ad blocker resistant',
      'ITP-resistant cookies',
      'Bot and AI detection',
      'Offline conversions',
      'Data enrichment',
    ],
    businessImpact: [
      'Reduced data loss from browsers and ad blockers',
      'Better optimization signals for ad platforms',
      'Higher event match quality and ROAS measurement',
      'Better audience building for remarketing',
      'Easier compliance with privacy regulations',
    ],
  },

  estimatedLosses: {
    defaultAdSpend: 5000,
    defaultVisitors: 50000,
    adSpendPresets: [1000, 3000, 5000, 10000, 30000],
    visitorsPresets: [10000, 50000, 100000, 500000, 2000000],
    shopifyBanner: {
      badges: ['No coding', '~20% sales recovered', 'Lower ad costs'],
      title: 'Set up server-side tracking for Shopify much faster',
      buttonText: 'Open Shopify App',
      appUrl: 'https://apps.shopify.com/search?q=server-side+tracking',
    },
  },

  competitors: [
    {
      key: 'your-site',
      name: 'Your site',
      url: 'theecowoman.es',
      faviconUrl: '/sites/tracking-checker/favicons/your-site.png',
      trackingScore: 16,
      usesServerSide: false,
      categories: {
        analytics: 'Weak',
        advertising: 'Weak',
        cookieDurability: 'Weak',
      },
      isYourSite: true,
    },
    {
      key: 'ecoreina',
      name: 'ecoreina.com',
      url: 'ecoreina.com',
      faviconUrl: '/sites/tracking-checker/favicons/ecoreina.png',
      trackingScore: 36,
      usesServerSide: false,
      categories: {
        analytics: null,
        advertising: 'Weak',
        cookieDurability: 'Weak',
      },
    },
    {
      key: 'smoon',
      name: 'smoon-lingerie.com',
      url: 'smoon-lingerie.com',
      faviconUrl: '/sites/tracking-checker/favicons/smoon.webp',
      trackingScore: 31,
      usesServerSide: true,
      categories: {
        analytics: 'Weak',
        advertising: 'Weak',
        cookieDurability: 'Weak',
      },
    },
    {
      key: 'cocoro',
      name: 'cocoro-intim.com',
      url: 'cocoro-intim.com',
      faviconUrl: '/sites/tracking-checker/favicons/cocoro.jpg',
      trackingScore: 25,
      usesServerSide: false,
      categories: {
        analytics: 'Weak',
        advertising: 'Weak',
        cookieDurability: 'Weak',
      },
    },
  ],

  recommendations: {
    summary:
      "Your website's tracking setup currently has a very low overall score of 16, indicating significant areas for improvement. All detected tracking, including for key platforms like Google Analytics 4, Meta, and Google Ads, is primarily client-side.",
    summaryExpanded:
      "Currently, all your tracking operates client-side, making it vulnerable to ad blockers, browser privacy settings, and cookie restrictions, which leads to substantial data loss, attribution gaps, and under-reporting of user actions. Transitioning to server-side tracking for platforms that support it, such as Google Analytics 4, Meta, and Google Ads, would significantly improve data accuracy, ensure more reliable attribution for your marketing campaigns, and provide a more complete picture of customer journeys, enabling faster and more informed business decisions. This shift is crucial for maintaining robust data collection in today's evolving digital landscape. Below you can find all the recommendations for your tracking and ways to improve it.",
    items: [
      {
        id: 'rec-cookie-keeper',
        title: 'Use Cookie Keeper to bypass ITP limits and extend cookie duration',
        description:
          "With ITP, even cookies set from a first-party domain can be restricted. We've detected that you're not bypassing these cookie lifespan limits. Configure Cookie Keeper power-up to overcome ITP restrictions for your Shopify store.",
        scorePercent: 19,
        isCritical: true,
        categories: ['Cookies'],
        howToVideo: 'https://www.youtube.com/watch?v=n-CtX-uieTQ',
        howToTitle: 'Learn how to increase first-party cookie lifetime set by a third-party IP',
        guideTitle: 'Safari ITP - everything you need to know',
      },
      {
        id: 'rec-ga4',
        title: 'Implement Google Analytics 4 server-side tracking',
        description:
          'We’ve detected a client-side Google Analytics 4 script. While this setup works, client-side tracking is more vulnerable to ad blockers, cookie restrictions, and browser privacy settings issues, which can negatively impact the accuracy and reliability of your data. Switching to server-side tracking will help to bypass these challenges.',
        scorePercent: 16,
        isCritical: true,
        categories: ['Analytics'],
        howToVideo: 'https://www.youtube.com/watch?v=z5jfbSB_-Ss',
        howToTitle: 'Learn how to implement Google Analytics 4 server-side tracking',
        guideTitle: 'How to set up GA4 server-side tracking',
      },
      {
        id: 'rec-adblock',
        title: 'Avoid negative impact of ad blockers',
        description:
          'It has been detected that your GTM container is loading without proper protection against ad blockers. Ad blockers can interfere with tracking, leading to inaccurate data and incomplete insights. By using Custom Loader, you can ensure reliability and make better data-driven decisions for your business.',
        scorePercent: 12,
        isCritical: false,
        categories: ['Advertising', 'Analytics'],
        howToVideo: 'https://www.youtube.com/watch?v=sTKjNo3mR4E',
        howToTitle: 'Learn how to avoid the harmful impact of ad blockers on tracking code',
        guideTitle: 'Avoid the harmful impact of ad blockers on your website tracking code',
      },
      {
        id: 'rec-meta',
        title: 'Switch to web & server-side tracking for Meta',
        description:
          "We’ve detected that you're using client-side tracking for Meta. But Meta recommends a hybrid tracking method — combining both web and server-side tracking. Adding server-side tracking ensures you follow best practices and optimize data accuracy and functionality.",
        scorePercent: 8,
        isCritical: false,
        categories: ['Advertising'],
        howToVideo: 'https://www.youtube.com/watch?v=ytNnSVodsA4',
        howToTitle: 'Learn how to correctly implement Meta tracking',
        guideTitle: 'Set up Facebook server-side tracking with Facebook Conversions API',
      },
      {
        id: 'rec-ua',
        title: 'Remove Universal Analytics script',
        description:
          'We’ve detected that Universal Analytics is still active, but UA was disabled in July 2023. It continues to load unnecessary scripts and data dumps, which can slow down your website. We recommend removing Universal Analytics and migrating to GA4 for better performance and tracking.',
        scorePercent: 8,
        isCritical: false,
        categories: ['Advertising'],
        howToVideo: 'https://www.youtube.com/watch?v=z5jfbSB_-Ss',
        howToTitle:
          'Learn how to set up GA4 tracking using Google Tag Manager server-side container',
        guideTitle: 'How to set up GA4 server-side tracking',
      },
      {
        id: 'rec-gads',
        title: 'Move to Google Ads server-side tracking',
        description:
          'We’ve detected a client-side Google Ads script. While this setup works, client-side tracking is more vulnerable to ad blockers, cookie restrictions, and browser privacy settings issues, which can negatively impact the accuracy and reliability of your data. Switching to server-side tracking will help to bypass these challenges.',
        scorePercent: 6,
        isCritical: false,
        categories: ['Advertising'],
        howToVideo: 'https://www.youtube.com/watch?v=s-R6mvpiLk4',
        howToTitle: 'Learn how to implement Google Ads server-side tracking',
        guideTitle: 'Google Ads server-side tracking guide',
      },
      {
        id: 'rec-pagespeed',
        title: 'Optimise page speed',
        description:
          'Tracking scripts load JavaScript in the browser which can increase First Contentful Paint, Largest Contentful Paint, and Total Blocking Time. Offloading trackers to a server-side container improves your Core Web Vitals and user experience.',
        scorePercent: 5,
        isCritical: false,
        categories: ['Pagespeed'],
        pageSpeed: {
          pageSpeedUrl:
            'https://pagespeed.web.dev/analysis?form_factor=mobile&url=https%3A%2F%2Ftheecowoman.es%2F',
          overallRank: 'AVERAGE',
          inpMs: 290,
          lcpSeconds: 2.3,
          clsScore: 0.1,
          fcpSeconds: 1.6,
          ttfbSeconds: 0.5,
        },
        scripts: [
          {
            order: 1,
            name: 'fbevents.js',
            icon: '/sites/tracking-checker/icons/Meta.png',
            provider: 'Meta',
            dataSentTo: 'US',
            categories: ['Advertising'],
            transferSize: 115,
            blockingTime: 92,
          },
          {
            order: 2,
            name: 'G gtag.js',
            icon: '/sites/tracking-checker/icons/Google_Analytics.png',
            provider: 'Google',
            dataSentTo: 'US',
            categories: ['Analytics'],
            transferSize: 199,
            blockingTime: 536,
          },
          {
            order: 3,
            name: 'AW gtag.js',
            icon: '/sites/tracking-checker/icons/Google_Ads.png',
            provider: 'Google',
            dataSentTo: 'US',
            categories: ['Advertising'],
            transferSize: 169,
            blockingTime: 545,
          },
          {
            order: 4,
            name: 'onsite.js',
            icon: '/sites/tracking-checker/icons/Klaviyo.png',
            provider: 'Klaviyo',
            dataSentTo: 'US',
            categories: ['Advertising'],
            transferSize: 34,
            blockingTime: 488,
          },
          {
            order: 5,
            name: 'klaviyo.js',
            icon: '/sites/tracking-checker/icons/Klaviyo.png',
            provider: 'Klaviyo',
            dataSentTo: 'US',
            categories: ['Advertising'],
            transferSize: 4,
            blockingTime: 621,
          },
          {
            order: 6,
            name: 'fender_analytics.js',
            icon: '/sites/tracking-checker/icons/Klaviyo.png',
            provider: 'Klaviyo',
            dataSentTo: 'US',
            categories: ['Advertising'],
            transferSize: 15,
            blockingTime: 47,
          },
          {
            order: 7,
            name: 'static.js',
            icon: '/sites/tracking-checker/icons/Klaviyo.png',
            provider: 'Klaviyo',
            dataSentTo: 'US',
            categories: ['Advertising'],
            transferSize: 1,
            blockingTime: 46,
          },
          {
            order: 8,
            name: 'runtime.js',
            icon: '/sites/tracking-checker/icons/Klaviyo.png',
            provider: 'Klaviyo',
            dataSentTo: 'US',
            categories: ['Advertising'],
            transferSize: 8,
            blockingTime: 52,
          },
          {
            order: 9,
            name: 'analytics.js',
            icon: '/sites/tracking-checker/icons/Google_Universal.png',
            provider: 'Google',
            dataSentTo: 'US',
            categories: ['Advertising'],
            transferSize: 21,
            blockingTime: 35,
          },
          {
            order: 10,
            name: 'bat.js',
            icon: '/sites/tracking-checker/icons/Microsoft.png',
            provider: 'Microsoft',
            dataSentTo: 'US',
            categories: ['Advertising'],
            transferSize: 17,
            blockingTime: 101,
          },
          {
            order: 11,
            name: 'clarity.js',
            icon: '/sites/tracking-checker/icons/Microsoft_Clarity.png',
            provider: 'Microsoft',
            dataSentTo: 'US',
            categories: ['Advertising'],
            transferSize: 1,
            blockingTime: 390,
          },
          {
            order: 12,
            name: 'hotjar.js',
            icon: '/sites/tracking-checker/icons/Hotjar.png',
            provider: 'Hotjar',
            dataSentTo: 'MT',
            categories: ['Analytics'],
            transferSize: 7,
            blockingTime: 141,
          },
        ],
      },
      {
        id: 'rec-msads',
        title: 'Switch to hybrid tracking for Microsoft Ads',
        description:
          'We’ve detected that you’re using client-side tracking for Microsoft. Microsoft recommends combining browser and server-side tracking using the Microsoft Conversion API (CAPI). Enabling server-side tracking helps improve data accuracy, match rates, and overall tracking reliability.',
        scorePercent: 4,
        isCritical: false,
        categories: ['Advertising'],
        howToTitle: 'Learn how to implement Microsoft CAPI tracking',
        guideTitle: 'Step-by-step guide on Microsoft Conversion API integration',
      },
      {
        id: 'rec-klaviyo',
        title: 'Set up server-side tracking for Klaviyo',
        description:
          'We’ve detected that you’re using client-side tracking for Klaviyo, but the platform also supports server-side tracking. Setting up server-side tracking is highly recommended for better performance.',
        scorePercent: 3,
        isCritical: false,
        categories: ['Advertising'],
        howToVideo: 'https://www.youtube.com/watch?v=t5fqMfJs3K8',
        howToTitle: 'Learn how to configure Klaviyo tracking',
        guideTitle: 'Integrate Klaviyo with your website using Google Tag Manager Server container',
      },
    ],
  },
};
