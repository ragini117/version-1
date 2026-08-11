 export const slugify = (title) =>
    title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove special chars
    .trim()
    .replace(/\s+/g, '-');    // replace spaces with dashes
