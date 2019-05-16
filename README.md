# high-load-server-demo

用于高并发写操作的场景

# 思路

- node接口承接上报数据
- redis队列缓存数据
- mongo批量插入提速数据落地

如果

# 服务搭建

- 准备好 docker compose
- `docker-compose up -d`

# 压力测试

- 准备好 k6 环境
- 修改 stress/test.js 中 `url` 服务地址改为服务主机的对应地址
- `k6 run --vus 1000 --duration 30s  stress/test.js`