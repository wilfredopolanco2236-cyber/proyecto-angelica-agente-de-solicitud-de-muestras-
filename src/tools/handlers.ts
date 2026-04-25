import { listAllowlist, revokeAllowlist, upsertAllowlist } from '../core/allowlist_store';
import { getSession, saveSession } from '../core/session_store';

export interface ToolResult {
  ok: boolean;
  data?: Record<string, unknown>;
  message?: string;
}

export interface ToolExecutionContext {
  phone: string;
}

function getString(args: Record<string, unknown>, key: string, fallback = ''): string {
  const value = args[key];
  return typeof value === 'string' ? value : fallback;
}

function getNumber(args: Record<string, unknown>, key: string, fallback = 0): number {
  const value = args[key];
  return typeof value === 'number' ? value : fallback;
}

export const TOOL_HANDLERS: Record<string, (args: Record<string, unknown>, ctx: ToolExecutionContext) => ToolResult> = {
  'draft.create': (_, ctx) => {
    const session = getSession(ctx.phone);
    session.draft = { items: [] };
    session.state = 'AWAITING_CLIENT';
    saveSession(session);
    return { ok: true, data: { draft: session.draft } };
  },

  'draft.set_client': (args, ctx) => {
    const session = getSession(ctx.phone);
    session.draft.client = getString(args, 'cliente');
    session.state = 'AWAITING_PRODUCT';
    saveSession(session);
    return { ok: true, data: { client: session.draft.client } };
  },

  'draft.add_item': (args, ctx) => {
    const session = getSession(ctx.phone);
    const producto = getString(args, 'producto', 'PRODUCTO_NO_RESUELTO');
    const cantidad = getNumber(args, 'cantidad', 0);
    const unidad = getString(args, 'unidad', 'UNIDAD');

    session.draft.items.push({ producto, cantidad, unidad });
    saveSession(session);

    return { ok: true, data: { itemsCount: session.draft.items.length } };
  },

  'draft.remove_item': (args, ctx) => {
    const session = getSession(ctx.phone);
    const selector = getString(args, 'selector').toLowerCase();
    session.draft.items = session.draft.items.filter((item) => !item.producto.toLowerCase().includes(selector));
    saveSession(session);
    return { ok: true, data: { itemsCount: session.draft.items.length } };
  },

  'draft.update_item': (args, ctx) => {
    const session = getSession(ctx.phone);
    const selector = getString(args, 'selector').toLowerCase();
    const found = session.draft.items.find((item) => item.producto.toLowerCase().includes(selector));
    if (!found) return { ok: false, message: 'Item not found' };

    const cantidad = getNumber(args, 'cantidad', found.cantidad);
    const unidad = getString(args, 'unidad', found.unidad);
    found.cantidad = cantidad;
    found.unidad = unidad;
    saveSession(session);
    return { ok: true, data: { updated: found.producto } };
  },

  'draft.show': (_, ctx) => {
    const session = getSession(ctx.phone);
    return { ok: true, data: { draft: session.draft } };
  },

  'draft.finish': (_, ctx) => {
    const session = getSession(ctx.phone);
    session.state = 'DRAFT_READY_FOR_REVIEW';
    saveSession(session);
    return { ok: true, data: { draft: session.draft } };
  },

  'request.status': (args) => {
    return {
      ok: true,
      data: {
        requestNumber: getString(args, 'numeroSolicitud', 'SM-UNKNOWN'),
        status: 'BORRADOR'
      }
    };
  },

  'catalog.search': (args) => {
    return {
      ok: true,
      data: {
        query: getString(args, 'query'),
        candidates: ['FRAGANCIA PURE SENSE', 'FRAGANCIA VETIVER']
      }
    };
  },

  'allowlist.add': (args) => {
    const phone = getString(args, 'phone');
    const name = getString(args, 'name', 'USUARIO');
    const role = getString(args, 'role', 'VENDEDOR');
    const entry = upsertAllowlist({ phone, name, role, status: 'ACTIVE' });
    return { ok: true, data: { entry } };
  },

  'allowlist.update': (args) => {
    const raw = getString(args, 'raw').toLowerCase();
    if (raw.includes('revoca')) {
      const phone = getString(args, 'phone');
      return { ok: revokeAllowlist(phone), data: { phone } };
    }

    const phone = getString(args, 'phone', '+10000000000');
    const name = getString(args, 'name', 'USUARIO');
    const role = getString(args, 'role', 'VENDEDOR');
    const status = raw.includes('suspende') ? 'SUSPENDED' : 'ACTIVE';
    const entry = upsertAllowlist({ phone, name, role, status });
    return { ok: true, data: { entry } };
  },

  'allowlist.revoke': (args) => {
    const phone = getString(args, 'phone');
    return { ok: revokeAllowlist(phone), data: { phone } };
  },

  'allowlist.list': () => {
    return { ok: true, data: { users: listAllowlist() } };
  }
};
