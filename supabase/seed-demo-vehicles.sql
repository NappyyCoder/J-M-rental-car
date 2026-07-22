-- J&M fleet seed (run in Supabase SQL Editor after schema.sql)
-- Photos live at /images/fleet/* on the deployed site.
-- Or sign in at /admin → "Load fleet cars" (clears existing fleet first when using the script).

delete from public.vehicle_unavailable_dates;
delete from public.vehicles;

insert into public.vehicles (name, make, model, year, category, package, daily_rate, seats, transmission, image_url)
values
  ('Audi A8', 'Audi', 'A8', 2012, 'sedan', 'gold', 99, 5, 'automatic', '/images/fleet/audi-a8.jpeg'),
  ('Lincoln MKS', 'Lincoln', 'MKS', 2012, 'sedan', 'gold', 89, 5, 'automatic', '/images/fleet/lincoln-mks.jpeg'),
  ('Volvo S60', 'Volvo', 'S60', 2014, 'sedan', 'gold', 85, 5, 'automatic', '/images/fleet/volvo-s60.jpeg'),
  ('Buick LaCrosse', 'Buick', 'LaCrosse', 2013, 'sedan', 'gold', 79, 5, 'automatic', '/images/fleet/buick-lacrosse.jpeg'),
  ('Volkswagen CC', 'Volkswagen', 'CC', 2013, 'sedan', 'gold', 75, 5, 'automatic', '/images/fleet/vw-cc.jpeg'),
  ('Nissan Pathfinder', 'Nissan', 'Pathfinder', 2018, 'suv', 'silver', 69, 7, 'automatic', '/images/fleet/nissan-pathfinder-silver.jpeg'),
  ('Nissan Pathfinder', 'Nissan', 'Pathfinder', 2014, 'suv', 'silver', 65, 7, 'automatic', '/images/fleet/nissan-pathfinder-gray.jpeg'),
  ('GMC Terrain', 'GMC', 'Terrain', 2013, 'suv', 'silver', 65, 5, 'automatic', '/images/fleet/gmc-terrain.jpeg'),
  ('Chevrolet Equinox', 'Chevrolet', 'Equinox', 2012, 'suv', 'silver', 59, 5, 'automatic', '/images/fleet/chevy-equinox.jpeg'),
  ('Subaru Outback', 'Subaru', 'Outback', 2012, 'suv', 'silver', 59, 5, 'automatic', '/images/fleet/subaru-outback.jpeg'),
  ('Chevrolet Malibu', 'Chevrolet', 'Malibu', 2014, 'sedan', 'silver', 55, 5, 'automatic', '/images/fleet/chevy-malibu.jpeg'),
  ('Chevrolet Sonic', 'Chevrolet', 'Sonic', 2014, 'economy', 'silver', 45, 5, 'automatic', '/images/fleet/chevy-sonic.jpeg'),
  ('Chevrolet Cruze', 'Chevrolet', 'Cruze', 2013, 'economy', 'silver', 45, 5, 'automatic', '/images/fleet/chevy-cruze.jpeg');
