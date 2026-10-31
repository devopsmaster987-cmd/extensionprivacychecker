export type Severity = "info" | "low" | "medium" | "high" | "critical";
export type Confidence = "low" | "medium" | "high";

export type FindingCategory =
  | "dynamic-code"
  | "remote-code"
  | "obfuscation"
  | "network"
  | "storage"
  | "dom-injection"
  | "messaging"
  | "sensitive-data"
  | "manifest";

export type FindingRule =
  | "eval"
  | "function-constructor"
  | "timer-string"
  | "remote-script"
  | "import-scripts"
  | "obfuscation"
  | "dom-injection"
  | "document-write"
  | "network-request"
  | "websocket"
  | "storage"
  | "messaging"
  | "native-messaging"
  | "cookie-access"
  | "credential-access"
  | "keyboard-listeners"
  | "manifest-warning";

export interface Finding {
  id: string;
  rule: FindingRule;
  category: FindingCategory;
  file: string;
  line: number | null;
  column: number | null;
  severity: Severity;
  confidence: Confidence;
  evidence: string;
  explanation: string;
  recommendation: string;
}

export interface DomainRef {
  domain: string;
  category: DomainCategory;
  count: number;
  files: string[];
}

export type DomainCategory =
  | "analytics"
  | "advertising"
  | "authentication"
  | "error-reporting"
  | "cloud"
  | "unknown";

export interface PermissionInfo {
  key: string;
  raw: string;
  kind: "api" | "host";
  optional: boolean;
  score: number;
  level: "low" | "medium" | "high" | "critical";
  broad: boolean;
  description: string;
  recommendation: string;
}

export interface ContentScriptSummary {
  matches: string[];
  js: string[];
  css: string[];
  runAt: string | null;
  allFrames: boolean;
}

export interface BackgroundSummary {
  type: "service-worker" | "scripts" | "page" | "unknown";
  scripts: string[];
  serviceWorker: string | null;
  persistent: boolean | null;
}

export interface ManifestSummary {
  found: boolean;
  path: string | null;
  manifestVersion: number | null;
  name: string | null;
  version: string | null;
  description: string | null;
  browsers: string[];
  permissions: string[];
  optionalPermissions: string[];
  hostPermissions: string[];
  optionalHostPermissions: string[];
  contentScripts: ContentScriptSummary[];
  background: BackgroundSummary | null;
  actionPopup: string | null;
  externallyConnectable: unknown;
  webAccessibleResources: unknown;
  contentSecurityPolicy: string | null;
  updateUrl: string | null;
  optionsPage: string | null;
  errors: string[];
  raw: Record<string, unknown> | null;
}

export interface HostAccessSummary {
  patterns: string[];
  broadness: "none" | "specific" | "broad" | "all-sites";
  score: number;
  evidence: string[];
}

export interface ScoreCategory {
  key:
    | "permissionExposure"
    | "websiteAccess"
    | "dataCollection"
    | "remoteCode"
    | "externalDomains"
    | "obfuscation";
  score: number;
  weight: number;
  weighted: number;
  evidence: string[];
}

export interface RiskAssessment {
  score: number;
  level: "low" | "moderate" | "high" | "critical";
  categories: ScoreCategory[];
  summary: string;
}

export interface SourceInfo {
  name: string;
  kind: "crx" | "zip" | "xpi" | "json" | "extension-package";
  sizeBytes: number;
}

export interface AnalysisStats {
  entryCount: number;
  filesScanned: number;
  jsFiles: number;
  bytesScanned: number;
  totalUncompressedBytes: number;
  skipped: string[];
}

export interface AnalysisReport {
  schemaVersion: 1;
  analyzedAt: string;
  source: SourceInfo;
  manifest: ManifestSummary;
  permissions: PermissionInfo[];
  hostAccess: HostAccessSummary;
  findings: Finding[];
  domains: DomainRef[];
  score: RiskAssessment;
  stats: AnalysisStats;
  warnings: string[];
  limits: string[];
}

export interface ExtractedTextFile {
  path: string;
  text: string;
  bytes: number;
}

export type ProgressStage =
  | "reading"
  | "unpacking"
  | "manifest"
  | "source"
  | "domains"
  | "scoring"
  | "done";

export interface AnalysisProgress {
  stage: ProgressStage;
  percent: number;
  detail?: string;
}
