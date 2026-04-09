---
sidebar_position: 5
---

# Skills 知识库系统

::: tip 说明
Skills 系统是 SDK 内置的专业技术知识库，为 AI Agent 提供精准的技术指导。
:::

## 目录结构

```
skills/
├── README.md                    # Skills 主索引
├── sdk/                         # SDK 构建与配置相关 Skills
├── device/                      # 芯片设备配置相关 Skills
│   └── v861/
│       ├── dts/                 # 设备树配置相关 Skills
│       ├── gpio/                # GPIO 引脚配置相关 Skills
│       └── v861_intro/          # V861 芯片介绍相关 Skills
├── bsp/                         # BSP 驱动开发相关 Skills
│   ├── bsp_intro/               # BSP 介绍相关 Skills
│   └── drivers/                 # 驱动相关 Skills
├── melis/                       # Melis RTOS 相关 Skills
└── eyesee-mpp/                  # 多媒体中间件相关 Skills
    └── middleware/              # MPP 组件技能相关 Skills
```

## Skills 知识库

SDK 内置了丰富的 Skills 知识库，为 AI Agent 提供专业的技术支撑：

| 类别 | 覆盖领域 |
|------|----------|
| SDK 构建 | 编译命令、快速配置、环境管理 |
| 设备配置 | 设备树、GPIO、引脚复用 |
| BSP 驱动 | UART、SPI、I2C、网络、存储、多媒体 |
| RTOS | Melis 调试、驱动移植、编译系统 |
| 多媒体 | MPP 框架、摄像头、编码器 |

## SKILL.md 文件格式

每个 Skill 使用 YAML front matter 格式：

```yaml
---
name: skill-name
description: 简短描述该技能的用途和使用场景
---

# 技能标题

详细的技术文档内容...

## 源码位置

## 配置方法

## 使用示例

## 调试方法

## 相关文件
```

### 关键元素

| 元素 | 说明 |
|------|------|
| `name` | 技能唯一标识符 |
| `description` | 用于 AI 自动匹配用户问题 |

## Skills 使用方式

为了兼容多个 AI 平台，默认提供的 Skills 不会自动被触发。SKILL.md 文件是普通 Markdown 文档，在使用的时候 Claude 不会自动扫描或匹配它们。要让 Claude 使用 Skills，需要在 CLAUDE.md 中添加明确的检索指令。

## 配置方法

在 CLAUDE.md 中添加 Skills 检索指令：

```markdown
## Skills System

**IMPORTANT: You MUST proactively search and read relevant skills when handling user requests.**

......
```

### 为什么需要这样配置？

| 原因 | 说明 |
|------|------|
| **无自动索引机制** | YAML front matter 中的 description 只是文档内容，不会被自动匹配 |
| **需要显式指令** | Claude 必须被告知去搜索 skills 目录 |
| **上下文限制** | 无法将所有 skills 加载到上下文中，需要按需检索 |

## 检索流程

```
用户问题: "如何配置 UART1？"
    ↓
Claude 根据 CLAUDE.md 指令执行:
    ↓
Glob skills/**/SKILL.md (找到所有 skills)
    ↓
Grep "uart" skills/ (搜索关键词)
    ↓
Read skills/bsp/drivers/uart/SKILL.md (读取相关 skill)
    ↓
基于 skill 内容回答用户
```

## 常用 Skills 快速参考

| 场景 | 推荐 Skill | 典型问题示例 |
|------|------------|--------------|
| 编译 SDK | build_sdk | "如何编译内核?" "mkernel 做什么?" |
| 切换配置 | quick_config | "如何切换 glibc 工具链?" |
| 设备树 | dts | "如何添加 I2C 设备?" |
| 引脚配置 | gpio | "PE8 可以用于哪些功能?" |
| 串口驱动 | uart | "如何启用 DMA?" |
| 以太网 | gmac | "如何配置 RMII 模式?" |
| 摄像头 | vin-overview | "如何添加新摄像头?" |
| 崩溃分析 | coredump_analysis | "程序崩溃如何分析?" |
| RTOS 调试 | melis-debug | "RTOS 启动失败怎么办?" |

## 最佳实践

### 提问技巧

**好的提问示例：**

> 用户: 我想在 V861 上启用 UART2，波特率 1500000，使用 DMA。请问如何配置设备树？

Claude: 根据 uart skill，配置步骤如下：

1. 启用 UART2 节点并配置 DMA：
```dts
&uart2 {
    pinctrl-names = "default";
    pinctrl-0 = <&uart2_pins>;
    dmas = <&dma 16>, <&dma 16>;
    dma-names = "tx", "rx";
    status = "okay";
};
```

2. 配置引脚：
```dts
uart2_pins: uart2-pins {
    pins = "PA8", "PA9";
    function = "uart2";
};
```

3. 设置波特率（在 chosen 节点或内核参数）：
```
console=ttyS2,1500000
```

**不好的提问示例：**

> 用户: 串口不工作怎么办？

Claude: 请提供更多信息：
1. 是哪个串口？
2. 具体现象是什么？（无输出？乱码？）
3. 提供相关日志
4. 当前的配置是什么？

### 信息收集清单

在提问前，准备好以下信息：

- SDK 版本和板型配置
- 问题描述和复现步骤
- 相关串口日志
- 已尝试的解决方法
- 修改过的配置文件

## 常见问题速查

| 问题 | 参考 Skill | 快速答案 |
|------|------------|----------|
| 如何编译 SDK？ | build_sdk | `source build/envsetup.sh && lunch && m -j$(nproc) && pack` |
| 如何只编译内核？ | build_sdk | `mkernel` |
| 如何切换工具链？ | quick_config | `quick_config glibc_toolchain` |
| 如何配置引脚？ | gpio, dts | 查看 v861-pinouts.csv |
| 如何添加 I2C 设备？ | twi, dts | 在 &twi 节点添加子节点 |
| 如何分析崩溃？ | coredump_analysis | 使用 GDB 分析 core 文件 |
| RTOS 如何调试？ | melis-debug | 根据问题类型调度专项 skill |

## 相关文档

- [AI Agent 辅助开发概述](./03-AI-Agent-Overview.md) - 了解整体架构
- [快速入门指南](./05-Quick-Start.md) - 开始使用 Skills
- [开发场景指南](./06-Dev-Scenarios.md) - 实际使用案例
- [自定义 Skills](./08-Custom-Skills.md) - 添加自定义技能