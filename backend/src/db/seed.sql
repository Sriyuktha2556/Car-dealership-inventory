-- Demo/development seed data. Not for production use.
-- Vehicles are deliberately chosen to demonstrate normal, low, and out-of-stock states.

DELETE FROM vehicles;

INSERT INTO vehicles (make, model, category, price, quantity) VALUES
  ('Toyota',    'Camry',      'Sedan',     28500.00, 8),
  ('Honda',     'Civic',      'Sedan',     24900.00, 5),
  ('Ford',      'Explorer',   'SUV',       38700.00, 3),
  ('Toyota',    'RAV4',       'SUV',       31200.00, 1),
  ('Chevrolet', 'Bolt',       'Hatchback', 27400.00, 0),
  ('Mazda',     'Miata',      'Coupe',     29800.00, 2),
  ('Ford',      'F-150',      'Truck',     45300.00, 6),
  ('Ram',       '1500',       'Truck',     46800.00, 0),
  ('Subaru',    'Outback',    'SUV',       33100.00, 4),
  ('Hyundai',   'Elantra',    'Sedan',     22600.00, 10);
