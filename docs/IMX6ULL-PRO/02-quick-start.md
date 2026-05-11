---
sidebar_label: '快速开始'
title: '快速开始指南'
---

# 快速开始

本章节帮助你快速将开发板上手运行，完成首次上电、串口连接和系统烧录。

## 准备工作

### 硬件准备
- 100ASK_IMX6ULL-PRO 开发板
- 5V/2A 电源适配器 或 USB 供电线
- USB-TTL 串口模块 (如 CH340, CP2102)
- 网线 (可选，用于网络调试)
- USB 数据线 (用于 USB 烧录)

### 软件准备
- 串口终端工具 (如 MobaXterm, Putty, picocom)
- NXP UUU 烧录工具 (仓库内置)
- Linux 主机 (推荐 Ubuntu 20.04)



## 3. 基础使用说明



### 3.1 准备与初始化



```
cd /home/ubuntu/imx6ull-pro_linux5.4.47
git submodule update --init --recursive
```



### 3.2 编译系统（Buildroot）



```
cd buildroot-2026.02.1
make 100ask_imx6ull-pro_defconfig
make -j"$(nproc)"
```



编译后检查：

```
ls -lh output/images/{u-boot-dtb.imx,sdcard.img,zImage}
```



### 3.3 烧录方式1：ROM SDP（`-b emmc_all`）



```
cd /home/ubuntu/imx6ull-pro_linux5.4.47
sudo ./uuucli/build/uuu/uuu -v -b emmc_all \
  ./buildroot-2026.02.1/output/images/u-boot-dtb.imx \
  ./buildroot-2026.02.1/output/images/sdcard.img
```



适用：板子在 SDP 模式，或通过 U-Boot `bmode usb` 自动切入 SDP。

### 3.4 烧录方式2：U-Boot Fastboot



先确保目标已进入 `fastboot 0`，再执行：

```
cd /home/ubuntu/imx6ull-pro_linux5.4.47
./flash_usb_shell/way2_recovery_flash.sh
```



### 3.5 一键自动流程（推荐）



```
cd /home/ubuntu/imx6ull-pro_linux5.4.47
./flash_usb_shell/add_pkg_flash_verify.sh BR2_PACKAGE_HTOP "uname -a; htop -v || true"
```



用途：启用包 -> 编译 -> 自动进 fastboot -> 烧录 -> 串口验证。

## 4. AI 调用操作手册



下面是建议直接发给 AI 助手的任务模板，按场景给出最简步骤。

### 4.1 编译并烧写系统



AI 指令模板：

```text
请在 /home/ubuntu/imx6ull-pro_linux5.4.47 下：
1) make 100ask_imx6ull-pro_defconfig && make -j8
2) 用方式1刷写（uuu -b emmc_all）
3) 串口验证 uname -a 与 rootfs 挂载日志
4) 输出完整执行日志与结论
```



### 4.2 新增一个应用程序（Buildroot 包）



AI 指令模板：

```text
请在 buildroot-2026.02.1 新增一个自定义包 myapp：
1) 创建 package/myapp/{Config.in,myapp.mk,src/...}
2) 接入 package/Config.in 与 100ask_imx6ull-pro_defconfig
3) 编译并验证 /usr/bin/myapp 存在
4) 如需开机自启，放到 board/100ask/imx6ull-pro/rootfs-overlay/etc/init.d/
```



最简人工步骤：

- 新包目录 + `Config.in` + `.mk`
- 在 `package/Config.in` `source` 进去
- 在 defconfig 置 `BR2_PACKAGE_MYAPP=y`
- `make` 后串口验证可执行文件与功能

### 4.3 新增一个驱动模块（Kernel）



AI 指令模板：

```text
请在 linux-imx 中新增/修改驱动模块并接入 Buildroot：
1) 修改对应驱动源码与 Kconfig/Makefile
2) 调整内核配置使模块为 m 或 y
3) 重新编译 Buildroot 镜像
4) 烧录后串口验证 dmesg、lsmod、/sys 节点
```



最简人工步骤：

- 在 `linux-imx` 修改驱动和配置
- 如需固定配置，补到 `board/100ask/imx6ull-pro/linux-fragment.config`
- 重编系统并烧录
- 用串口跑 `dmesg | grep <driver>`、`lsmod`、功能测试命令

### 4.4 只改 U-Boot 启动/升级逻辑



AI 指令模板：

```text
请仅修改 U-Boot 升级入口（bmode/fastboot）并验证：
1) 修改 uboot-imx 对应逻辑
2) Buildroot 重编 u-boot-dtb.imx
3) 执行方式1和方式2刷写链路验证
4) 提供回归风险与回滚建议
```



### 4.5 串口自动化回归



AI 指令模板：

```text
请使用 flash_usb_shell + linux_serial_agent 做无人值守回归：
1) 自动抢占 U-Boot 或 Linux
2) 自动刷写
3) 自动登录并执行校验命令
4) 输出失败点与修复建议
```



## 5. 维护约定



- 路径约定：所有烧录与串口框架脚本统一维护在 `flash_usb_shell`。
- UUU 路径约定：统一使用 `uuucli/build/uuu/uuu`。
- 新增流程文档时，优先更新本 README 与 `flash_usb_shell/FRAMEWORK.md`。

## 常见问题

### 串口无输出
- 检查串口接线是否正确 。
- 确认串口模块驱动已安装
- 检查波特率设置是否为 115200

### 系统无法启动
- 检查电源供电是否稳定 (12V/2A)
- 确认 eMMC 中已烧录系统镜像
- 如未烧录，请参考 [系统烧录指南]()

### Starting kernel 卡住
- 检查 DTB 文件是否正确
- 推荐优先使用 `imx6ull-14x14-evk.dtb`
