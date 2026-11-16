import { getStore } from "@netlify/blobs";

// Owner-only. Send header "x-admin-token" matching the ADMIN_TOKEN env var.
export default async (req) => {
  const token = process.env.ADMIN_TOKEN;
  if (!token || req.headers.get("x-admin-token") !== token)
    return new Response("Unauthorized", { status: 401 });

  const store = getStore("orders");
  if (req.method === "PATCH") {            // mark an order: {id, status}
    const { id, status } = await req.json();
    const o = await store.get(id, { type: "json" });
    if (!o) return new Response("Not found", { status: 404 });
    o.status = ["new", "paid", "shipped", "done"].includes(status) ? status : o.status;
    await store.setJSON(id, o);
    return Response.json(o);
  }
  const { blobs } = await store.list();
  const all = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
  return Response.json(all.filter(Boolean).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
};
export const config = { path: "/api/orders" };
