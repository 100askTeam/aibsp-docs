---
sidebar_label: 'Buildroot LVGL9 自启'
title: 'AI 技能：LVGL9 集成与开机自启'
---

# AI 技能：LVGL9 集成与开机自启

:::info 技能说明
在 Buildroot 为 i.MX6ULL 增加 LVGL9 预览示例并开机自启，自动编译/烧录/串口验证。
:::

## 板级与目录约定

```bash
WORK=/home/ubuntu/imx6ull-pro_linux5.4.47
BR=$WORK/buildroot-2026.02.1
IMG=$BR/output/images
```

默认板级配置：
- `configs/100ask_imx6ull-pro_defconfig`
- `BR2_LINUX_KERNEL_INTREE_DTS_NAME="imx6ull-14x14-evk"`

## 新增 Buildroot 包 `lvgl9-demo`

```bash
mkdir -p $BR/package/lvgl9-demo/src
```

必须包含文件：
- `package/lvgl9-demo/Config.in`
- `package/lvgl9-demo/lvgl9-demo.mk`
- `package/lvgl9-demo/src/lv_conf.h`
- `package/lvgl9-demo/src/lvgl9_demo_main.c`
- `package/lvgl9-demo/src/lvgl9_preview_ui.c`

关键构建点：
- 源码取自 `lvgl v9.2.2`
- 编译定义：`-DLV_CONF_PATH=lv_conf.h`
- 启用：`LV_USE_LINUX_FBDEV=1`、`LV_USE_EVDEV=1`
- 输出：`/usr/bin/lvgl9-demo`

## 接入 Buildroot

1. 在 `package/Config.in` 的 Graphics 分组加入：
```make
source "package/lvgl9-demo/Config.in"
```

2. 在 `configs/100ask_imx6ull-pro_defconfig` 增加：
```make
BR2_ROOTFS_OVERLAY="board/100ask/imx6ull-pro/rootfs-overlay"
BR2_PACKAGE_LVGL9_DEMO=y
```

## 开机自启动脚本

创建 `board/100ask/imx6ull-pro/rootfs-overlay/etc/init.d/S99lvgl9-demo`：
- 可执行权限 `0755`
- 默认参数：`/dev/fb0` 和 `/dev/input/event0`
- 后台启动并写 PID 到 `/var/run/lvgl9-demo.pid`
- 日志写入 `/var/log/lvgl9-demo.log`

## 编译镜像

```bash
cd $BR
make 100ask_imx6ull-pro_defconfig
make -j8
```

## 自动烧录与串口验证

```bash
SERIAL_PORT=/dev/ttyACM0 SERIAL_BAUD=115200 \
$WORK/flash_usb_shell/add_pkg_flash_verify.sh \
BR2_PACKAGE_LVGL9_DEMO \
"uname -a; ls -l /usr/bin/lvgl9-demo; ls -l /etc/init.d/S99lvgl9-demo"
```

## 验证通过判据

```bash
uname -a
ls -l /usr/bin/lvgl9-demo
ls -l /etc/init.d/S99lvgl9-demo
pidof lvgl9-demo || true
ps | grep lvgl9-demo | grep -v grep || true
tail -n 40 /var/log/lvgl9-demo.log || true
```

成功判据：
- 二进制存在且可执行
- `S99lvgl9-demo` 存在且可执行
- `lvgl9-demo` 进程存在
