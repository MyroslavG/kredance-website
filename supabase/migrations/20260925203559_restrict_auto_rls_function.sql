-- The dashboard's automatic-RLS helper is an event trigger, not a public API.
-- Preserve automatic RLS while removing unnecessary direct execution grants.
do $migration$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end;
$migration$;
