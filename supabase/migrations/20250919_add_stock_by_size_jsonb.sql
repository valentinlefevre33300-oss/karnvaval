-- Add per-size stock JSONB column to products
alter table if exists public.products
  add column if not exists stock_by_size jsonb;

comment on column public.products.stock_by_size is
  'Per-size stock map, e.g. {"38":10, "39":5}. Keys are sizes, values are quantities.';

-- Useful index for querying by keys/values
create index if not exists products_stock_by_size_gin
  on public.products using gin (stock_by_size);


