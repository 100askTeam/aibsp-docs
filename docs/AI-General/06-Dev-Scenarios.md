---
sidebar_position: 7
---

# 开发场景指南

::: tip 实践
本指南提供常见的开发场景实战案例，展示如何利用 AI 辅助高效完成开发任务。
:::

## SDK 构建场景

### 场景 1：首次构建 SDK

**用户**: 请帮我构建一个固件，我的板子使用 GC2083 摄像头，板子使用 eMMC 存储

**AI 执行流程**:

1. 查看相关配置和技能
2. 提问确认细节（摄像头数量、lane数、开发板型号）
3. 确认完成后提交
4. 执行编译操作，等待输出固件

**AI 编译完成后的输出**:
- 固件镜像文件
- 编译日志
- 可能的警告或错误提示

### 场景 2：只编译内核

**用户**: 修改了设备树，如何只重新编译内核？

**AI**: 使用以下命令：

```bash
# 编译内核和设备树
mkernel

# 重新打包固件
pack
```

**导航命令**:

| 命令 | 说明 |
|------|------|
| `ck` | 进入内核源码目录 |
| `cdts` | 进入设备树目录 |
| `ckout` | 进入内核输出目录 |

### 场景 3：切换工具链

**用户**: 如何从 musl 切换到 glibc？

**AI**:

```bash
# 注意：切换前需要清理
make distclean

# 切换到 glibc
quick_config glibc_toolchain

# 重新编译
m -j$(nproc)
pack
```

## 驱动开发场景

### 场景 1：添加新的 I2C 设备

**用户**: 如何在 I2C0 上添加一个温度传感器 LM75？

**AI**: 根据 twi 和 dts skill，步骤如下：

#### 步骤 1: 修改设备树

在 `board.dts` 的 `&twi0` 节点下添加子节点：

```dts
&twi0 {
    status = "okay";
    lm75: lm75@48 {
        compatible = "national,lm75";
        reg = <0x48>;
    };
};
```

#### 步骤 2: 启用内核驱动

```bash
make menuconfig
# 路径: Device Drivers -> Hardware Monitoring -> LM75
```

#### 步骤 3: 重新编译

```bash
mkernel
pack
```

### 场景 2：配置 SPI Flash

**用户**: 如何启用 SPI NOR Flash 支持？

**AI**: 根据 spi 和 mtd skill：

#### 步骤 1: 检查设备树

```dts
&spif {
    clock-frequency = <100000000>;
    status = "okay";
    spif-nor {
        compatible = "jedec,spi-nor";
        status = "okay";
    };
};
```

#### 步骤 2: 启用内核配置 MTD

```bash
make menuconfig
# 启用:
# - MTD support
# - SPI NOR device support
```

#### 步骤 3: 用户空间访问

```bash
# 查看 MTD 分区
cat /proc/mtd

# 擦除分区
flash_erase /dev/mtd0 0 0
```

## 设备树配置场景

### 场景 1：修改 CPU 频率

**用户**: 如何启用 1.368GHz 的 CPU 频率？

**AI**: 根据 dts skill，修改 OPP 表：

在 `board.dts` 中覆盖 OPP 状态：

```dts
&cluster0_opp_table {
    opp@1368000000 {
        status = "okay";  /* 默认为 disabled */
    };
};
```

重新编译设备树：

```bash
mkernel
pack
```

### 场景 2：配置显示屏

**用户**: 如何配置 RGB 显示屏？

**AI**: 根据 dts skill：

#### 步骤 1: 启用显示相关节点

```dts
&vo0 {
    status = "okay";
};

&rgb0 {
    status = "okay";
    pinctrl-0 = <&rgb24_PD_pins_default>;
};
```

#### 步骤 2: 配置时序

在 panel 节点中配置显示时序：

```dts
panel@0 {
    compatible = "simple-panel";
    power-supply = <&reg_lcd_power>;
    display-timings {
        native-mode = <&timing0>;
        timing0: timing0 {
            clock-frequency = <30000000>;
            hactive = <800>;
            vactive = <480>;
            hfront-porch = <40>;
            hback-porch = <40>;
            hsync-len = <48>;
            vfront-porch = <13>;
            vback-porch = <29>;
            vsync-len = <3>;
        };
    };
};
```

## 多媒体开发场景

### 场景 1：配置摄像头

**用户**: 如何添加 GC4663 摄像头？

**AI**: 根据 vin-sensor-porting skill：

#### 步骤 1: 添加传感器配置

```dts
&vind0 {
    sensor0: sensor@5812000 {
        sensor0_mname = "gc4663_mipi";
        sensor0_twi_addr = <0x52>;
        sensor0_twi_id = <0>;
        sensor0_reset = <&pio PA 18 GPIO_ACTIVE_LOW>;
        status = "okay";
    };
};
```

#### 步骤 2: 配置 MIPI 接口

```dts
&mipi0 {
    status = "okay";
};
```

#### 步骤 3: 确保驱动已启用

```bash
make menuconfig
# Allwinner BSP -> VIN Drivers -> GC4663 sensor
```

## 常见问题排查

### 启动类问题

| 现象 | 可能原因 | 排查方法 |
|------|----------|----------|
| 无任何输出 | 电源/串口问题 | 检查电源、串口线连接 |
| U-Boot 无输出 | SPL 未运行 | 检查 boot0 是否烧录正确 |
| 内核无输出 | 控制台配置错误 | 检查 console 参数、stdout-path |
| 挂载根文件系统失败 | 存储驱动未启用 | 检查内核配置、存储设备识别 |

### 驱动类问题

| 现象 | 可能原因 | 排查方法 |
|------|----------|----------|
| 设备节点不存在 | 驱动未加载/未启用 | 检查设备树 status、内核配置 |
| 通信失败 | 引脚配置错误 | 检查 pinctrl、引脚冲突 |
| 中断不触发 | 中断配置错误 | 检查 interrupts 属性 |
| DMA 失败 | 内存/通道配置 | 检查 dma 属性、内存保留区 |

## 相关文档

- [AI Agent 辅助开发概述](./03-AI-Agent-Overview.md)
- [Skills 系统介绍](./04-Skills-System.md)
- [问题诊断与调试](./07-Debugging.md)