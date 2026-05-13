import { siteConfig } from "../siteConfig";

export const CONTACT = {
  email: siteConfig.email,
  domain: siteConfig.baseUrl,
  github: siteConfig.social.github,
  linkedin: siteConfig.social.linkedin,
  twitter: siteConfig.social.twitter,
  twitterHandle: siteConfig.twitterHandle,
} as const;
