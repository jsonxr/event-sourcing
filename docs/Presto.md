### References

[TGI Pulsar 013: Pulsar Schema and Presto SQL](https://www.youtube.com/watch?v=01IZV4npVPo)


### Presto (or Trino)

* Catalog in presto is like the cluster you are querying. Oracle could be one, Amazon, postgres, and pulsar. A default standalone pulsar is bundled with it configured to access the single pulsar instance `pulsar`.
* A schema name in presto is `<pulsar-topic>/<pulsar-namespace>`
* A table in presto is a pulsar topic `

```
bin/pulsar sql

show catalogs;
show schemas in pulsar;
show tables in pulsar."public/default";
describe pulsar."public/default".generator_test;
select * from pulsar."public/default".generator_test;
```
