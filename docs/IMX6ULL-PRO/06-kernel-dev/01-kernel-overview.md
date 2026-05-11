---
sidebar_label: '内核概述'
title: 'Linux 内核开发'
---

# Linux 内核开发

本章节介绍 i.MX6ULL Linux 内核的编译、设备树修改与驱动开发。

## 内核概述

本项目使用 Linux 5.4.47 内核，针对 NXP i.MX6ULL 系列处理器进行了适配和优化。

## 获取源码

```bash
cd ~/imx6ull-pro_linux5.4.47
git clone https://gitee.com/weidongshan/linux-imx
```

## 编译内核

```bash
cd ~/imx6ull-pro_linux5.4.47/linux-imx
export ARCH=arm
export CROSS_COMPILE=arm-linux-gnueabihf-

# 推荐配置
make imx_v7_defconfig

# 内核镜像
make zImage -j8 CC=arm-linux-gnueabihf-gcc-9 KCFLAGS="-march=armv7-a -mfpu=vfpv3-d16"

# 设备树
make dtbs -j8 CC=arm-linux-gnueabihf-gcc-9 KCFLAGS="-march=armv7-a -mfpu=vfpv3-d16"

# 编译内核模块
make modules -j8
```

### 关键产物

| 文件 | 说明 |
|------|------|
| `arch/arm/boot/zImage` | 内核镜像 |
| `arch/arm/boot/dts/imx6ull-14x14-evk.dtb` | 设备树文件 |
| `*.ko` | 内核模块文件 |

## 设备树开发

### 设备树文件位置

```
linux-imx/arch/arm/boot/dts/
├── imx6ull-14x14-evk.dts          # 推荐使用的设备树
├── imx6ull-14x14-evk-emmc.dts     # eMMC 版本（可能存在稳定性问题）
└── imx6ull-14x14-evk-gpmi-weim.dts
```

### 修改 eMMC 配置

当前实机推荐使用 `imx6ull-14x14-evk.dtb`，其 `&usdhc2` 节点使用保守参数：

```dts
&usdhc2 {
    bus-width = <4>;
    no-1-8-v;
    max-frequency = <50000000>;
    /* ... */
};
```

### 修改设备树并重新编译

```bash
cd ~/imx6ull-pro_linux5.4.47/linux-imx
make dtbs
```

## 驱动开发

### 新增驱动模块

1. 在对应驱动目录下添加源码
2. 修改 `Kconfig` 和 `Makefile`
3. 配置内核使模块为 `m` 或 `y`
4. 重新编译

```bash
make menuconfig
make -j8
make modules
```

### 驱动验证

```bash
# 加载模块
insmod my_driver.ko

# 查看已加载模块
lsmod

# 查看内核日志
dmesg | grep my_driver

# 卸载模块
rmmod my_driver
```

### 查看 `/sys` 节点

```bash
# 查看设备节点
ls /sys/class/

# 查看设备信息
cat /sys/class/my_device/attribute
```

## Buildroot 集成

如果需要固定内核配置，补到 `board/100ask/imx6ull-pro/linux-fragment.config`：

```bash
# 在 Buildroot 中配置
BOARD_LINUX_FRAGMENT="board/100ask/imx6ull-pro/linux-fragment.config"
```

## 内核调试

### 串口调试

```bash
# 设置内核日志级别
dmesg -n 8

# 查看内核启动日志
dmesg

# 查看特定驱动日志
dmesg | grep mmc
dmesg | grep usb
```

### 内核 panic 排查

1. 检查 DTB 是否正确
2. 检查内核配置是否完整
3. 使用 `imx6ull-14x14-evk.dtb` 替代其他版本
4. 检查 eMMC 时序问题

## 常见问题

### Starting kernel 卡住

- 检查 DTB 文件是否正确
- 推荐使用 `imx6ull-14x14-evk.dtb`
- 检查 `bootargs` 中的 root 设备路径

### mmc1: error -110

- eMMC 初始化失败
- 修改 `&usdhc2` 使用保守参数（4bit、`no-1-8-v`、50MHz）

### 驱动模块加载失败

- 检查内核版本与模块版本是否匹配
- 使用 `modinfo my_driver.ko` 查看模块信息
