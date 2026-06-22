interface WidgetOptions {
  position: "left" | "right";
  theme: "dark" | "light";
  primaryColor: string;
  title: string;
  foregroundColor: string;
  userData?: Record<string, any>;
  autoInit?: boolean;
  fullScreen: boolean;
  language?: "fa" | "en";
  /** When true (default), prompt for phone number before the first message. */
  collectPhoneNumber?: boolean;
}
interface FetchPaginationRes<T = any> {
  results: T[];
  next: string | null;
  prev: string | null;
  count: number;
}
export {WidgetOptions, FetchPaginationRes};
