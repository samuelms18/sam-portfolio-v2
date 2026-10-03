'use client';

import { useState, type FormEvent } from 'react';

type Status = { kind: 'idle' | 'sending' | 'ok' | 'error'; text: string };

/**
 * Sends through Web3Forms (free) when NEXT_PUBLIC_WEB3FORMS_KEY is set.
 * Without a key it opens an email draft to `email` instead.
 */
export function ContactForm({ email }: { email: string }) {
  const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  const [status, setStatus] = useState<Status>({ kind: 'idle', text: '' });
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const bad = {
      name: !data.name?.trim(),
      email: !/^\S+@\S+\.\S+$/.test(data.email ?? ''),
      message: !data.message?.trim(),
    };
    setInvalid(bad);
    if (bad.name || bad.email || bad.message) {
      setStatus({ kind: 'error', text: 'Please add your name, a valid email and a message.' });
      return;
    }
    if (key) {
      setStatus({ kind: 'sending', text: 'Sending…' });
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ access_key: key, subject: `Portfolio enquiry from ${data.name}`, ...data }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        form.reset();
        setStatus({ kind: 'ok', text: "Thanks — your message is on its way. I'll reply soon." });
      } catch {
        setStatus({ kind: 'error', text: `That didn't send. Please try again, or email ${email}.` });
      }
      return;
    }
    const body = `${data.message}\n\n— ${data.name} (${data.email})`;
    location.href = `mailto:${email}?subject=${encodeURIComponent(`Portfolio enquiry from ${data.name}`)}&body=${encodeURIComponent(body)}`;
    setStatus({ kind: 'ok', text: 'Opening your email app…' });
  };

  const field = 'w-full border-0 border-b border-[var(--glass-line)] bg-transparent py-3 text-[var(--text)] outline-none transition-colors focus:border-[var(--teal)] aria-[invalid=true]:border-[var(--coral)]';
  const label = 'mono';

  return (
    <form onSubmit={onSubmit} noValidate className="glass grid gap-6 rounded-[28px] p-6 md:p-10">
      <label className="grid gap-2" htmlFor="cf-name">
        <span className={label}>Name</span>
        <input id="cf-name" name="name" autoComplete="name" className={field} aria-invalid={invalid.name || undefined} />
      </label>
      <label className="grid gap-2" htmlFor="cf-email">
        <span className={label}>Email</span>
        <input id="cf-email" name="email" type="email" autoComplete="email" className={field} aria-invalid={invalid.email || undefined} />
      </label>
      <label className="grid gap-2" htmlFor="cf-message">
        <span className={label}>Message</span>
        <textarea id="cf-message" name="message" rows={5} className={`${field} resize-y`} aria-invalid={invalid.message || undefined} />
      </label>
      <button type="submit" disabled={status.kind === 'sending'} className="btn btn-primary justify-self-start disabled:opacity-60">
        Send message →
      </button>
      <p role="status" aria-live="polite" className={`min-h-6 text-sm ${status.kind === 'error' ? 'text-[var(--coral)]' : status.kind === 'ok' ? 'text-[var(--teal)]' : 'text-[var(--muted)]'}`}>
        {status.text}
      </p>
    </form>
  );
}
