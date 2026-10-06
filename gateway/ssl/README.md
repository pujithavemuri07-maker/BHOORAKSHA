# SSL Certificates Directory

Place production SSL certificates here:
- `fullchain.pem`
- `privkey.pem`

For local self-signed testing, you can generate one with:
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout privkey.pem -out fullchain.pem \
  -subj "/CN=bhooraksha.local"
```
