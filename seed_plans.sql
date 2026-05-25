-- Seed script: Cut & Bulk plans — current week + previous week
-- Run this in your Supabase SQL Editor

-- =============================================
-- PLANS
-- =============================================
INSERT INTO published_weekly_plans (id, name, category, description, weekly_price, is_published, week_start_date)
VALUES 
  -- Current week (May 25 - 29)
  (md5('plan-cut-curr')::uuid,  'Cut — May 25',  'Cutting', 'Lean Filipino recipes designed for a calorie deficit while keeping protein high.', 149.99, true, '2026-05-25'),
  (md5('plan-bulk-curr')::uuid, 'Bulk — May 25', 'Bulking', 'High-calorie Filipino-inspired meals engineered for muscle gain.', 179.99, true, '2026-05-25'),
  -- Previous week (May 18 - 22)
  (md5('plan-cut-prev')::uuid,  'Cut — May 18',  'Cutting', 'Lean Filipino recipes designed for a calorie deficit while keeping protein high.', 149.99, true, '2026-05-18'),
  (md5('plan-bulk-prev')::uuid, 'Bulk — May 18', 'Bulking', 'High-calorie Filipino-inspired meals engineered for muscle gain.', 179.99, true, '2026-05-18')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- CUT — CURRENT WEEK (May 25 - 29)
-- Lean Filipino recipes, ~400-550 kcal per meal
-- =============================================
INSERT INTO weekly_plan_meals (id, plan_id, day_of_week, meal_name, calories, protein_g, carbs_g, fats_g)
VALUES 
  -- MONDAY
  (md5('cc-mon-1')::uuid, md5('plan-cut-curr')::uuid, 'Monday', 'Grilled Tilapia with Pinakbet',       420, 40, 30, 12),
  (md5('cc-mon-2')::uuid, md5('plan-cut-curr')::uuid, 'Monday', 'Chicken Tinola (No Rice)',             380, 38, 18,  9),
  (md5('cc-mon-3')::uuid, md5('plan-cut-curr')::uuid, 'Monday', 'Tokwa''t Kamatis Salad',              310, 22, 20, 14),
  -- TUESDAY
  (md5('cc-tue-1')::uuid, md5('plan-cut-curr')::uuid, 'Tuesday', 'Sinigang na Bangus (Soup Only)',      360, 35, 22, 10),
  (md5('cc-tue-2')::uuid, md5('plan-cut-curr')::uuid, 'Tuesday', 'Chicken Adobo on Cauliflower Rice',  450, 42, 20, 16),
  (md5('cc-tue-3')::uuid, md5('plan-cut-curr')::uuid, 'Tuesday', 'Ensaladang Talong with Tinapa',      290, 18, 15, 13),
  -- WEDNESDAY
  (md5('cc-wed-1')::uuid, md5('plan-cut-curr')::uuid, 'Wednesday', 'Ginisang Sayote with Pork Strips', 380, 30, 25, 14),
  (md5('cc-wed-2')::uuid, md5('plan-cut-curr')::uuid, 'Wednesday', 'Steamed Lapu-Lapu with Ginger',    410, 45, 10, 12),
  (md5('cc-wed-3')::uuid, md5('plan-cut-curr')::uuid, 'Wednesday', 'Monggo Soup with Malunggay',       340, 22, 38,  7),
  -- THURSDAY
  (md5('cc-thu-1')::uuid, md5('plan-cut-curr')::uuid, 'Thursday', 'Chicken Tinola with Brown Rice',    440, 38, 40, 10),
  (md5('cc-thu-2')::uuid, md5('plan-cut-curr')::uuid, 'Thursday', 'Grilled Pork Belly (Lean Cut)',     480, 40, 10, 25),
  (md5('cc-thu-3')::uuid, md5('plan-cut-curr')::uuid, 'Thursday', 'Lumpiang Sariwa (No Wrapper)',      300, 18, 22, 10),
  -- FRIDAY
  (md5('cc-fri-1')::uuid, md5('plan-cut-curr')::uuid, 'Friday', 'Sinampalukang Manok',                 390, 36, 20, 12),
  (md5('cc-fri-2')::uuid, md5('plan-cut-curr')::uuid, 'Friday', 'Grilled Bangus with Atchara',         430, 42, 15, 16),
  (md5('cc-fri-3')::uuid, md5('plan-cut-curr')::uuid, 'Friday', 'Kangkong with Garlic and Tokwa',      280, 20, 18, 10)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- BULK — CURRENT WEEK (May 25 - 29)
