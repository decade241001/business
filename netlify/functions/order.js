import { getStore } from "@netlify/blobs";
import { products } from "./_shared/products.js";

const clean = (s, n = 300) => String(s ?? "").trim().slice(0, n);

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  let b;
  try { b = await req.json(); } catch { return Response.json({ error: "Invalid request" }, { status: 400 }); }

  const name = clean(b.name, 100), phone = clean(b.phone, 20), address = clean(b.address), notes = clean(b.notes, 500);
  if (!name || !/^\+?[0-9 ]{9,15}$/.test(phone) || !address)
    return Response.json({ error: "Please enter your name, a valid phone number and delivery location." }, { status: 400 });

  // Rebuild items and total on the server so prices can't be tampered with
  const items = [];
  for (const i of Array.isArray(b.items) ? b.items.slice(0, 30) : []) {
    const p = products.find((x) => x.id === i.id);
    const qty = Math.floor(Number(i.qty));
    if (p && qty > 0 && qty <= 50) items.push({ id: p.id, name: p.name, price: p.price, qty });
  }
  if (!items.length) return Response.json({ error: "Your cart is empty." }, { status: 400 });

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const id = "ORD-" + Date.now().toString(36).toUpperCase();
  const order = { id, name, phone, address, notes, items, total, status: "new", createdAt: new Date().toISOString() };
  await getStore("orders").setJSON(id, order);

  return Response.json({ id, total });
};
export const config = { path: "/api/order" };
