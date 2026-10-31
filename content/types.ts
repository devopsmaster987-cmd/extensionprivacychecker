export interface FaqItem {
  question: string;
  answer: string;
}

export interface ContentTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface ContentStep {
  title: string;
  body: string;
}

export interface ContentLink {
  label: string;
  slug: string;
}

export interface ContentSection {
  heading: string;
  body: string[];
  list?: string[];
  steps?: ContentStep[];
  table?: ContentTable;
  callout?: string;
  links?: ContentLink[];
}

export type ContentKind = "hub" | "keyword";

export type ContentIntent = "analyzer" | "guide" | "comparison" | "question" | "reference";

export interface ContentPage {
  kind: ContentKind;
  slug: string;
  cluster: string;
  hub: string | null;
  primaryKeyword: string;
  intent: ContentIntent;
  title: string;
  metaTitle: string;
  description: string;
  h1: string;
  answer: string;
  sections: ContentSection[];
  faqs: FaqItem[];
  related: string[];
  lastReviewed: string;
  analyzerEmbed: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}
