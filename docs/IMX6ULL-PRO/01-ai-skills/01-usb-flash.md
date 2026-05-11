---
sidebar_label: 'USB 烧录'
title: 'USB SDP / Fastboot 烧录方法'
---

# USB 系统烧录

本章节介绍通过 NXP UUU 工具进行 USB 烧录的两种方法：ROM SDP 模式和 U-Boot Fastboot 模式。

## 烧录方式 1：ROM SDP 模式

适用于板子在 SDP 模式，或通过 U-Boot `bmode usb` 自动切入 SDP。

```bash
cd /home/ubuntu/imx6ull-pro_linux5.4.47
sudo ./uuucli/build/uuu/uuu -v -b emmc_all \
  ./buildroot-2026.02.1/output/images/u-boot-dtb.imx \
  ./buildroot-2026.02.1/output/images/sdcard.img
```

### UUU 自定义脚本

```bash
cat > emmc_all.uuu <<'EOF'
SDP: boot -f u-boot-dtb.imx
FB: ucmd setenv fastboot_dev mmc
FB: ucmd mmc dev 1
FB: flash -raw2sparse all sdcard.img
FB: done
EOF

cd /home/ubuntu/imx6ull-pro_linux5.4.47/buildroot-2026.02.1/output/images
uuu -V emmc_all.uuu
```

## 烧录方式 2：U-Boot Fastboot 模式

先确保目标已进入 `fastboot 0`，再执行：

```bash
cd /home/ubuntu/imx6ull-pro_linux5.4.47
./flash_usb_shell/way2_recovery_flash.sh
```

在 U-Boot 串口控制台执行：
```bash
=> fastboot 0
```

然后在主机侧执行：
```bash
cd /home/ubuntu/imx6ull-pro_linux5.4.47/buildroot-2026.02.1/output/images
sudo /home/ubuntu/imx6ull-pro_linux5.4.47/uuucli/build/uuu/uuu -v flash_from_fb_local.uuu
```

## 一键自动流程（推荐）

```bash
cd /home/ubuntu/imx6ull-pro_linux5.4.47
./flash_usb_shell/add_pkg_flash_verify.sh BR2_PACKAGE_HTOP "uname -a; htop -v || true"
```

用途：启用包 -> 编译 -> 自动进 fastboot -> 烧录 -> 串口验证。

## dd 烧录方案（Linux 主机）

### 整盘写入（推荐）

```bash
IMG=/home/ubuntu/imx6ull-pro_linux5.4.47/buildroot-2026.02.1/output/images
EMMC_DEV=/dev/mmcblk1   # 按实际修改，务必确认不是系统盘

sudo umount ${EMMC_DEV}p* 2>/dev/null || true
sudo dd if=${IMG}/sdcard.img of=${EMMC_DEV} bs=4M status=progress conv=fsync,notrunc
sync
sudo partprobe ${EMMC_DEV} || true
```

### 仅更新 U-Boot

```bash
IMG=/home/ubuntu/imx6ull-pro_linux5.4.47/buildroot-2026.02.1/output/images
EMMC_DEV=/dev/mmcblk1

sudo dd if=${IMG}/u-boot-dtb.imx of=${EMMC_DEV} bs=1K seek=1 status=progress conv=fsync,notrunc
sync
```

## UMS 转出块设备

```bash
cat > emmc_ums.uuu <<'EOF'
SDP: boot -f u-boot-dtb.imx
FB: ucmd mmc dev 1
FB: ucmd ums 0 mmc 1
EOF

cd /home/ubuntu/imx6ull-pro_linux5.4.47/buildroot-2026.02.1/output/images
uuu -V emmc_ums.uuu
# 主机出现 /dev/sdX 后执行:
# sudo dd if=sdcard.img of=/dev/sdX bs=4M status=progress conv=fsync,notrunc
# sync
```

## 自动烧录与串口验证

主脚本：`flash_usb_shell/auto_flash_and_serial.sh`

```bash
cd /home/ubuntu/imx6ull-pro_linux5.4.47
WAIT_RECOVERY_SEC=0 \
LOGIN_USER=root \
LOGIN_PASS=123456 \
CHECK_CMD="uname -a" \
./flash_usb_shell/auto_flash_and_serial.sh
```

## 常见问题

### Timeout: Wait for Known USB Device
板子未进 recovery 或 USB 线/供电异常

### libusb requires write access
需要 root 权限；当前脚本已自动 `sudo`

### LIBUSB_ERROR_NO_DEVICE（在 `FB: ucmd reset` 后）
目标复位导致 USB 断链，属预期现象，随后重新枚举并继续流程

### Starting kernel 后重启或卡住
优先排查 DTB/eMMC 时序问题。推荐优先使用 `imx6ull-14x14-evk.dtb`

## 启动验证

- 能进入 U-Boot
- `mmc list` 能看到 eMMC
- `zImage` + `imx6ull-14x14-evk.dtb` 可正常启动
- 根文件系统可挂载并进入 shell
