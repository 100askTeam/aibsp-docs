---
sidebar_label: 'Buildroot 系统定制'
title: 'RootFS 定制与新增应用包'
---

# Buildroot 系统定制

本章节介绍如何在 Buildroot 中新增应用程序包、定制 RootFS 以及设置开机自启动。

## 新增 Buildroot 包

### 1. 创建包目录

```bash
cd buildroot-2026.02.1
mkdir -p package/myapp/src
```

### 2. 创建配置文件

**Config.in**:

```make
config BR2_PACKAGE_MYAPP
    bool "myapp"
    help
        My application description.
```

**myapp.mk**:

```make
MYAPP_VERSION = 1.0
MYAPP_SITE = $(TOPDIR)/package/myapp/src
MYAPP_SITE_METHOD = local

define MYAPP_BUILD_CMDS
    $(MAKE) $(TARGET_CONFIGURE_OPTS) -C $(@D)
endef

define MYAPP_INSTALL_TARGET_CMDS
    $(INSTALL) -D -m 0755 $(@D)/myapp $(TARGET_DIR)/usr/bin/myapp
endef

$(eval $(generic-package))
```

### 3. 接入 Buildroot 菜单

在 `package/Config.in` 的适当位置添加：

```make
source "package/myapp/Config.in"
```

### 4. 配置 defconfig

在 `configs/100ask_imx6ull-pro_defconfig` 中启用包：

```make
BR2_PACKAGE_MYAPP=y
```

### 5. 编译验证

```bash
cd buildroot-2026.02.1
make 100ask_imx6ull-pro_defconfig
make -j8

# 验证产物
ls -lh output/images/
```

## 开机自启动

### 新增 init 脚本

创建 `board/100ask/imx6ull-pro/rootfs-overlay/etc/init.d/S99myapp`：

```bash
#!/bin/sh

case "$1" in
    start)
        echo "Starting myapp..."
        /usr/bin/myapp &
        ;;
    stop)
        echo "Stopping myapp..."
        killall myapp
        ;;
    restart)
        $0 stop
        $0 start
        ;;
    *)
        echo "Usage: $0 {start|stop|restart}"
        exit 1
esac

exit 0
```

### 设置权限

```bash
chmod 0755 board/100ask/imx6ull-pro/rootfs-overlay/etc/init.d/S99myapp
```

## RootFS Overlay

RootFS Overlay 用于在构建时向根文件系统添加自定义文件：

```
board/100ask/imx6ull-pro/rootfs-overlay/
├── etc/
│   ├── init.d/
│   │   └── S99myapp
│   └── myapp.conf
└── usr/
    └── bin/
```

## LVGL9 示例

集成 LVGL9 预览示例并开机自启：

### 1. 创建包

```bash
mkdir -p buildroot-2026.02.1/package/lvgl9-demo/src
```

### 2. 配置 defconfig

```make
BR2_ROOTFS_OVERLAY="board/100ask/imx6ull-pro/rootfs-overlay"
BR2_PACKAGE_LVGL9_DEMO=y
```

### 3. 开机自启脚本

创建 `board/100ask/imx6ull-pro/rootfs-overlay/etc/init.d/S99lvgl9-demo`，后台启动并写入 PID。

### 4. 验证

```bash
# 检查二进制存在
ls -l /usr/bin/lvgl9-demo

# 检查自启脚本
ls -l /etc/init.d/S99lvgl9-demo

# 检查进程
pidof lvgl9-demo || true
ps | grep lvgl9-demo | grep -v grep || true

# 查看日志
tail -n 40 /var/log/lvgl9-demo.log || true
```

## 一键加包并重刷验证

```bash
cd /home/ubuntu/imx6ull-pro_linux5.4.47
./flash_usb_shell/add_pkg_flash_verify.sh BR2_PACKAGE_SL "uname -a; which sl; TERM=vt100 sl -l >/dev/null 2>&1; echo SL_RC:$?"
```

说明：
- 第一个参数是 Buildroot 包符号（例：`BR2_PACKAGE_HTOP`）
- 第二个参数是刷写后串口登录的验证命令

## 维护约定

- 所有烧录与串口框架脚本统一维护在 `flash_usb_shell`
- UUU 路径统一使用 `uuucli/build/uuu/uuu`
- 新增流程文档时，优先更新 README 与 `flash_usb_shell/FRAMEWORK.md`
