---
sidebar_label: 'U-Boot 概述'
title: 'U-Boot Bootloader 开发'
---

# U-Boot 开发

本章节介绍 i.MX6ULL U-Boot 的编译、配置与定制开发。

## U-Boot 概述

U-Boot (Universal Boot Loader) 是嵌入式系统的引导程序，负责：
- 硬件初始化
- 加载 Linux 内核到内存
- 传递设备树 (DTB)
- 提供命令行交互环境

## 获取源码

```bash
cd ~/imx6ull-pro_linux5.4.47
git clone https://gitee.com/weidongshan/uboot-imx
```

## 编译 U-Boot

```bash
cd ~/imx6ull-pro_linux5.4.47/uboot-imx
export ARCH=arm
export CROSS_COMPILE=arm-linux-gnueabihf-

make mx6ull_14x14_evk_emmc_defconfig
make -j8
```

### 关键产物

| 文件 | 说明 |
|------|------|
| `u-boot-dtb.imx` | 烧写镜像（常用） |
| `u-boot.bin` | 原始二进制文件 |
| `u-boot-dtb.bin` | 包含设备树的二进制文件 |

## 常用 U-Boot 命令

### 环境变量管理

```bash
# 查看所有环境变量
printenv

# 设置环境变量
setenv bootdelay 3

# 保存环境变量
saveenv

# 恢复默认环境
env default -a
saveenv
```

### 启动相关

```bash
# 从 eMMC 启动
boot

# 从 SD 卡启动
run bootcmd_mmc0

# 从网络启动 (TFTP)
setenv ipaddr 192.168.1.100
setenv serverip 192.168.1.10
tftpboot ${loadaddr} zImage
tftpboot ${fdt_addr} imx6ull-14x14-evk.dtb
bootz ${loadaddr} - ${fdt_addr}
```

### 存储操作

```bash
# 查看 eMMC 信息
mmc list
mmc dev 1
mmc info

# 读取 eMMC 数据
mmc read ${loadaddr} 0x1000 0x100

# 写入 eMMC 数据
mmc write ${loadaddr} 0x1000 0x100
```

### Fastboot 模式

```bash
# 进入 Fastboot 模式
fastboot 0

# 通过 bmode 切换启动模式
bmode usb
bmode emmc
```

## 修改启动参数

### 修改内核启动参数

在 U-Boot 中：

```bash
setenv bootargs 'console=ttymxc0,115200 root=/dev/mmcblk1p2 rootwait rw'
saveenv
```

### 修改内核加载路径

```bash
setenv bootcmd 'mmc dev 1; fatload mmc 1:1 ${loadaddr} zImage; fatload mmc 1:1 ${fdt_addr} imx6ull-14x14-evk.dtb; bootz ${loadaddr} - ${fdt_addr}'
saveenv
```

## 自动启动模式切换

本项目支持通过 `reboot_mode` 环境变量实现自动切换启动模式：

### 安装模式切换命令

在 U-Boot 控制台执行 `flash_usb_shell/uboot_mode_setup.txt` 里的命令，完成：
- 保存原始 `bootcmd`
- 注入 `reboot_mode` 分支
- 新增 `reboot_to_usb_sdp / reboot_to_recovery / reboot_to_normal`

### Linux 触发方式

```bash
cd /home/ubuntu/imx6ull-pro_linux5.4.47
./flash_usb_shell/linux_reboot_mode.sh usb_sdp
# 或
./flash_usb_shell/linux_reboot_mode.sh recovery
```

### U-Boot 触发方式

```bash
run reboot_to_usb_sdp
# 或
run reboot_to_recovery
```

## 常见问题

### 环境变量丢失

如果出现 `Loading Environment ... bad CRC, using default environment`：
- 重新写入关键环境变量并 `saveenv`
- 检查 eMMC 是否正常

### 无法正常启动

- 检查 `bootcmd` 和 `bootargs` 配置
- 确认 DTB 文件是否正确
- 使用 `imx6ull-14x14-evk.dtb` 替代 `imx6ull-14x14-evk-emmc.dtb`

### 恢复默认配置

```bash
env default -a
saveenv
reset
```
