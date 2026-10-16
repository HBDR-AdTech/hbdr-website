import { renderBlueprintHero } from "./blueprint";

export function renderPageHero(tag: string, title: string, description: string): string {
  return renderBlueprintHero({ eyebrow: tag, title, lede: description });
}
