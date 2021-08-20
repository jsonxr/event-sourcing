# Event Sourcing Demo

## Technologies

### Pulsar

### Presto (or Trino)

* Catalog in presto is like the cluster you are querying. Oracle could be one, Amazon, postgres, and pulsar. A default standalone pulsar is bundled with it configured to access the single pulsar instance `pulsar`.
* A schema in presto consists of `<pulsar-topic>/<pulsar-namespace>`
* A table in presto is a pulsar topic `

```
bin/pulsar sql

show catalogs;
show schemas in pulsar;
show tables in pulsar."public/default";
describe pulsar."public/default".generator_test;
select * from pulsar."public/default".generator_test;
```

### Terminology

- Postgres
  - DATABASE
- Presto
  - CATALOG (collection of databases) (one catalog per pulsar cluster or instance)
  - SCHEMA (namespace in pulsar, or database)
  - TABLE (topics within pulsar namespace)
- Pulsar
  - Schema
  - namespace
