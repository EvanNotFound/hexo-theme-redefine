## Bug 提交方法

如果你需要提交一个 Bug issue，请遵循以下步骤

### Issue 提交前检查
请执行

```bash
$ hexo clean
``` 
再看看问题是否解决

### Issue 所需资料文件

请提供
- hexo 根目录的网站配置文件 `_config.yml` 
- 主题配置文件 `_config.redefine.yml` 或 `_config.yml` 中有关的项目。如果有敏感信息请打码（替换一些字符
- Bug 复现方法（我要如何做才能复现这个 Bug）

### Issue 命名规则

格式：

```
[Bug] + 标题
```
注意
- 请打上 Bug 的 `label`
- 请在标题中大概概括一下 Bug 内容