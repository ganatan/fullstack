# Test

## Test si un type existe

```sql
select typname
from pg_type
where typname = 'dom_pk';

select typname
from pg_type
where typname = 'dom_lib';
```

## Test type

```sql
select t.typname as domain_name, bt.typname as base_type
from pg_type t
join pg_type bt on bt.oid = t.typbasetype
where t.typname = 'dom_pk';

select t.typname as domain_name, bt.typname as base_type
from pg_type t
join pg_type bt on bt.oid = t.typbasetype
where t.typname = 'dom_lib';
```

## Change type de données

```sql
alter table person
  alter column id type integer
  using id::integer;

alter table person
  alter column name type varchar(255)
  using name::varchar;
```

## Creer une table person

```sql
drop table if exists person cascade;

drop table if exists person;

create table person (
  id serial primary key,
  name varchar(255) not null
);

insert into person (name) values
  ('John Lennon'),
  ('Paul McCartney'),
  ('George Harrison'),
  ('Ringo Starr');

alter table person
  alter column name drop not null;
```
