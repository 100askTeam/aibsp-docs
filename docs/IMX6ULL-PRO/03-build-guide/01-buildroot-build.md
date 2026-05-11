---
sidebar_label: 'Buildroot 编译'
title: 'Buildroot 系统编译全流程'
---

# Buildroot 系统编译

本章节介绍如何使用 Buildroot 编译 i.MX6ULL 的完整系统镜像。

## 目录约定

```bash
WORK=/home/ubuntu/imx6ull-pro_linux5.4.47
BR=$WORK/buildroot-2026.02.1
IMG=$BR/output/images
```

## 编译全流程

### 1. 初始化与子模块更新

```bash
cd /home/ubuntu/imx6ull-pro_linux5.4.47
git submodule update --init --recursive
```

### 2. 编译系统 (Buildroot)

```bash
cd buildroot-2026.02.1
make 100ask_imx6ull-pro_defconfig
make -j"$(nproc)"
```

### 3. 编译后检查

```bash
ls -lh output/images/{u-boot-dtb.imx,sdcard.img,zImage}
```

## 独立编译 U-Boot

如果你需要单独编译 U-Boot 而不编译整个系统：

```bash
cd ~/imx6ull-pro_linux5.4.47/uboot-imx
export ARCH=arm
export CROSS_COMPILE=arm-linux-gnueabihf-

make mx6ull_14x14_evk_emmc_defconfig
make -j8
```

关键产物：
- `u-boot-dtb.imx`：烧写镜像（常用）
- `u-boot.bin` / `u-boot-dtb.bin`：调试或二次处理可用

## 独立编译 Linux 内核

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
```

关键产物：
- `arch/arm/boot/zImage`
- `arch/arm/boot/dts/imx6ull-14x14-evk.dtb`

## 交叉编译环境

### 推荐工具链

优先使用厂商常见工具链：`arm-none-linux-gnueabihf-`（如 gcc 9.2）

若本机没有该工具链，可使用系统包：

```bash
sudo apt-get update
sudo apt-get install -y \
  gcc-arm-linux-gnueabihf gcc-9-arm-linux-gnueabihf \
  make bc bison flex libssl-dev
```

### 环境变量

```bash
export ARCH=arm
export CROSS_COMPILE=arm-linux-gnueabihf-
```

## 产物用途

典型启动文件组合：

| 产物 | 用途 |
|------|------|
| `u-boot-dtb.imx` | 引导烧写 |
| `zImage` | 内核镜像 |
| `*.dtb` | 设备树文件 |
| `sdcard.img` | 完整 eMMC 镜像 |
| `rootfs.ext2` | 根文件系统 |

## 实机校正

当前 100ask i.MX6ULL Pro 实测中，需要注意：

- `imx6ull-14x14-evk-emmc.dtb` 可能触发 eMMC 初始化不稳定（`mmc1: error -110`）
- 实机闭环推荐采用：`imx6ull-14x14-evk.dtb` + `usdhc2` 保守参数（4bit、`no-1-8-v`、50MHz）
- 判据：启动日志出现 `mmcblk1: ... p1 p2`、`EXT4-fs ... mounted`、`buildroot login`

## 常见问题

### DNS 解析失败
先修复网络/DNS，再执行 `git clone` 或 `apt-get`

### 旧内核在新汇编器报错
`.section ..., #alloc` 需改为 GNU as 新语法（如 `"a"` 或 `"ax"`）

### 汇编指令不支持
检查工具链版本与编译参数，必要时使用 gcc-9 并追加 `KCFLAGS`

## 验证清单

- U-Boot: `ls -lh u-boot-dtb.imx`
- Kernel: `ls -lh arch/arm/boot/zImage`
- DTB: `ls -lh arch/arm/boot/dts/imx6ull-14x14-evk.dtb`

全部存在且大小正常，即可进入烧写与上板验证阶段。
