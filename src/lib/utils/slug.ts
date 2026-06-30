export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function generateWorkspaceSlug(name: string) {
  return `${slugify(`workspace ${name}`)}-${crypto.randomUUID().slice(0, 6)}`;
}