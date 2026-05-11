---
sidebar_label: 'UUU 串口自动烧录'
title: 'AI 技能：UUU + 串口自动烧录'
---

# AI 技能：UUU + 串口自动烧录

:::info 技能说明
自动化 i.MX6ULL 的 uuu eMMC 烧录与串口登录检查。把 UUU 烧录工具和 linux_serial_agent 串口工具串起来形成一键流程。
:::

## 目录与入口

| 文件 | 说明 |
|------|------|
| `flash_usb_shell/auto_flash_and_serial.sh` | 主脚本 |
| `flash_usb_shell/add_pkg_flash_verify.sh` | 加包+重刷+验证一键脚本 |
| `flash_usb_shell/serial_login_check.py` | 串口检查脚本 |
| `flash_usb_shell/FRAMEWORK.md` | 框架图文档 |

## 先决条件

1. `uuu` 可执行（默认路径：`uuucli/build/uuu/uuu`）
2. Buildroot 镜像存在（`u-boot-dtb.imx` + `sdcard.img`）
3. 串口工具存在（`linux_serial_agent/trae_serial_terminal_go`）
4. 如要自动登录：需要 `picocom` 与 `python3-pexpect`

## 一键执行

```bash
cd /home/ubuntu/imx6ull-pro_linux5.4.47
WAIT_RECOVERY_SEC=0 \
LOGIN_USER=root \
LOGIN_PASS=123456 \
CHECK_CMD="uname -a" \
./flash_usb_shell/auto_flash_and_serial.sh
```

说明：
- `WAIT_RECOVERY_SEC=0`：无限等待板子进入 recovery
- `LOGIN_USER/LOGIN_PASS` 为空时，会跳过登录流程，直接发送检查命令
- 如串口自动选口不准确，可指定 `SERIAL_PORT=/dev/ttyUSB0` 和 `SERIAL_BAUD=115200`

## 一键"加包并重刷验证"

```bash
cd /home/ubuntu/imx6ull-pro_linux5.4.47
./flash_usb_shell/add_pkg_flash_verify.sh BR2_PACKAGE_SL "uname -a; which sl; TERM=vt100 sl -l >/dev/null 2>&1; echo SL_RC:$?"
```

## 默认执行策略（无需人工按键）

| 状态 | 自动执行流程 |
|------|--------------|
| 已在 Linux 串口可登录 | 脚本自动发送 `reboot`，自动抢占 U-Boot，自动执行 `fastboot 0`，再自动 `uuu` 刷写 |
| 已在 U-Boot 串口 | 脚本自动发送 `fastboot 0`，然后自动 `uuu` 刷写 |
| `reboot_mode=usb_sdp` 链路已安装 | 脚本触发重启并走 SDP 刷写链路 |

## imx6ull-pro 主板专项说明

- 当前系统常见为 `root` 无密码直接进 shell，不一定出现 `Password:` 提示
- 现阶段建议优先使用 `io --send` 直发命令验证，避免等待 `Password:` 超时

## 错误复盘清单

| 错误 | 原因 | 修复 |
|------|------|------|
| `can't find ext name in path: >_flash.bin` | `uuu -b emmc_all` 需要 `_flash.bin/_image` 别名 | 创建软链接 |
| `LIBUSB_ERROR_NO_DEVICE`（在 `FB: ucmd reset` 后） | 目标复位导致 USB 断链 | 预期现象，继续流程 |
| `Loading Environment ... bad CRC` | U-Boot 环境丢失 | 重新写入关键环境变量并 `saveenv` |
| `mmcroot=/dev/mmcblk1p2` 与实际设备不符 | DTB 与实际设备不匹配 | 使用 `imx6ull-14x14-evk.dtb` |