-- ~700-900 kcal per meal, high carb + protein
-- =============================================
INSERT INTO weekly_plan_meals (id, plan_id, day_of_week, meal_name, calories, protein_g, carbs_g, fats_g)
VALUES 
  (md5('bc-mon-1')::uuid, md5('plan-bulk-curr')::uuid, 'Monday', 'Beef Caldereta on White Rice',        820, 55, 90, 24),
  (md5('bc-mon-2')::uuid, md5('plan-bulk-curr')::uuid, 'Monday', 'Chicken Inasal with Garlic Rice',     780, 60, 85, 20),
  (md5('bc-tue-1')::uuid, md5('plan-bulk-curr')::uuid, 'Tuesday', 'Pork Sinigang with Rice',            850, 50, 95, 22),
  (md5('bc-tue-2')::uuid, md5('plan-bulk-curr')::uuid, 'Tuesday', 'Longganisa with Fried Egg & Rice',   900, 45, 100, 30),
  (md5('bc-wed-1')::uuid, md5('plan-bulk-curr')::uuid, 'Wednesday', 'Kare-Kare with Bagoong & Rice',    870, 52, 88, 28),
  (md5('bc-wed-2')::uuid, md5('plan-bulk-curr')::uuid, 'Wednesday', 'Tapsilog (Beef Tapa + Sinangag)', 830, 48, 92, 26),
  (md5('bc-thu-1')::uuid, md5('plan-bulk-curr')::uuid, 'Thursday', 'Lechon Kawali with Java Rice',      920, 50, 95, 35),
  (md5('bc-thu-2')::uuid, md5('plan-bulk-curr')::uuid, 'Thursday', 'Bistek Tagalog on White Rice',      800, 55, 85, 22),
  (md5('bc-fri-1')::uuid, md5('plan-bulk-curr')::uuid, 'Friday', 'Crispy Pata with Pancit Canton',      950, 55, 100, 38),
  (md5('bc-fri-2')::uuid, md5('plan-bulk-curr')::uuid, 'Friday', 'Bulalo with Corn on Brown Rice',      880, 58, 90, 28)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- CUT — PREVIOUS WEEK (May 18 - 22)
-- =============================================
INSERT INTO weekly_plan_meals (id, plan_id, day_of_week, meal_name, calories, protein_g, carbs_g, fats_g)
VALUES 
  (md5('cp-mon-1')::uuid, md5('plan-cut-prev')::uuid, 'Monday', 'Nilagang Manok (Soup Only)',           370, 36, 18, 10),
  (md5('cp-mon-2')::uuid, md5('plan-cut-prev')::uuid, 'Monday', 'Grilled Galunggong with Ensalada',     400, 38, 15, 14),
  (md5('cp-tue-1')::uuid, md5('plan-cut-prev')::uuid, 'Tuesday', 'Sinigang na Hipon (Soup)',            350, 32, 20,  9),
  (md5('cp-tue-2')::uuid, md5('plan-cut-prev')::uuid, 'Tuesday', 'Steamed Fish in Tausi Sauce',         420, 40, 18, 12),
  (md5('cp-wed-1')::uuid, md5('plan-cut-prev')::uuid, 'Wednesday', 'Arroz Caldo (Light)',               400, 28, 50,  8),
  (md5('cp-wed-2')::uuid, md5('plan-cut-prev')::uuid, 'Wednesday', 'Chicken Afritada (No Potato)',      460, 42, 22, 15),
  (md5('cp-thu-1')::uuid, md5('plan-cut-prev')::uuid, 'Thursday', 'Ginisang Upo with Ground Turkey',    380, 32, 24, 12),
  (md5('cp-thu-2')::uuid, md5('plan-cut-prev')::uuid, 'Thursday', 'Grilled Pusit with Tomato Salsa',   390, 38, 14, 14),
  (md5('cp-fri-1')::uuid, md5('plan-cut-prev')::uuid, 'Friday', 'Binagoongang Baboy (Lean) w/ Rice',   480, 38, 40, 18),
  (md5('cp-fri-2')::uuid, md5('plan-cut-prev')::uuid, 'Friday', 'Tokwa Adobo with Brown Rice',          400, 28, 40, 12)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- BULK — PREVIOUS WEEK (May 18 - 22)
-- =============================================
INSERT INTO weekly_plan_meals (id, plan_id, day_of_week, meal_name, calories, protein_g, carbs_g, fats_g)
VALUES 
  (md5('bp-mon-1')::uuid, md5('plan-bulk-prev')::uuid, 'Monday', 'Dinuguan with Puto',                  800, 45, 85, 30),
  (md5('bp-mon-2')::uuid, md5('plan-bulk-prev')::uuid, 'Monday', 'Pork Menudo on White Rice',           850, 50, 90, 28),
  (md5('bp-tue-1')::uuid, md5('plan-bulk-prev')::uuid, 'Tuesday', 'Beef Mechado with Rice',             820, 52, 88, 24),
  (md5('bp-tue-2')::uuid, md5('plan-bulk-prev')::uuid, 'Tuesday', 'Sisig with Garlic Rice & Egg',       900, 48, 90, 35),
  (md5('bp-wed-1')::uuid, md5('plan-bulk-prev')::uuid, 'Wednesday', 'Pork Humba on White Rice',         870, 50, 92, 28),
  (md5('bp-wed-2')::uuid, md5('plan-bulk-prev')::uuid, 'Wednesday', 'Chicken Pastel on Rice',           830, 48, 88, 26),
  (md5('bp-thu-1')::uuid, md5('plan-bulk-prev')::uuid, 'Thursday', 'Goto with Chicharron',              780, 42, 88, 22),
  (md5('bp-thu-2')::uuid, md5('plan-bulk-prev')::uuid, 'Thursday', 'Pork Adobo Flakes with Java Rice', 860, 48, 92, 30),
  (md5('bp-fri-1')::uuid, md5('plan-bulk-prev')::uuid, 'Friday', 'Pancit Palabok with Chicharon',       850, 45, 98, 25),
  (md5('bp-fri-2')::uuid, md5('plan-bulk-prev')::uuid, 'Friday', 'Chicken Curry with Rice',             800, 50, 85, 24)
ON CONFLICT (id) DO NOTHING;
