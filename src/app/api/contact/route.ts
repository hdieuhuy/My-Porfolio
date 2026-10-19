import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  if (Number(request.headers.get('content-length') || 0) > 12000) return NextResponse.json({error:'Message is too large.'},{status:413});
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({error:'Invalid origin.'},{status:403});
  try {
    const raw = await request.text();
    if (raw.length > 12000) return NextResponse.json({error:'Message is too large.'},{status:413});
    const data = JSON.parse(raw);
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const email = typeof data.email === 'string' ? data.email.trim() : '';
    const message = typeof data.message === 'string' ? data.message.trim() : '';
    if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || message.length < 10 || message.length > 5000) return NextResponse.json({error:'Please enter your name, a valid email and a message of 10–5,000 characters.'},{status:400});
    const webhook = process.env.CONTACT_WEBHOOK_URL;
    if (!webhook) return NextResponse.json({error:'Contact delivery is not connected yet. Please try again later.'},{status:503});
    if (new URL(webhook).protocol !== 'https:') throw new Error('Invalid configuration');
    const result = await fetch(webhook,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,message}),signal:AbortSignal.timeout(10000)});
    if (!result.ok) throw new Error('Delivery failed');
    return NextResponse.json({success:true});
  } catch { return NextResponse.json({error:'Unable to send your message. Please try again.'},{status:400}); }
}
