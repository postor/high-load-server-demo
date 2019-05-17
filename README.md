# high-load-server-demo

用于高并发写操作的场景

# 思路

- node接口承接上报数据
- redis队列缓存数据
- mongo批量插入提速数据落地

# 服务搭建

- 准备好 docker compose
- `docker-compose up -d`

# 压力测试

- 准备好 k6 环境
- 修改 stress/test.js 中 `url` 服务地址改为服务主机的对应地址
- `k6 run --vus 1000 --duration 30s  stress/test.js`

目前测试单组服务 5000 qps

# 更高的承载能力

- 裸机安装应用并绑定 CPU 启动比 docker 更快，但 docker 多机可以 swarm 简化管理
- 跳过 redis 直接使用内存更快，但内存容易丢失数据
- redis 集群 https://redis.io/topics/cluster-spec
- mongodb sharded cluster  https://docs.mongodb.com/manual/core/sharded-cluster-components/
