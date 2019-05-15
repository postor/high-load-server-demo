# high-load-server-demo

用于高并发写操作的场景

# 思路

- node接口承接上报数据
- redis队列缓存数据
- mongo批量插入提速落地

因为数据库即使集群在高并发写的情况并没有提升效率（写操作需要在主库上完成）所以这里没有用集群，同时需要高并发读的可以自己做集群

# 服务搭建

- 准备好 docker swarm 集群
- `docker stack deploy -c docker-compose.yml highload`

# 压力测试

- 准备好 k6 环境
- 修改 stress/test.js 中 `urls` 服务地址列表为 swarm 集群的地址列表
- `k6 run --vus 1000 --duration 30s  stress/test.js`