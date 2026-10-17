"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { leadStatuses, serviceLabel } from "@/lib/engagement/shared";

type Lead = {
  id: string;
  name: string;
  email: string;
  website: string;
  problem: string;
  offer: string;
  service: string;
  subject: string;
  status: string;
  qualified: boolean;
  deal_value: number | null;
  notes: string;
  next_action: string;
  next_action_at: string;
  created_at: string;
  updated_at: string;
  attribution: {
    landingPath?: string;
    referrerHost?: string;
    utm?: Record<string, string>;
  };
};
type Report = {
  leads: Lead[];
  followups: Lead[];
  leadTotal: number;
  overdue: number;
  emailAttention: number;
  outcomes: { qualified: number; won: number; value: number };
  events: { event_name: string; count: number; sessions: number }[];
  pages: { page: string; views: number; sessions: number }[];
  sources: { source: string; sessions: number; leads: number }[];
  services: { service: string; clicks: number; leads: number }[];
  campaigns: {
    campaign: string;
    source: string;
    leads: number;
    qualified: number;
    won: number;
    value: number;
  }[];
};
const field =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900";
const button =
  "rounded-lg bg-neon-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-50";
const money = (value: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
function date(value: string) {
  return new Date(value).toLocaleString();
}
function localDate(value: string) {
  const time = new Date(value);
  return new Date(time.getTime() - time.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
async function api(path: string, options?: RequestInit) {
  const response = await fetch(path, { cache: "no-store", ...options });
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw Object.assign(new Error(result.error || "Please try again."), {
      status: response.status,
    });
  return result;
}
const post = (body: unknown): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export function LeadDashboard() {
  const [report, setReport] = useState<Report | null>(null);
  const [days, setDays] = useState(30);
  const [auth, setAuth] = useState<"loading" | "email" | "code" | "ready">(
    "loading",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const refresh = useCallback(async () => {
    try {
      const data = await api(`/api/dashboard?days=${days}`);
      setReport(data);
      setAuth("ready");
      setError("");
    } catch (cause) {
      if ((cause as { status?: number }).status === 401) {
        setAuth("email");
        setReport(null);
        setSelected(null);
      } else {
        setError((cause as Error).message);
      }
    }
  }, [days]);
  useEffect(() => {
    let active = true;
    api(`/api/dashboard?days=${days}`)
      .then((data) => {
        if (active) {
          setReport(data);
          setAuth("ready");
          setError("");
        }
      })
      .catch((cause) => {
        if (!active) return;
        if (cause.status === 401) {
          setAuth("email");
          setReport(null);
          setSelected(null);
        } else setError(cause.message);
      });
    return () => {
      active = false;
    };
  }, [days]);
  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await api(
        "/api/dashboard/auth",
        post(
          auth === "code"
            ? { action: "verify", code: form.get("code") }
            : { action: "request", email: form.get("email") },
        ),
      );
      if (auth === "code") await refresh();
      else setAuth("code");
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    try {
      await api("/api/dashboard/auth", post({ action: "logout" }));
      setReport(null);
      setSelected(null);
      setAuth("email");
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const metric = (event: string, key: "count" | "sessions" = "count") =>
    report?.events.find((item) => item.event_name === event)?.[key] || 0;
  const leads =
    (view === "overdue" ? report?.followups : report?.leads)?.filter(
      (lead) =>
        (view === "all" || view === "overdue" || lead.status === view) &&
        `${lead.name} ${lead.email} ${lead.subject} ${lead.service}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    ) || [];
  return (
    <section
      data-clarity-mask="true"
      className="min-h-screen bg-slate-50 px-5 pt-28 pb-20 text-slate-900"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Private workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              Kredance leads & engagement
            </h1>
          </div>
          {auth === "ready" && (
            <div className="flex items-center gap-3">
              <label className="text-sm">
                Period
                <select
                  aria-label="Report period"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className={field}
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
              </label>
              <button className={button} onClick={() => void refresh()}>
                Refresh
              </button>
              <button
                disabled={busy}
                onClick={() => void logout()}
                className="text-sm underline"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl bg-red-50 p-4 text-red-900"
          >
            {error}{" "}
            <button className="underline" onClick={() => void refresh()}>
              Reload
            </button>
          </p>
        )}
        {auth === "loading" && <p className="mt-10">Checking your session…</p>}
        {(auth === "email" || auth === "code") && (
          <form
            onSubmit={signIn}
            className="mt-10 max-w-md rounded-2xl border bg-white p-7"
          >
            <h2 className="text-xl font-semibold">Owner sign-in</h2>
            <p className="mt-3 text-sm text-slate-600">
              {auth === "email"
                ? "A one-time code will be sent to the configured owner’s notification inbox."
                : "If the address matches the owner, a code has been sent. Enter it here within 10 minutes."}
            </p>
            {auth === "email" ? (
              <label className="mt-5 block text-sm">
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={field}
                />
              </label>
            ) : (
              <label className="mt-5 block text-sm">
                Eight-digit code
                <input
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{8}"
                  maxLength={8}
                  required
                  className={field}
                />
              </label>
            )}
            <button disabled={busy} className={`${button} mt-5`}>
              {busy
                ? "Please wait…"
                : auth === "email"
                  ? "Send sign-in code"
                  : "Open dashboard"}
            </button>
            {auth === "code" && (
              <button
                type="button"
                onClick={() => setAuth("email")}
                className="ml-4 text-sm underline"
              >
                Request another code
              </button>
            )}
          </form>
        )}
        {report && auth === "ready" && (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                ["Consented visits", metric("page_view", "sessions")],
                ["Saved inquiries", report.leadTotal],
                ["Qualified inquiries", report.outcomes.qualified],
                ["Won value (CAD)", money(report.outcomes.value)],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="rounded-xl border bg-white p-5"
                >
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-3xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Visits count consenting browser-tab sessions, not unique people.
              Leads include all saved inquiries. Qualified/won figures describe
              inquiries created in the selected period; value is your entered
              estimate. Setup tests are excluded. Historical visits are
              unavailable.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              <button
                onClick={() => setView("overdue")}
                className="rounded-lg border bg-amber-50 px-4 py-3 text-amber-900"
              >
                {report.overdue} overdue follow-ups · all dates
              </button>
              <p className="rounded-lg border bg-white px-4 py-3">
                {report.emailAttention} notifications awaiting delivery or
                review
              </p>
              <p className="rounded-lg border bg-white px-4 py-3">
                {report.outcomes.won} won · {metric("form_error")} form errors
              </p>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <Panel title="Engagement steps">
                <Rows
                  headers={["Action", "Events", "Visits"]}
                  rows={report.events.map((e) => [
                    e.event_name.replaceAll("_", " "),
                    e.count,
                    e.sessions,
                  ])}
                />
                <p className="mt-3 text-xs text-slate-500">
                  Independent event counts, not an ordered conversion funnel. A
                  saved lead is recorded by the server only after storage
                  succeeds.
                </p>
              </Panel>
              <Panel title="Traffic sources since tracking began">
                <Rows
                  headers={["Source", "Visits", "New leads"]}
                  rows={report.sources.map((s) => [
                    s.source,
                    s.sessions,
                    s.leads,
                  ])}
                />
              </Panel>
              <Panel title="Most viewed pages">
                <Rows
                  headers={["Page", "Views", "Visits"]}
                  rows={report.pages.map((p) => [p.page, p.views, p.sessions])}
                />
              </Panel>
              <Panel title="Service interest">
                <Rows
                  headers={["Service", "Card clicks", "New leads"]}
                  rows={report.services.map((s) => [
                    serviceLabel(s.service),
                    s.clicks,
                    s.leads,
                  ])}
                />
              </Panel>
            </div>
            <div className="mt-6">
              <Panel title="Campaign results">
                <Rows
                  headers={[
                    "Campaign / source",
                    "Leads",
                    "Qualified",
                    "Won",
                    "Value CAD",
                  ]}
                  rows={report.campaigns.map((c) => [
                    `${c.campaign} / ${c.source}`,
                    c.leads,
                    c.qualified,
                    c.won,
                    money(c.value),
                  ])}
                />
              </Panel>
            </div>
            <section className="mt-10">
              <h2 className="text-2xl font-semibold">Follow up with leads</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <input
                  aria-label="Search leads"
                  placeholder="Search name, email, or service"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${field} max-w-sm`}
                />
                <select
                  aria-label="Filter leads"
                  value={view}
                  onChange={(e) => setView(e.target.value)}
                  className={`${field} max-w-xs`}
                >
                  <option value="all">All statuses</option>
                  <option value="overdue">Overdue · all dates</option>
                  {leadStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Showing up to 500{" "}
                {view === "overdue"
                  ? "oldest overdue inquiries across all dates"
                  : "most recent inquiries in this period"}
                . Follow-up times use your browser’s time zone.
              </p>
              <div className="mt-4 space-y-3">
                {leads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className="block w-full rounded-xl border bg-white p-5 text-left hover:border-slate-400"
                  >
                    <div className="flex flex-wrap justify-between gap-2">
                      <strong>
                        {lead.name} · {serviceLabel(lead.service)}
                      </strong>
                      <span className="text-sm">
                        {lead.status.replaceAll("_", " ")}
                        {lead.qualified ? " · qualified" : ""}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {lead.subject} · {lead.email}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Received {date(lead.created_at)} · Next:{" "}
                      {lead.next_action} — {date(lead.next_action_at)}
                    </p>
                  </button>
                ))}
                {!leads.length && (
                  <p className="rounded-xl border bg-white p-6 text-slate-600">
                    No inquiries match this view.
                  </p>
                )}
              </div>
            </section>
            {selected && (
              <LeadEditor
                key={selected.id + selected.updated_at}
                lead={selected}
                close={() => setSelected(null)}
                saved={async () => {
                  setSelected(null);
                  await refresh();
                }}
              />
            )}
            <div className="mt-10">
              <CampaignBuilder />
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm">
              <a
                href="https://clarity.microsoft.com/projects"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Open Clarity recordings and heatmaps
              </a>
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Open Google Search Console
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Each week: review form errors, work through overdue leads, and
              compare qualified inquiries by campaign. Change one page or offer
              at a time, then compare the next period.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
function Rows({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="border-b pb-3 pr-4 font-medium text-slate-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((v, j) => (
                <td
                  key={j}
                  className="border-b border-slate-100 py-3 pr-4 break-words"
                >
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && (
        <p className="py-5 text-sm text-slate-500">
          No data in this period yet.
        </p>
      )}
    </div>
  );
}

function LeadEditor({
  lead,
  close,
  saved,
}: {
  lead: Lead;
  close: () => void;
  saved: () => Promise<void>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await api("/api/dashboard", {
        ...post({
          id: lead.id,
          updated_at: lead.updated_at,
          status: form.get("status"),
          qualified: form.get("qualified") === "on",
          deal_value: form.get("value"),
          notes: form.get("notes"),
          next_action: form.get("next_action"),
          next_action_at: new Date(
            String(form.get("next_action_at")),
          ).toISOString(),
        }),
        method: "PATCH",
      });
      await saved();
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      onCancel={close}
      aria-labelledby="lead-editor-heading"
      className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none overflow-y-auto bg-slate-950/70 p-4 sm:p-10"
    >
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 sm:p-8">
        <div className="flex justify-between gap-3">
          <h2 id="lead-editor-heading" className="text-2xl font-semibold">
            {lead.name}
          </h2>
          <button onClick={close} className="underline">
            Close
          </button>
        </div>
        <a className="mt-3 block underline" href={`mailto:${lead.email}`}>
          {lead.email}
        </a>
        {lead.website && (
          <a
            href={lead.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block break-all underline"
          >
            {lead.website}
          </a>
        )}
        <p className="mt-5 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm">
          {lead.problem}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {lead.offer} · Entry {lead.attribution.landingPath || "unknown"} ·
          Source{" "}
          {lead.attribution.utm?.utm_source ||
            lead.attribution.referrerHost ||
            "direct / unknown"}{" "}
          · Campaign {lead.attribution.utm?.utm_campaign || "untagged"}
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm">
              Status
              <select
                name="status"
                defaultValue={lead.status}
                className={field}
              >
                {leadStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Deal value (CAD)
              <input
                name="value"
                type="number"
                min="0"
                max="9999999999.99"
                step="0.01"
                defaultValue={lead.deal_value ?? ""}
                className={field}
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              name="qualified"
              type="checkbox"
              defaultChecked={lead.qualified}
            />
            Qualified: a real fit for Kredance
          </label>
          <label className="block text-sm">
            Next action
            <input
              name="next_action"
              defaultValue={lead.next_action}
              maxLength={500}
              className={field}
            />
          </label>
          <label className="block text-sm">
            Follow-up date and time
            <input
              name="next_action_at"
              type="datetime-local"
              defaultValue={localDate(lead.next_action_at)}
              required
              className={field}
            />
          </label>
          <label className="block text-sm">
            Private notes
            <textarea
              name="notes"
              defaultValue={lead.notes}
              maxLength={4000}
              rows={4}
              className={field}
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <button disabled={busy} className={button}>
            {busy ? "Saving…" : "Save lead"}
          </button>
        </form>
      </div>
    </dialog>
  );
}

function CampaignBuilder() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    try {
      const target = new URL(String(form.get("destination")));
      if (target.origin !== "https://www.kredance.com")
        throw new Error("Use a https://www.kredance.com page.");
      target.search = "";
      target.hash = "";
      for (const key of ["source", "medium", "campaign"]) {
        const value = String(form.get(key)).trim();
        if (!/^[a-zA-Z0-9 _.-]{1,100}$/.test(value))
          throw new Error(
            "Use short campaign labels with letters, numbers, spaces, dots, dashes, or underscores.",
          );
        target.searchParams.set(`utm_${key}`, value);
      }
      setUrl(target.toString());
    } catch (cause) {
      setError((cause as Error).message);
    }
  }
  return (
    <Panel title="Create a campaign link">
      <p className="mb-4 text-sm text-slate-600">
        Use a separate link for LinkedIn, Google, email, or a specific campaign.
        Never put a person’s name or email in tracking labels.
      </p>
      <form onSubmit={create} className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          Destination page
          <input
            name="destination"
            type="url"
            defaultValue="https://www.kredance.com/websites-for-contractors"
            required
            className={field}
          />
        </label>
        {["source", "medium", "campaign"].map((key) => (
          <label className="text-sm capitalize" key={key}>
            {key}
            <input
              name={key}
              placeholder={
                {
                  source: "linkedin",
                  medium: "social",
                  campaign: "contractors-ottawa",
                }[key]
              }
              required
              maxLength={100}
              className={field}
            />
          </label>
        ))}
        <button className={`${button} justify-self-start`}>
          Generate link
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-3 text-red-700">
          {error}
        </p>
      )}
      {url && (
        <label className="mt-4 block text-sm">
          Copy this link
          <input
            readOnly
            value={url}
            onFocus={(e) => e.target.select()}
            className={field}
          />
        </label>
      )}
    </Panel>
  );
}
