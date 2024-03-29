---
layout: ../../layouts/PostsLayout.astro
title: 解决 AMD 显卡驱动控制面板无法打开
lang: zh-Hans
pubDate: 2022-07-24T15:19:20.663Z
updatedDate: 2022-07-25T09:36:44.090Z
tags:
  - Windows
  - 解决问题
description: 解决 AMD 显卡驱动控制面板无法打开问题
---

## 报错截图

![报错截图](/uploads/pasted-image-20220516223804.png '报错截图')

## 解决办法

首先在微软应用商店下载 `Update Manager For Windows`

![微软应用商店中Update Manager For Windows](/uploads/pasted-image-20220516223951.png '微软应用商店中Update Manager For Windows')

然后使用 AMD 官方驱动安装工具安装最新驱动，安装完成后重启电脑

重启后以管理员身份运行 `Update Manager For Windows`

![以管理员身份运行Update Manager For Windows](/uploads/pasted-image-20220516224125.png '以管理员身份运行Update Manager For Windows')

首先点击刷新

![刷新Update Manager For Windows](/uploads/pasted-image-20220516224242.png '刷新Update Manager For Windows')

在 `Windows Update` 找到显卡驱动更新，勾选，点击 Hide

![隐藏AMD显卡驱动](/uploads/pasted-image-20220516224608.png '隐藏AMD显卡驱动')

在 `Hidden Updates` 中可以看见隐藏显卡驱动跟新

![查看隐藏的显卡驱动跟新](/uploads/pasted-image-20220516224651.png '查看隐藏的显卡驱动跟新')

最后重新安装官网显卡驱动即可
