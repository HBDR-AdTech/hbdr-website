import { renderCtaBand } from "./blueprint";

export function renderCTASection(heading: string, buttonText: string): string {
  return renderCtaBand(heading, [{ label: buttonText, href: "/contact", primary: true, testid: "button-cta" }]);
}
