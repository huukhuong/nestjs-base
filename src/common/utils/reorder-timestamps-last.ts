const TIMESTAMP_KEYS = ['createdAt', 'updatedAt', 'deletedAt'] as const;

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

/** Typical TypeORM / BaseEntity row: has id + at least one audit column. */
function looksLikeAuditedEntity(o: Record<string, unknown>): boolean {
  const id = o['id'];
  if (typeof id !== 'string' && typeof id !== 'number') {
    return false;
  }
  return TIMESTAMP_KEYS.some(k => k in o);
}

/**
 * Puts createdAt / updatedAt / deletedAt at the end of the object (JSON key order).
 */
export function moveTimestampsLast<T extends Record<string, unknown>>(
  obj: T,
): T {
  const rest = { ...obj } as Record<string, unknown>;
  const tail: Record<string, unknown> = {};
  for (const k of TIMESTAMP_KEYS) {
    if (k in rest) {
      tail[k] = rest[k];
      delete rest[k];
    }
  }
  return { ...rest, ...tail } as T;
}

/**
 * Walks API `data` (object, array, or nested) and moves audit columns last on entity-like objects.
 */
export function reorderTimestampsInResponseData(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(reorderTimestampsInResponseData);
  }
  if (!isPlainRecord(data)) {
    return data;
  }

  let obj: Record<string, unknown> = { ...data };
  if (looksLikeAuditedEntity(obj)) {
    obj = moveTimestampsLast(obj);
  }

  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    out[key] = reorderTimestampsInResponseData(val);
  }
  return out;
}
