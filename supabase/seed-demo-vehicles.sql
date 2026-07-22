-- Optional: insert sample vehicles into Supabase (run after schema.sql)
-- Uses bundled site images (/images/...) so photos always load on your domain.
-- Or use Admin → "Load demo cars" while signed in (same data).

insert into public.vehicles (name, make, model, year, category, package, daily_rate, seats, transmission, image_url)
values
  ('Gold Camry', 'Toyota', 'Camry XSE', 2024, 'sedan', 'gold', 79, 5, 'automatic', '/images/luxury-sedan.jpg'),
  ('', 'BMW', '330i', 2023, 'sedan', 'gold', 89, 5, 'automatic', '/images/sedan.jpg'),
  ('', 'Mercedes-Benz', 'GLC 300', 2023, 'suv', 'gold', 99, 5, 'automatic', '/images/luxury-suv.jpg'),
  ('', 'Lexus', 'RX 350', 2024, 'suv', 'gold', 105, 5, 'automatic', '/images/suv.jpg'),
  ('Silver Civic', 'Honda', 'Civic', 2022, 'economy', 'silver', 49, 5, 'automatic', '/images/economy.jpg'),
  ('', 'Toyota', 'Corolla', 2021, 'economy', 'silver', 45, 5, 'automatic', '/images/compact.jpg'),
  ('', 'Nissan', 'Altima', 2022, 'sedan', 'silver', 55, 5, 'automatic', '/images/sedan.jpg'),
  ('', 'Hyundai', 'Tucson', 2022, 'suv', 'silver', 65, 5, 'automatic', '/images/suv.jpg'),
  ('', 'Ford', 'F-150', 2020, 'truck', 'silver', 75, 5, 'automatic', '/images/truck.jpg'),
  ('', 'Chrysler', 'Pacifica', 2021, 'van', 'silver', 72, 7, 'automatic', '/images/road-trip.jpg');
