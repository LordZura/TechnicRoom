insert into public.products (id, slug, model, brand, category, price, recommended_area, cooling_power, heating_power, cooling_consumption, heating_consumption, eer_cop, freon_type_amount, operating_temperature, indoor_unit_size, indoor_unit_weight, outdoor_unit_size, outdoor_unit_weight, noise_level, pipe_size)
values
('11111111-1111-1111-1111-111111111111', 'asw-h09a4-far3di', 'ASW-H09A4/FAR3DI', 'AUX', 'Inverter wall split', 899, '20-35 მ²', '10571 BTU', '11594 BTU', '850(100-1600) ვატი', '630(300-1600) ვატი', '3.25 / 3.61 W/W', 'R32/460', '-10~+43 C°', '649×450×232 მმ', '7 კგ', '760×510×315 მმ', '18.5 კგ', '52-59 დბ', '6 / 9 მმ'),
('22222222-2222-2222-2222-222222222222', 'gree-pular-gwh12agc', 'GWH12AGC-K6DNA1A', 'Gree', 'Inverter wall split', 1050, '25-40 m²', '12000 BTU', '12500 BTU', '980 W', '930 W', '3.4 / 3.8 W/W', 'R32 / 560', '-15~+50 C°', '825×293×196 mm', '9 kg', '848×596×320 mm', '30 kg', '21-41 dB', '6 / 10 mm')
on conflict (id) do nothing;

insert into public.product_translations (product_id, locale, name, description, features)
values
('11111111-1111-1111-1111-111111111111', 'ka', 'AUX ინვერტერი კონდიციონერი', 'ენერგოეფექტური მოდელი ბინებისა და ოფისებისთვის.', 'გათბობა, გაგრილება, ტენის ამოშრობა, თვითდიაგნოსტიკა'),
('11111111-1111-1111-1111-111111111111', 'en', 'AUX Inverter Air Conditioner', 'Efficient wall split solution for apartments and offices.', 'Cooling, Heating, Dehumidify, Self-diagnosis'),
('22222222-2222-2222-2222-222222222222', 'ka', 'Gree Pular ინვერტერი', 'სტაბილური მუშაობა დაბალ ტემპერატურებშიც.', 'Wi-Fi კონტროლი, Turbo რეჟიმი, I-Feel'),
('22222222-2222-2222-2222-222222222222', 'en', 'Gree Pular Inverter', 'Reliable operation and low-noise comfort.', 'Wi-Fi control, Turbo mode, I-Feel')
on conflict (product_id, locale) do nothing;
