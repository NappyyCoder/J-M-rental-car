-- Optional: insert sample vehicles into Supabase (run after schema.sql)
-- Replace image URLs or upload photos via Admin after seeding.

insert into public.vehicles (name, make, model, year, category, package, daily_rate, seats, transmission, image_url)
values
  ('Gold Camry', 'Toyota', 'Camry XSE', 2024, 'sedan', 'gold', 79, 5, 'automatic',
   'https://images.unsplash.com/photo-1621007947382-bcb3c783716e?auto=format&fit=crop&w=800&q=80'),
  ('', 'BMW', '330i', 2023, 'sedan', 'gold', 89, 5, 'automatic',
   'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80'),
  ('', 'Mercedes-Benz', 'GLC 300', 2023, 'suv', 'gold', 99, 5, 'automatic',
   'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80'),
  ('', 'Lexus', 'RX 350', 2024, 'suv', 'gold', 105, 5, 'automatic',
   'https://images.unsplash.com/photo-1617814076367-b759c0d2e679?auto=format&fit=crop&w=800&q=80'),
  ('Silver Civic', 'Honda', 'Civic', 2022, 'economy', 'silver', 49, 5, 'automatic',
   'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80'),
  ('', 'Toyota', 'Corolla', 2021, 'economy', 'silver', 45, 5, 'automatic',
   'https://images.unsplash.com/photo-1590362891995-7a894922c0e5?auto=format&fit=crop&w=800&q=80'),
  ('', 'Nissan', 'Altima', 2022, 'sedan', 'silver', 55, 5, 'automatic',
   'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80'),
  ('', 'Hyundai', 'Tucson', 2022, 'suv', 'silver', 65, 5, 'automatic',
   'https://images.unsplash.com/photo-1519641471654-76ce5377cb70?auto=format&fit=crop&w=800&q=80'),
  ('', 'Ford', 'F-150', 2020, 'truck', 'silver', 75, 5, 'automatic',
   'https://images.unsplash.com/photo-1533473359331-0135ef1b58dd?auto=format&fit=crop&w=800&q=80'),
  ('', 'Chrysler', 'Pacifica', 2021, 'van', 'silver', 72, 7, 'automatic',
   'https://images.unsplash.com/photo-1527786356703-4b100181fb4a?auto=format&fit=crop&w=800&q=80');
