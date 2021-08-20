# Event Sourcing




### Server

Run the dependencies (postgres, pulsar, pgadmin)
```bash
docker-compose up -d
```

Run the backend
```bash
cd server
npm install
npm run bootstrap
npm start
```

### Client

```bash
cd client
npm start
```
