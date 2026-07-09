/**
 * SEO & Search Engine Optimization metadata utility
 * Provides dynamic meta tags and structured schema.org JSON-LD definitions
 */

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  schemas: Record<string, any>[];
}

const BASE_URL = "https://hyderabad-service-marketplace.vercel.app";

export function generateSeoMetadata(
  currentView: string,
  category: string = "All",
  location: string = "All Hyderabad",
  searchQuery: string = ""
): SeoMetadata {
  let title = "Hyderabad Service Marketplace | Premium Hyperlocal Services in Sindh";
  let description = "Find & book verified wedding halls, makeup studios, caters, event planners, and local logistics in Hyderabad, Sindh. Enjoy transparent rates, dynamic AI cost estimation, and secure reverse bidding.";
  let canonicalUrl = `${BASE_URL}/`;
  let ogTitle = title;
  let ogDescription = description;

  // Breadcrumbs items
  const breadcrumbs: { name: string; url: string }[] = [
    { name: "Home", url: BASE_URL }
  ];

  if (currentView === "auction") {
    title = "Live Reverse Auction Bidding Board | Hyderabad Service Marketplace";
    description = "Submit your custom event requirements or home service needs and watch verified local providers bid live to offer the absolute best prices in Hyderabad.";
    canonicalUrl = `${BASE_URL}/auction`;
    ogTitle = "Live Reverse Auctions in Hyderabad, Sindh";
    ogDescription = "Get competitive price offers from verified professional service providers. Post your custom booking requirements now.";
    breadcrumbs.push({ name: "Reverse Auctions", url: `${BASE_URL}/auction` });
  } else if (currentView === "dashboard") {
    title = "My Workspace Hub & Bookings Console | Hyderabad Service Marketplace";
    description = "Securely manage active service schedules, verified OTP completions, instant buyer-seller chat conversations, and loyalty wallet points.";
    canonicalUrl = `${BASE_URL}/workspace`;
    ogTitle = "Customer & Provider Interactive Dashboard";
    ogDescription = "Access your active service statuses, complete bookings with high-security 4-digit OTPs, and track wallet balances.";
    breadcrumbs.push({ name: "Dashboard Workspace", url: `${BASE_URL}/workspace` });
  } else if (category !== "All") {
    // Category filtered home view
    title = `Verified ${category} Services in Hyderabad | Professional Directory`;
    description = `Book the best rated ${category} in Hyderabad, Sindh. Filter verified partners in Latifabad, Qasimabad, Saddar, and Autobahn Road with guaranteed rates.`;
    canonicalUrl = `${BASE_URL}/category/${encodeURIComponent(category.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-"))}`;
    ogTitle = `Top ${category} in Hyderabad, Sindh`;
    ogDescription = `Check transparent rates, verified credentials, and customer reviews for top ${category} providers.`;
    breadcrumbs.push({ name: category, url: canonicalUrl });
  } else if (location !== "All Hyderabad") {
    title = `Local Home & Event Services in ${location}, Hyderabad | HSM`;
    description = `Discover premier service providers located directly in ${location}, Hyderabad. Compare verified hall owners, artists, and event planners close to you.`;
    canonicalUrl = `${BASE_URL}/location/${encodeURIComponent(location.toLowerCase().replace(/\s+/g, "-"))}`;
    breadcrumbs.push({ name: location, url: canonicalUrl });
  }

  if (searchQuery) {
    title = `Search Results for "${searchQuery}" | Hyderabad Service Marketplace`;
    description = `Compare verified service bids and profiles matching "${searchQuery}" in Hyderabad. Get AI-estimated rates instantly.`;
  }

  // Schema.org Structured Data
  
  // 1. Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hyderabad Service Marketplace",
    "url": BASE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BASE_URL}/?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // 2. Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hyderabad Service Marketplace",
    "alternateName": "HSM Hyperlocal",
    "url": BASE_URL,
    "logo": `${BASE_URL}/src/assets/images/hsm_favicon_logo_1783583318477.jpg`,
    "sameAs": [
      "https://facebook.com/hyderabadservicemarketplace",
      "https://instagram.com/hyderabadservicemarketplace"
    ]
  };

  // 3. Local Business Schema (Hyperlocal focus on Hyderabad, Sindh)
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Hyderabad Service Marketplace",
    "image": `${BASE_URL}/src/assets/images/hsm_favicon_logo_1783583318477.jpg`,
    "telephone": "+92-300-1234567",
    "url": BASE_URL,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Autobahn Road, Latifabad Unit 3",
      "addressLocality": "Hyderabad",
      "addressRegion": "Sindh",
      "postalCode": "71000",
      "addressCountry": "PK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "25.3960",
      "longitude": "68.3578"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "PKR 500 - PKR 500000",
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Qasimabad"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Latifabad"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Saddar"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Autobahn"
      }
    ]
  };

  // 4. Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": b.name,
      "item": b.url
    }))
  };

  return {
    title,
    description,
    canonicalUrl,
    ogTitle,
    ogDescription,
    schemas: [websiteSchema, organizationSchema, localBusinessSchema, breadcrumbSchema]
  };
}

/**
 * Updates head meta tags dynamically from React
 */
export function updateDocumentSeo(metadata: SeoMetadata): void {
  // 1. Update Title
  document.title = metadata.title;

  // 2. Update Meta Description
  let descMeta = document.querySelector("meta[name='description']");
  if (!descMeta) {
    descMeta = document.createElement("meta");
    descMeta.setAttribute("name", "description");
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute("content", metadata.description);

  // 3. Update Canonical Link
  let canonicalLink = document.querySelector("link[rel='canonical']");
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute("href", metadata.canonicalUrl);

  // 4. Update Open Graph Tags
  const updateOgTag = (property: string, content: string) => {
    let tag = document.querySelector(`meta[property='${property}']`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("property", property);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  updateOgTag("og:title", metadata.ogTitle);
  updateOgTag("og:description", metadata.ogDescription);
  updateOgTag("og:url", metadata.canonicalUrl);
  updateOgTag("og:type", "website");
  updateOgTag("og:site_name", "Hyderabad Service Marketplace");
  
  // Add premium logo for rich search snippets & previews
  const logoUrl = `${BASE_URL}/src/assets/images/hsm_favicon_logo_1783583318477.jpg`;
  updateOgTag("og:image", logoUrl);

  // 5. Update Twitter Card Tags
  const updateTwitterTag = (name: string, content: string) => {
    let tag = document.querySelector(`meta[name='${name}']`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  updateTwitterTag("twitter:card", "summary_large_image");
  updateTwitterTag("twitter:title", metadata.ogTitle);
  updateTwitterTag("twitter:description", metadata.ogDescription);
  updateTwitterTag("twitter:image", logoUrl);

  // 6. Update/Inject Schema.org JSON-LD Structured Data script blocks
  // Remove existing ones
  const existingScripts = document.querySelectorAll("script[data-seo-schema]");
  existingScripts.forEach(script => script.remove());

  // Inject each schema as a separate script block for cleaner crawling
  metadata.schemas.forEach((schema, index) => {
    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.setAttribute("data-seo-schema", `schema-${index}`);
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  });
}
