# onion-lancer
> Pierce the unspoken wall

# 生成自签名的证书
```
#/bin/bash
cd certs


openssl genrsa -out ca.key 2048

openssl req -new -x509 -days 36500 -key ca.key -out ca.crt -subj \
  "/C=CN/ST=Shanghai/L=Shanghai/O=Zhong Cheng/OU=berialcheng.com"


openssl genrsa -out server.key 2048

openssl req -new -key server.key -out server.csr -subj \
"/C=CN/ST=Shanghai/L=Shanghai/O=Zhong Cheng/OU=berialcheng.com/CN=berialcheng.com"

mkdir -p ./demoCA/newcerts
touch ./demoCA/index.txt && echo '01' > ./demoCA/serial

openssl ca -in server.csr -out server.crt -cert ca.crt -keyfile ca.key


```

# 启动服务

```
docker run -idt \
 -v /data/lib/containers/letsencrypt/archive/{domain}/privkey1.pem:/data/certs/privkey.pem \
 -v /data/lib/containers/letsencrypt/archive/{domain}/fullchain1.pem:/data/certs/fullchain.pem \
 -v /tmp/certbot/public_html/.well-known/acme-challenge:/data/acme-challenge \
 -p 80:8080 -p 443:8443 \
 --name onion-lancer \
 berialcheng/onion-lancer

 docker run -idt \
  --name onion-lancer \
  berialcheng/onion-lancer bash
```