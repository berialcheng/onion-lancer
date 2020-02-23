# onion-lancer
 Pierce the unspoken wall

# Getting Started

### 启动服务
```
docker-compose up -d
```

### 更新证书

```
docker run -it --rm  \
    -v "`pwd`/letsencrypt/etc:/etc/letsencrypt" \
    -v "`pwd`/letsencrypt/lib:/var/lib/letsencrypt" \
    -v "/tmp/certbot/public_html:/tmp/certbot/public_html" \
    certbot/certbot certonly --webroot  -n --agree-tos -w /tmp/certbot/public_html --email cheng.zhong@shiant.com -d www.onioner.biz
```