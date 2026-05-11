---
sidebar_label: 'Buildroot 编译指南'
title: 'AI 技能：Buildroot eMMC 编译与烧录'
---

# AI 技能：Buildroot eMMC 编译与烧录

:::info 技能说明
基于 Buildroot 2026.02.1 的完整 eMMC 交付流程，从源码到编译产物再到 dd/uuu 烧写。
:::

## 目录约定

```bash
WORK=/home/ubuntu/imx6ull-pro_linux5.4.47
BR=$WORK/buildroot-2026.02.1
IMG=$BR/output/images
```

## 准备源码与 Buildroot

```bash
cd $WORK

# U-Boot / Linux
git clone https://gitee.com/weidongshan/uboot-imx
git clone https://gitee.com/weidongshan/linux-imx

# Buildroot
wget -c https://buildroot.org/downloads/buildroot-2026.02.1.tar.gz
tar -xf buildroot-2026.02.1.tar.gz
```

## 生成本地源码 tarball

```bash
mkdir -p $WORK/sources
cd $WORK
tar --exclude-vcs --exclude='./sources/*' -czf sources/uboot-imx-100ask-local.tar.gz uboot-imx
tar --exclude-vcs --exclude='./sources/*' -czf sources/linux-imx-100ask-local.tar.gz linux-imx
```

## 编译全流程

```bash
cd $BR
make 100ask_imx6ull-pro_defconfig
make -j8
```

## 产物检查

```bash
ls -lh $IMG
```

重点文件：
- `u-boot-dtb.imx`
- `zImage`
- `imx6ull-14x14-evk.dtb`（当前实机推荐）
- `rootfs.ext2`（链接 `rootfs.ext4`）
- `sdcard.img`

## eMMC 烧录（dd 方案）

### 整盘写入

```bash
IMG=/home/ubuntu/imx6ull-pro_linux5.4.47/buildroot-2026.02.1/output/images
EMMC_DEV=/dev/mmcblk1

sudo umount ${EMMC_DEV}p* 2>/dev/null || true
sudo dd if=${IMG}/sdcard.img of=${EMMC_DEV} bs=4M status=progress conv=fsync,notrunc
sync
```

### 仅更新 U-Boot

```bash
sudo dd if=${IMG}/u-boot-dtb.imx of=${EMMC_DEV} bs=1K seek=1 status=progress conv=fsync,notrunc
sync
```

## eMMC 烧录（uuu 方案）

```bash
cat > emmc_all.uuu <<'EOF'
SDP: boot -f u-boot-dtb.imx
FB: ucmd setenv fastboot_dev mmc
FB: ucmd mmc dev 1
FB: flash -raw2sparse all sdcard.img
FB: done
EOF

cd $IMG
uuu -V emmc_all.uuu
```

## 实机校正

- `imx6ull-14x14-evk-emmc.dtb` 可能触发 eMMC 初始化不稳定（`mmc1: error -110`）
- 实机闭环采用：`imx6ull-14x14-evk.dtb` + `usdhc2` 保守参数（4bit、`no-1-8-v`、50MHz）
- 判据：启动日志出现 `mmcblk1: ... p1 p2`、`EXT4-fs ... mounted`、`buildroot login`
