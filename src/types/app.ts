interface WidgetOptions {
  position: "left" | "right";
  theme: "dark" | "light";
  primaryColor: string;
  title: string;
  foregroundColor: string;
  userData?: Record<string, any>;
  autoInit?: boolean;
  fullScreen: boolean;
}
interface FetchPaginationRes<T = any> {
  results: T[];
  next: string | null;
  prev: string | null;
  count: number;
}
export {WidgetOptions, FetchPaginationRes};
