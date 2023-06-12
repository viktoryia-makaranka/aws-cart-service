create type status_enum AS ENUM ('OPEN', 'ORDERED');

create table IF NOT EXISTS carts (
 	id uuid not null default uuid_generate_v4() primary key,
 	user_id uuid not null,
 	created_at date not null,
 	updated_at date not null,
 	status status_enum default status_enum.OPEN
);

create table IF NOT EXISTS cart_items (
	product_id uuid not null,
	count integer,
	cart_id uuid not null,
	CONSTRAINT cart_id FOREIGN KEY (cart_id) REFERENCES carts(id)
);

INSERT INTO carts (user_id, created_at, updated_at, status)
 values (
 	'40e62153-b5c6-4896-987c-f30f3678f608',
 	'2022-06-12',
 	'2022-06-12',
 	'OPEN'
 ),
 (
 	'fefd3976-b4ed-4351-b4d7-ac974d278992',
 	'2022-05-12',
 	'2022-06-12',
 	'OPEN'
 ),
 (
 	'40e62153-b5c6-4896-987c-f30f3678f608',
 	'2022-05-12',
 	'2022-06-12',
 	'ORDERED'
 ),
 (
 	'7f333df6-90a4-4fda-8dd3-9485d27cee36',
 	'2022-04-01',
 	'2023-04-01',
 	'OPEN'
 );

 INSERT INTO cart_items (cart_id, product_id, count)
 values (
    '1e544b22-8397-4e1a-b6ab-8bbf56562568',
 	'e2119b09-3127-4734-8b00-6f26e282c075',
 	1
),
(
    '526efe1e-e627-4bd8-92fc-b644b2ace471',
 	'e2119b09-3127-4734-8b00-6f26e282c075',
 	2
),
(
    '1e544b22-8397-4e1a-b6ab-8bbf56562568',
 	'a43fb7e8-9613-4bed-8262-fca6d1638b76',
 	3
);