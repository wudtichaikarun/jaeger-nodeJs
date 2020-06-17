# POC Jaeger

## instruments

- HTTP
- Mongoose
- Amqp
- Kafka

---

## installation

1. Install module:
   `npm install`
2. add file .env

```
# you jaeger agent host
# JAEGER_AGENT_HOST=

# you jaeger agent port
# JAEGER_AGENT_PORT=

SERVER_HOST=localhost
SERVER_PORT=3000
```

3. start project
   `npm run dev`

4. get data http://localhost:3000/trace

5. jaeger UI result

   ![jaeger UI](https://ibb.co/g4ptt8d)
