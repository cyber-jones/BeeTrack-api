export function parsePagination(query: any) {
  const page = Math.max(1, Number(query.page || 1));
  let limit = Number(query.limit || 20);
  if (Number.isNaN(limit) || limit <= 0) limit = 20;
  limit = Math.min(limit, 200);
  const skip = (page - 1) * limit;
  const sort = String(query.sort || '-createdAt'); // default: newest first
  return { page, limit, skip, sort };
}