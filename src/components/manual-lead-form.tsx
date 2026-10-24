"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { manualSources } from "@/lib/engagement/lead-record";
import { serviceOptions } from "@/lib/engagement/shared";

const field = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900";
function localNow() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}
export function ManualLeadForm({ close, saved }: { close: () => void; saved: (name: string) => Promise<void> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const submissionId = useRef<string | undefined>(undefined);
  const pending = useRef<{ body: string; name: string } | null>(null);
  const inFlight = useRef(false);
  const [received] = useState(localNow);
  const [busy, setBusy] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { dialog.current?.showModal(); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      submissionId.current ??= crypto.randomUUID();
      pending.current ??= {
        name: String(form.get("name")),
        body: JSON.stringify({
          submissionId: submissionId.current, name: form.get("name"), business_name: form.get("business_name"),
          email: form.get("email"), contact_detail: form.get("contact_detail"), entry_channel: form.get("entry_channel"),
          website: form.get("website"), service: form.get("service"), problem: form.get("problem"), next_action: form.get("next_action"),
          received_at: new Date(String(form.get("received_at"))).toISOString(),
        }),
      };
      const response = await fetch("/api/dashboard", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(20_000),
        body: pending.current.body,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.id) {
        if ([400, 422].includes(response.status)) {
          submissionId.current = undefined;
          pending.current = null;
        }
        throw new Error(result.error || "We couldn’t confirm the enquiry was saved. Please try again.");
      }
      await saved(pending.current!.name);
    } catch (cause) {
      setUncertain(pending.current !== null);
      setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "We couldn’t confirm the save. Retry without changing the details to avoid a duplicate.");
    } finally { inFlight.current = false; setBusy(false); }
  }
  return <dialog ref={dialog} aria-labelledby="manual-lead-heading" onCancel={event => { if (busy) event.preventDefault(); else close(); }}
    className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none overflow-y-auto bg-slate-950/70 p-4 sm:p-10" data-clarity-mask="true">
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 text-slate-900 sm:p-8">
      <div className="flex items-start justify-between gap-4"><h2 id="manual-lead-heading" className="text-2xl font-semibold">Add an enquiry</h2><button onClick={close} disabled={busy} className="underline disabled:opacity-50">Close</button></div>
      <p className="mt-3 text-sm text-slate-600">Record someone who has expressed interest in working with Kredance. Saving adds a follow-up task; it does not send a message.</p>
      <form onSubmit={submit} className="mt-6 space-y-4"><fieldset disabled={busy || uncertain} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">Contact name<input name="name" required minLength={2} maxLength={100} className={field} autoComplete="off" /></label>
          <label className="text-sm">Business <span className="text-slate-500">(optional)</span><input name="business_name" maxLength={150} className={field} autoComplete="off" /></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">Source<select name="entry_channel" defaultValue="referral" className={field}>{manualSources.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
          <label className="text-sm">Received<input name="received_at" type="datetime-local" defaultValue={received} required className={field} /></label>
        </div>
        <div className="rounded-lg bg-slate-50 p-4"><p className="mb-3 text-sm text-slate-600">Add an email or another way to contact them.</p><div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">Email<input name="email" type="email" maxLength={254} className={field} autoComplete="off" /></label>
          <label className="text-sm">Other contact details<input name="contact_detail" maxLength={300} placeholder="Phone number or social profile" className={field} /></label>
        </div></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">Website <span className="text-slate-500">(optional)</span><input name="website" maxLength={500} inputMode="url" placeholder="example.ca" className={field} /></label>
          <label className="text-sm">Service<select name="service" defaultValue="" className={field}><option value="">Not yet decided</option>{serviceOptions.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        </div>
        <label className="block text-sm">What are they interested in?<textarea name="problem" required minLength={10} maxLength={2000} rows={3} className={field} /></label>
        <label className="block text-sm">Next action<input name="next_action" defaultValue="Follow up about the enquiry" required minLength={2} maxLength={500} className={field} /></label>
        <p className="text-xs text-slate-500">The first follow-up falls on the next weekday at the same time in Toronto. Edit it after saving for holidays or time off. The received time uses your browser’s time zone.</p>
      </fieldset>
        {uncertain && <p className="text-sm text-slate-600">The save has not been confirmed. Retry the same request below before changing any details.</p>}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="rounded-lg bg-neon-navy px-5 py-3 text-sm font-medium text-white disabled:opacity-50">{busy ? "Saving…" : uncertain ? "Retry save" : "Add enquiry"}</button>
      </form>
    </div>
  </dialog>;
}
