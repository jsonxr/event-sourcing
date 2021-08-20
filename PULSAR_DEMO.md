# Event Sourcing

I find this video very helpful for an overall understanding of Event Streams. Even though the video is about kafka, the ideas presented are not kafka specific.

[![](http://img.youtube.com/vi/06iRM1Ghr1k/0.jpg)](https://www.youtube.com/watch?v=06iRM1Ghr1k)


# Getting Started

```bash
#---------------------------------------
# Pulsar Standalone
#---------------------------------------
# Bring up pulsar-standalone stack
docker-compose up -d

# Open new shell to log the output
docker-compose logs -f

# Open a new shell to begin consuming
bin/pulsar-client consume -s shell-subscription test-topic

# Open a new shell to begin producing
bin/pulsar-client produce -k 1 -m "Here I am" -n 1 test-topic
```

# Postgres

Configure postgres to be a sink with materialized queries

See: [pulsar-postgres](https://pulsar.apache.org/docs/en/io-quickstart/#setup-a-postgresql-cluster)

The compose file is configured with a [pgadmin tool](http://localhost:5050).
* username: `postgres@ci.org`
* password: `test`

```bash
# Configure Pulsar+postgres

# Create users table in postgres
bin/psql -f ./config/pulsar/schemas/users.sql
# Create a pulsar schemas and sink from a json definition (custom, not pulsar)
#bin/schema ./config/pulsar/schemas/users.json
# Upload the pulsar schema
bin/pulsar-admin schemas upload users-topic -f ./config/pulsar/schemas/users.schema.json
# Verify schema was uploaded
bin/pulsar-admin schemas get users-topic

# Create pulsar sink
bin/pulsar-admin sinks create \
  --archive ./connectors/pulsar-io-jdbc-postgres-2.7.0.nar \
  --inputs users-topic \
  --name users-jdbc-sink \
  --sink-config-file ./config/pulsar/schemas/users.jdbc-sink.yaml \
  --parallelism 1


# Push message to topic
# pulsar-client can not be usd for json messages :(
#bin/pulsar-client produce -m '{"id": "1", "username": "jason"}' -n 1 users-topic
```

# Node.js

```bash
#---------------------------------------
# Node.js app
#---------------------------------------

# Install dependencies
brew install libpulsar
npm i

# Open new shell to run node client to consume
npm run consumer

# Open another shell to run node client to produce
npm run producer
```

# Troubleshooting commands...
```bash
# Verify schema was uploaded
bin/pulsar-admin schemas get users-topic
# Troubleshoot pulsar sink...
bin/pulsar-admin sinks localrun \
--archive ./connectors/pulsar-io-jdbc-postgres-2.7.0.nar \
--tenant public --namespace default \
--inputs users-topic \
--name users-jdbc-sink \
--sink-config-file ./config/pulsar/schemas/users.jdbc-sink.yaml \
--parallelism 1
# Verify sink was created
bin/pulsar-admin sinks list --tenant public --namespace default
bin/pulsar-admin sinks get --tenant public --namespace default --name users-jdbc-sink
bin/pulsar-admin sinks status --tenant public --namespace default --name users-jdbc-sink
# Stop the sink
bin/pulsar-admin sinks stop --tenant public --namespace default --name users-jdbc-sink
# Remove the sink
bin/pulsar-admin sinks delete --tenant public --namespace default --name users-jdbc-sink
```

# GUIs

* [Pulsar Admin](http://localhost:9527) - Login: pulsar/pulsar
* [PGAdmin](http://localhost:5050) - Login: postgres@ci.org/test

# Cleaning up

```bash
# Remove all unused volumes
docker-compose kill
docker-compose rm
docker volume prune
```



# Example from pulsar's website...
```bash
bin/psql -f ./config/pulsar/schemas/example/pulsar-postgres-jdbc-sink.sql
bin/pulsar-admin schemas upload pulsar-postgres-jdbc-sink-topic \
  -f ./config/pulsar/schemas/example/pulsar-postgres-jdbc-sink.schema.json
bin/pulsar-admin sinks create \
  --archive ./connectors/pulsar-io-jdbc-postgres-2.7.0.nar \
  --inputs pulsar-postgres-jdbc-sink-topic \
  --name pulsar-postgres-jdbc-sink \
  --sink-config-file ./config/pulsar/schemas/example/pulsar-postgres-jdbc-sink.yaml \
  --parallelism 1
```
