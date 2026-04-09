---
sidebar_position: 9
---

# 自定义 Skills 开发

::: tip 扩展
如果 SDK 中没有覆盖你的需求，可以添加自定义 Skill 来扩展 AI 辅助能力。
:::

## 概述

自定义 Skills 允许开发者根据项目需求创建专属的技术知识库，使 AI Agent 能够更好地理解和处理特定领域的开发问题。

## 添加自定义 Skills

### 步骤 1：创建 Skill 目录

```bash
# 在适当位置创建目录
mkdir -p skills/custom/my_driver
```

### 步骤 2：编写 SKILL.md

```yaml
---
name: my_driver
description: 自定义驱动开发指南。用于 XXX 驱动的开发和调试。
---

# XXX 驱动开发指南

## 概述

...

## 源码位置

...

## 配置方法

...

## 使用示例

...
```

### 步骤 3：更新索引

在对应模块的 README.md 中添加新 Skill 条目。

## 配合 CLAUDE.md 使用

可以在子目录中创建 CLAUDE.md 来提供特定上下文：

```bash
# UART 驱动特定指令
bsp/drivers/uart/CLAUDE.md

# V861 特定指令
device/config/chips/v861/CLAUDE.md
```

### CLAUDE.md 示例

```markdown
# V861 UART 驱动特定指令

## 编译注意事项

使用交叉编译器 `riscv64-unknown-linux-musl-` 进行编译。

## 调试技巧

- 使用 `pr_debug()` 代替 `printk()` 进行详细调试
- 启用 `DEBUG` 宏获取更多调试信息

## 相关文件位置

- 驱动源码: `lichee/linux-6.6/drivers/tty/serial/sunxi-uart.c`
- 设备树: `device/config/chips/v861/configs/board.dts`
```

## 最佳实践

### 1. 命名规范

| 元素 | 规范 | 示例 |
|------|------|------|
| 目录名 | 使用下划线分隔 | `uart_driver`, `spi_flash` |
| 文件名 | 使用 SKILL.md | `uart_driver/SKILL.md` |
| name | 简短有意义 | `uart_driver` |
| description | 15-30 字描述 | "UART 驱动配置和问题排查指南" |

### 2. 内容结构

建议的 SKILL.md 结构：

```markdown
---
name: skill_name
description: 简短描述
---

# 技能标题

## 概述
简单介绍这个技能解决的问题

## 源码位置
相关源代码路径

## 配置方法
配置步骤和参数说明

## 使用示例
具体使用示例代码

## 调试方法
常见问题排查方法

## 相关文件
相关配置和参考文件
```

### 3. 更新维护

- 定期更新 Skills 内容以反映最新的 SDK 变化
- 在 README.md 中添加清晰的索引
- 保持 description 的准确性，以便 AI 正确匹配

## 示例：自定义 GPIO 驱动 Skill

### 目录结构

```
skills/custom/
├── README.md
└── my_gpio_driver/
    ├── SKILL.md
    └── CLAUDE.md
```

### SKILL.md 内容

```yaml
---
name: my_gpio_driver
description: 自定义 GPIO 驱动开发指南。包含驱动框架、调试方法和常见问题解决方案。
---

# 自定义 GPIO 驱动开发指南

## 概述

本文档介绍如何在 V861 平台上开发自定义 GPIO 驱动。

## 源码位置

- 驱动源码: `module/gpio-driver/`
- 测试应用: `module/gpio-test/`
- 设备树: `device/config/chips/v861/configs/board.dts`

## 配置方法

### 1. 设备树配置

```dts
&pio {
    gpio_driver {
        compatible = "custom,gpio-driver";
        status = "okay";
        gpio-num = <8>;
    };
};
```

### 2. 内核配置

```bash
make menuconfig
# Device Drivers -> GPIO Drivers -> Custom GPIO Driver
```

## 使用示例

### 加载驱动

```bash
insmod gpio_driver.ko
```

### 使用示例

```c
#include <linux/gpio_driver.h>

int ret = gpio_driver_request(4, "LED");
gpio_driver_set_value(4, 1);
```

## 调试方法

### 查看驱动日志

```bash
dmesg | grep gpio_driver
```

### 测试接口

```bash
echo 4 > /sys/class/gpio_driver/test
```

## 相关文件

- `lichee/linux-6.6/drivers/gpio/gpio-custom.c`
- `device/config/chips/v861/configs/board.dts`
```

### CLAUDE.md 内容

```markdown
# 自定义 GPIO 驱动特定指令

## 编译方法

```bash
make ARCH=riscv CROSS_COMPILE=riscv64-unknown-linux-musl- -C lichee/linux-6.6 M=module/gpio-driver
```

## 调试技巧

1. 使用 `gpio_driver_debug()` 打印详细信息
2. 查看 `/proc/gpio_driver/status` 获取运行时状态
3. 使用示波器验证 GPIO 输出

## 已知问题

- 在多核环境下需要注意竞态条件
- DMA 模式下需要确保内存对齐
```

## 相关文档

- [AI Agent 辅助开发概述](./03-AI-Agent-Overview.md)
- [Skills 系统介绍](./04-Skills-System.md) - 了解现有 Skills 结构
- [快速入门指南](./05-Quick-Start.md) - 如何使用 Skills
- [开发场景指南](./06-Dev-Scenarios.md) - 实际应用案例