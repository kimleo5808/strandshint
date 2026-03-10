export interface HeaderLink {
  id?: string;
  name: string;
  href: string;
  target?: string;
  rel?: string;
};

export interface HeaderLinkGroup {
  /** Group label shown as dropdown trigger. If no links, renders as a plain link using href. */
  name: string;
  href?: string;
  links?: HeaderLink[];
};

export interface FooterLink {
  title: string;
  links: Link[];
};

interface Link {
  id?: string;
  href: string;
  name: string;
  target?: string;
  rel?: string;
  useA?: boolean;
};