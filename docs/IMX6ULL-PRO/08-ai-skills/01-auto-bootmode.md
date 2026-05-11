---
sidebar_label: '自动切换启动模式'
title: 'AI 技能：自动 Bootmode 切换'
---

# AI 技能：自动 Bootmode 切换

:::info 技能说明
在不手动拨码的前提下，实现两种升级入口：ROM USB SDP（给 uuu `-b emmc_all` 用）和 U-Boot Recovery/Fastboot（给 uuu `FB:` 或 fastboot 用）。
:::

## 文件位置

| 文件 | 说明 |
|------|------|
| `flash_usb_shell/uboot_mode_setup.txt` | 模式安装命令 |
| `flash_usb_shell/linux_reboot_mode.sh` | Linux 触发脚本 |
| `flash_usb_shell/way2_recovery_flash.sh` | Recovery 刷写脚本 |
| `flash_usb_shell/BOOT_MODE_STRATEGY.md` | 方案说明文档 |

## 先决条件

1. U-Boot 支持 `bmode` 与 `fastboot`（当前工程已具备）
2. Linux 安装 `u-boot-tools`（提供 `fw_setenv`）
3. 正确配置 `/etc/fw_env.config`

## 一次性安装（U-Boot）

在 U-Boot 控制台执行 `uboot_mode_setup.txt` 里的命令，完成：
- 保存原始 `bootcmd`
- 注入 `reboot_mode` 分支
- 新增 `reboot_to_usb_sdp / reboot_to_recovery / reboot_to_normal`

## Linux 触发方式

```bash
cd /home/ubuntu/imx6ull-pro_linux5.4.47
./flash_usb_shell/linux_reboot_mode.sh usb_sdp
# 或
./flash_usb_shell/linux_reboot_mode.sh recovery
```

## U-Boot 触发方式

```bash
run reboot_to_usb_sdp
# 或
run reboot_to_recovery
```

## 方式1实测命令（主机侧）

```bash
cd /home/ubuntu/imx6ull-pro_linux5.4.47/buildroot-2026.02.1/output/images
cat > test_mode1_usb_sdp.uuu <<'EOF'
uuu_version 1.4.193
SDP: boot -f u-boot-dtb.imx -scanlimited 0x800000
FB: ucmd mmc dev 1
FB: ucmd setenv reboot_mode usb_sdp
FB: ucmd saveenv
FB: ucmd reset
FB: done
EOF
sudo /home/ubuntu/imx6ull-pro_linux5.4.47/uuucli/build/uuu/uuu -v test_mode1_usb_sdp.uuu
```

## Recovery 下主机刷写

```bash
cd /home/ubuntu/imx6ull-pro_linux5.4.47
./flash_usb_shell/way2_recovery_flash.sh
```

## 无人值守执行约定

当串口与 USB 已连接时，后续默认由脚本自动完成：
- Linux 下 `reboot` -> 抢占 U-Boot -> `fastboot 0` -> `uuu` 刷写 -> 串口验证
- U-Boot 下直接 `fastboot 0` -> `uuu` 刷写 -> 串口验证
- 不再要求人工卡倒计时按键

## 现场排障要点

| 问题 | 解决方案 |
|------|----------|
| 设置 `reboot_mode=usb_sdp` 后仍然 `Normal Boot` | 检查 `bootcmd` 是否真的包含 `reboot_mode` 分支 |
| 频繁被打断停在 `=>` | 禁止后台持续发送 `Ctrl+C` |
| 刷写后反复重启且卡在 `Starting kernel ...` | 优先排查 DTB/eMMC 时序问题 |
| 清理模式分流影响 | `setenv reboot_mode; saveenv; reset` |
