---
sidebar_position: 6
---

# 快速入门指南

::: tip 指南
本指南将帮助你快速上手 AI 辅助嵌入式开发环境。
:::

## 环境准备

### 安装 Claude Code CLI

```bash
# 参考 Claude Code 官方文档安装
# https://docs.anthropic.com/en/docs/claude-code

# 验证安装
claude --version
```

### 进入 SDK 目录

```bash
cd /path/to/tina-v861
```

### 启动 Claude Code

```bash
claude
```

## 基本使用流程

### 1. 询问构建相关问题

**用户**: 如何编译整个 SDK？

**AI**: 引导用户完成配置和编译流程

### 2. 询问驱动配置问题

**用户**: 如何配置 UART1 串口？

**AI**: 提供详细的设备树配置和内核配置指导

### 3. 询问问题诊断

**用户**: 系统启动后串口无输出，可能是什么原因？

**AI**: 分析可能的原因并提供排查步骤

## 常用导航命令

| 命令 | 说明 |
|------|------|
| `ck` | 进入内核源码目录 |
| `cdts` | 进入设备树目录 |
| `ckout` | 进入内核输出目录 |

## 编译命令参考

### 首次构建 SDK

```bash
# 1. 初始化环境
source build/envsetup.sh

# 2. 选择配置
lunch

# 3. 编译整个 SDK
m -j$(nproc)

# 4. 打包固件
pack
```

### 只编译内核

```bash
# 修改了设备树后，只重新编译内核
mkernel

# 重新打包固件
pack
```

### 切换工具链

```bash
# 注意：切换前需要清理
make distclean

# 切换到 glibc
quick_config glibc_toolchain

# 重新编译
m -j$(nproc)
pack
```

## 常见问题

### Q1: 如何让 AI 使用 Skills？

在 CLAUDE.md 中添加 Skills 检索指令，确保 AI 能够主动搜索相关技能文档。

### Q2: AI 生成的文件在哪里查看？

AI 可以直接编辑项目中的文件，包括：
- 源文件（`*.c`, `*.h`）
- 设备树（`*.dts`, `*.dtsi`）
- 配置文件（`Makefile`, `Kconfig`）

### Q3: 如何查看 AI 执行过的命令？

在 Claude Code 交互界面中，可以查看历史命令执行记录。

## 进阶操作

### 配合 CLAUDE.md 使用

可以在子目录中创建 CLAUDE.md 来提供特定上下文：

```bash
# UART 驱动特定指令
bsp/drivers/uart/CLAUDE.md

# V861 特定指令
device/config/chips/v861/CLAUDE.md
```

### Memory 持久化

Claude Code 支持持久化记忆，可以保存：

- 项目特定约定
- 常用配置路径
- 解决过的问题

**Memory 文件位置**：
```
.claude/memory/
```

## 下一步

- [开发场景指南](./06-Dev-Scenarios.md) - 实际使用案例
- [问题诊断与调试](./07-Debugging.md) - 排查问题
- [自定义 Skills](./08-Custom-Skills.md) - 扩展能力