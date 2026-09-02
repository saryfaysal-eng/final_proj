import React from "react";
import Link from "next/link";

const footerLinks = [
  { name: "About", href: "https://about.x.com/en" },
  { name: "Get App", href: "https://help.x.com/en/using-x/download-the-x-app" },
  { name: "Grok", href: "https://grok.com/" },
  { name: "Help", href: "https://help.x.com/en" },
  { name: "Terms", href: "https://x.com/en/tos" },
  { name: "Privacy", href: "https://x.com/privacy" },
  {
    name: "Cookies",
    href: "https://help.x.com/en/rules-and-policies/x-cookies",
  },
  { name: "Careers", href: "https://x.ai/careers" },
  {
    name: "Ads & Business",
    href: "https://business.x.com/en/advertising?ref=gl-tw-tw-twitter-advertise",
  },
  { name: "Developers", href: "https://developer.x.com/" },
  { name: "News", href: "https://x.com/i/jf/stories/home" },
  {
    name: "Accessibility",
    href: "https://help.x.com/en/resources/accessibility",
  },
];

export default function Footer() {
  return (
    <footer className="flex justify-center items-center gap-x-1 text-xs text-gray-500">
      {footerLinks.map((item) => (
        <React.Fragment key={item.name}>
          <Link href={item.href} className="hover:underline" target="_blank">
            {item.name}
          </Link>
          <span className="select-none">·</span>
        </React.Fragment>
      ))}
      <span className="select-none">&copy; 2026 X Corp.</span>
    </footer>
  );
}
