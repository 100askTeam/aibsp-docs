---
sidebar_position: 8
---

# 问题诊断与调试

::: tip 指南
本章节介绍如何利用 AI 辅助进行问题诊断与调试，提高排查效率。
:::

## 串口日志分析流程

当遇到启动或运行问题时，提供串口日志可帮助快速定位问题。

### 提供信息清单

请提供以下信息以便分析：

#### 1. 【问题描述】

- 具体现象是什么？
- 是偶发还是必现？
- 有没有错误提示？

#### 2. 【串口日志】

- 完整的启动日志（从上电开始）
- 出错前后的日志片段

#### 3. 【环境信息】

- SDK 版本
- 板型配置（lunch 选择的配置）
- 是否有修改过代码/配置

#### 4. 【复现步骤】

- 如何复现问题？

## 日志分析示例

### 示例 1：U-Boot 启动失败

**用户提供日志**：

```
[00.000] U-Boot 2023.04 (Mar 01 2024 - 10:00:00 +0800)
[00.100] DRAM: 128 MiB
[00.200] Loading Environment from SPI Flash...
[00.300] *** Warning - bad CRC, using default environment
[00.400] Hit any key to stop autoboot: 0
[00.500] Failed to load kernel
```

**Claude 分析**：

根据日志分析，问题在于：

1. "bad CRC" 表示 U-Boot 环境变量损坏
2. "Failed to load kernel" 表示内核加载失败

**可能原因**：

1. 内核镜像损坏或不存在
2. 启动参数配置错误
3. 存储介质问题

**建议操作**：

1. 进入 U-Boot 命令行（启动时按任意键）
2. 检查内核加载命令：

```
=> printenv bootcmd
```

3. 手动加载内核测试：

```
=> sf probe
=> sf read 0x40000000 0x100000 0x600000
=> bootm 0x40000000
```

### 示例 2：内核启动失败

**用户提供日志**：

```
[    0.000000] Linux version 6.6.0-xuantie
[    0.500000] Cannot find devtmpfs
[    0.600000] Kernel panic - not syncing: VFS: Unable to mount root fs
```

**Claude 分析**：

根据日志，内核无法挂载根文件系统。

**可能原因**：

1. 根文件系统类型未配置正确
2. 存储设备未识别
3. 内核缺少必要的驱动

**检查内核配置**：

```bash
make menuconfig
# 确保启用：
# - Device Drivers -> Block devices -> Loopback device
# - File systems -> Pseudo filesystems -> /proc, /sys, /devtmpfs
```

**检查启动参数**：

```bash
cat device/config/chips/v861/configs/<board>/env.cfg
# 查看 root= 参数是否正确
```

## Coredump 分析

当应用程序崩溃时，可以使用 coredump 分析崩溃原因。

### 步骤 1：在设备上启用 coredump

```bash
# 启用 core dump
ulimit -c unlimited

# 设置 core 文件位置
echo "/tmp/core.%e.%p" > /proc/sys/kernel/core_pattern

# 运行程序，崩溃后会在 /tmp 生成 core 文件
./your_program
```

### 步骤 2：使用 GDB 分析

```bash
# 找到 GDB 工具链
find prebuilt -name "*-gdb"

# 设置变量
COREDUMP=/tmp/core.your_program.1234
APP=/path/to/your_program
ROOTFS=out/v861/your_board/openwrt/staging_dir/target/root-v861-*

# 使用 GDB 分析
riscv32-unknown-linux-musl-gdb $APP \
    -ex "set sysroot $ROOTFS" \
    -ex "core-file $COREDUMP" \
    -ex "bt full"
```

### 示例分析

**用户提供**：程序 vi2venc 崩溃，coredump 已生成。

**Claude 分析**：

根据 coredump_analysis skill，使用以下命令分析：

```bash
# 找到工具链
GDB=$(find prebuilt -name "riscv32-unknown-linux-musl-gdb" | head -1)

# 设置路径
APP=out/v861/ipc/openwrt/bin/vi2venc
COREDUMP=/tmp/core.vi2venc.1234
ROOTFS=out/v861/ipc/openwrt/staging_dir/target/root-v861-ipc

# 分析
$GDB $APP -ex "set sysroot $ROOTFS" -ex "core-file $COREDUMP" -ex "bt"

# 输出示例：
#0  0x40123456 in func_a (ptr=0x0) at src/module.c:100
#1  0x40123789 in func_b () at src/main.c:50
#2  0x40123abc in main () at src/main.c:30
```

**问题定位**：func_a 中访问了空指针 (ptr=0x0)

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

## AI 辅助调试技巧

### 1. 提供完整的上下文

向 AI 描述问题时，包含：
- 设备型号和 SDK 版本
- 完整的日志输出
- 已尝试的排查步骤
- 最近的代码改动

### 2. 使用结构化提问

**推荐格式**：

```
【问题】具体现象描述
【环境】SDK 版本: xxx, 板型: xxx
【日志】相关日志片段
【已尝试】已排查的步骤
```

### 3. 验证 AI 建议

AI 给出的建议可能不是最优解，建议：
- 查阅官方文档确认
- 在测试环境先验证
- 记录成功/失败的排查经验

## 相关文档

- [AI Agent 辅助开发概述](./03-AI-Agent-Overview.md)
- [Skills 系统介绍](./04-Skills-System.md) - 利用 Skills 快速定位
- [开发场景指南](./06-Dev-Scenarios.md) - 常见开发问题处理