export interface ChangelogItem {
  text: string;
}

export interface ChangelogCategory {
  title: string;
  items: ChangelogItem[];
}

export interface ChangelogVersion {
  version: string;
  subtitle: string;
  categories: ChangelogCategory[];
}
