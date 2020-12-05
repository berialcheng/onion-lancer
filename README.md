# onion-lancer
 Pierce the unspoken wall
 
![CI](https://github.com/berialcheng/onion-lancer/workflows/CI/badge.svg?branch=master)
[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)]()

[![GitHub stars](https://img.shields.io/github/stars/berialcheng/onion-lancer.svg?style=social&label=Stars&style=plastic)]()
[![GitHub watchers](https://img.shields.io/github/watchers/berialcheng/onion-lancer.svg?style=social&label=Watch&style=plastic)]()
[![GitHub forks](https://img.shields.io/github/forks/berialcheng/onion-lancer.svg?style=social&label=Fork&style=plastic)]()

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
