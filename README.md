# 快速开始
```shell
# nodejs 必须大于等于 18 版本
npm install
npm install --save-dev @tauri-apps/cli

# 网页
npm run dev

# 桌面
npm run tauri dev

# android app
npm run tauri android dev

# ios app
npm run tauri ios dev
```

# 效果展示
![书城](public/shucheng.png)
![搜索](public/sousuo.png)
![小说详情](public/novelDetail.png)
![小说阅读](public/reader.png)
![设置](public/settings.png)

# android app 签名

## 1. 一个 Android keystore 文件
```shell
keytool -genkey -v \
  -keystore my-release-key.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias my-key-alias
```

## 2. 将 keystore 转为 Base64 形式
```shell
base64 my-release-key.jks > keystore.b64

# macos
base64 -i my-release-key.jks -o keystore.b64
```

## 3. 在 GitHub 仓库里添加 Secret
- SIGNING_KEYSTORE_BASE64 复制自 keystore.b64 文件
- SIGNING_KEY_ALIAS 创建 keystore 时设置的别名（my-key-alias）
- SIGNING_KEYSTORE_PASSWORD keystore 密码
- SIGNING_KEY_ALIAS_PASSWORD key alias 密码