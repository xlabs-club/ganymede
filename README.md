# Ganymede

Ganymede，木卫三，卫星实验室基于 Backstage 构建的内部开发者平台。

效果展示请访问 [app.xlabs.club](https://app.xlabs.club)。

## 本地开发指导

Backstage 官方开源有开箱即用的容器镜像，也有丰富的插件生态，然而区别于其他插件类应用，Backstage 有自己的特点：

1. Backstage 插件分为 frontend 和 backend，一个完整的插件可能包含两种，也可能只包含其中一种。
2. 开源发布的开箱即用的容器镜像，只包含基础插件，一般只用来作为初次学习使用。
3. 如果想使用其他插件，需要做一些编码工作，一般步骤如下。

    - 使用 `npx @backstage/create-app@latest` 创建一个基础项目。
    - 按插件要求安装插件，配置插件菜单、UI 效果、权限、认证信息等，每个插件要求不同。
    - 按需开发自己的插件。
    - 编译成新容器镜像，某些插件可能还需要在容器中额外安装一些依赖包，部署时使用此容器镜像。

4. 基本上每个插件都有自己的配置要求，需根据插件文档配置 app-config.yaml。

本地开发请先安装 Node.js 以及 yarn，版本要求请参考根目录 `package.json`, 然后根据提示按需执行以下命令：

```sh
# 本地开发
yarn install
yarn dev

# 版本发布，使用镜像的多阶段构建，完整流程参考 Dockerfile
docker buildx build --push --platform linux/amd64,linux/arm64 -t nxest/ganymede:dev .
# docker buildx build --push --platform linux/amd64 -t nxest/ganymede:dev .
```

### Backstage 版本升级

Backstage 版本更新很频繁，保持最新版本的方法请参考官方文档 [keeping-backstage-updated](https://backstage.io/docs/getting-started/keeping-backstage-updated/).

一般更新步骤如下。

1. 使用命令行升级 package.json 依赖包，注意这一步只升级 Dependencies，不会升级其中 scripts、config、Dockefile 等其他内容。

    ```sh
     # 只升级 @backstage 包
     yarn backstage-cli versions:bump
     # 按指定 pattern 升级包
     yarn backstage-cli versions:bump --pattern '@{backstage,backstage-community}/*'
    ```

2. 从 backstage.json 获取当前项目版本，使用 [upgrade-helper](https://backstage.github.io/upgrade-helper/?from=1.30.0&to=1.31.1) 比对从 x 版本到 y 版本有哪些更新，根据 diff 手动合并到自己项目中。
3. 根据 release change log 查看是否有破坏性变更，更新代码。
4. 按需更新插件版本，注意插件本身相关的配置变更。

### 本项目变更

此项目使用 `npx @backstage/create-app@latest` 初始化，然后我们逐步修改了一些内容，主要修改内容参考如下列表。

常规变更：

- 参考 [backstage.io multi-stage-build](https://backstage.io/docs/deployment/docker/#multi-stage-build) 支持 Docker 多阶段构建。

插件列表：

- pluing list。

## License

Licensed under the [Apache License, Version 2.0]( http://www.apache.org/licenses/LICENSE-2.0)。
