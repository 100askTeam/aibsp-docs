import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

function HeroSection() {
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <h1 className={styles.heroTitle}>
          AI 驱动的嵌入式全栈工程师
        </h1>
        <h2 className={styles.heroTitle} style={{fontSize: '1.8rem', marginTop: '-0.5rem'}}>
          从 i.MX6ULL 到 T113 至 RK3568 的全栈进化
        </h2>
        <p className={styles.heroSubtitle}>
          深度融合 VSCode AI 助手，攻克 Ubuntu 24 环境下的驱动移植、内核主线化与工业应用开发。
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/T113s3-Pro/BoardIntroduction">
            开始学习
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            style={{color: '#fff', borderColor: 'rgba(255,255,255,0.5)'}}
            to="https://github.com/100askTeam/aibsp-docs">
            GitHub 仓库
          </Link>
        </div>
      </div>
    </header>
  );
}

function SocialLinks() {
  return (
    <div className={styles.socialLinks}>
      <a href="https://space.bilibili.com/275908810" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
        </svg>
        B站：世玉轩AI嵌入式
      </a>
      <a href="https://github.com/100askTeam" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
        GitHub：EmbedAI
      </a>
      <Link to="/docs/T113s3-Pro/BoardIntroduction" className={styles.socialLink}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
        </svg>
        课程：AI嵌入式开发
      </Link>
    </div>
  );
}

function RepoStructure() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionTitle}>
          <h2>Git 仓库命名与架构</h2>
          <p>ACE-Embedded-Linux (ACE: AI-Centric Engineering)</p>
        </div>
        <div className={styles.repoStructure}>
          <pre>
{`ACE-Embedded-Linux/
├── .ai-prompts/            # 核心资产：针对驱动、设备树、内核调试的专属提示词库
├── 01_Env_Setup/           # 基于 Ubuntu 24.04 的 Docker 多芯片交叉编译矩阵
├── 02_Hardware_Ingestion/  # AI 辅助：从 PDF 原理图到设备树 (DTS) 自动生成的逻辑
├── 03_Board_Support_Pack/  # 三大平台实战：
│   ├── imx6ull-openwrt/    # 网络与 SDK 适配
│   ├── t113-buildroot/     # 极简系统与显示驱动
│   └── rk3568-debian/      # 高性能边缘计算与主线化 (Mainlining)
├── 04_Driver_Factory/      # AI 辅助驱动工厂：GPIO/I2C/SPI/DMA/V4L2
└── 05_Apps_HAL/            # 硬件抽象层与 AI 辅助工业应用开发`}
          </pre>
        </div>
        <SocialLinks />
      </div>
    </section>
  );
}

const phases = [
  {
    number: '第一阶段',
    title: 'AI 辅助底层架构探索 (Fundamentals)',
    content: [
      '环境统一化：在 Ubuntu 24.04 上构建基于 Docker 的多芯片交叉编译矩阵',
      '芯片手册与原理图 AI 解析：如何将 T113/RK3568 的 PDF 手册转化为 AI 可理解的 Markdown 知识库',
      '实战：使用 AI 从原理图 PDF 中提取 GPIO 矩阵并生成 Device Tree 节点',
    ],
    details: [
      {
        title: '01_Env_Setup：基于 Ubuntu 24.04 的 AI 增强型开发环境',
        items: [
          '现代交叉编译矩阵：利用 Docker 隔离 i.MX6ULL (GCC 7/8)、T113 (GCC 9) 与 RK3568 (GCC 11+) 的工具链冲突',
          'VSCode AI 插件深度集成：配置 Copilot/Cursor 指令，实现底层 C 代码的实时语法纠错与补全',
          'LLM 本地化部署 (可选)：针对机密硬件手册，探讨如何利用 Ollama 建立本地知识库',
        ]
      },
      {
        title: '1.2 芯片手册与原理图 AI 解析：从"人读"到"机器理解"',
        items: [
          'SoC TRM (技术参考手册) 知识库化：如何编写 Prompt 让 AI 快速索引 T113/RK3568 的寄存器基地址',
          '实战：利用 AI 自动生成 IOMUX/PINCTRL 的位偏移对照表',
          '原理图 (PDF) 的视觉识别与提取：使用多模态 AI (Vision LLM) 识别关键外设的 GPIO 引脚号',
        ]
      },
      {
        title: '1.3 实战：AI 引导的 Device Tree (DTS) 自动生成',
        items: [
          '从引脚到节点：通过 AI 将原理图上的引脚分配表，直接翻译成符合 Linux 6.x 规范的 Pinctrl 节点',
          '兼容性 (Compatible) 逻辑匹配：让 AI 协助对比主线内核源码，寻找最匹配的设备驱动兼容性字符串',
        ]
      }
    ]
  },
  {
    number: '第二阶段',
    title: '多维构建系统适配 (Build Systems)',
    content: [
      'Buildroot 深度定制 (T113 Focus)：AI 辅助配置极简文件系统，优化开机速度',
      'OpenWrt SDK 二次开发 (i.MX6ULL Focus)：利用 AI 补全特定硬件的 LUCI 界面与内核补丁',
      'Armbian/Debian 系统迁移 (RK3568 Focus)：在 Ubuntu 24 上通过 AI 脚本自动化制作 RK3568 的 Rootfs',
    ]
  },
  {
    number: '第三阶段',
    title: 'Linux 主线内核 (Mainline) 与驱动重构',
    content: [
      '主线化 (Mainlining) 策略：AI 协助对比厂商内核与 Mainline 内核差异，指导代码合并',
      'T113：MIPI 屏幕驱动调优与 AI 色彩空间校准逻辑',
      'RK3568：NPU/GPU 驱动环境搭建，AI 协助编写 V4L2 视频流采集应用',
      '通用：AI 生成符合 Linux 规范的 Pinctrl 与 Clock 控制逻辑',
    ]
  },
  {
    number: '第四阶段',
    title: 'AI 赋能的调试与性能工程',
    content: [
      '异常分析专家：将串口 Panic Log 喂给 AI，结合源码定位上下文死锁',
      '性能分析：使用 AI 辅助解析 perf 和 ftrace 数据，优化 RK3568 多核负载平衡',
      'CI/CD 自动化：编写 AI 驱动的 GitHub Actions，实现代码提交即触发多芯片云端编译测试',
    ]
  },
  {
    number: '第五阶段',
    title: '综合项目：跨平台边缘 AI 网关',
    content: [
      '目标：在不同芯片（i.MX6U/T113/RK3568）上运行同一套智能业务逻辑',
      '实现：AI 自动生成硬件抽象层 (HAL)，实现一套应用代码，三款芯片无缝运行',
    ]
  }
];

function PhaseSection() {
  return (
    <section className={[styles.section, styles.sectionDark].join(' ')}>
      <div className="container">
        <div className={styles.sectionTitle}>
          <h2>课程体系</h2>
          <p>从基础到实战，五阶段循序渐进</p>
        </div>
        {phases.map((phase, index) => (
          <div key={index} className={styles.phaseCard}>
            <span className={styles.phaseNumber}>{phase.number}</span>
            <h3 className={styles.phaseTitle}>{phase.title}</h3>
            <div className={styles.phaseContent}>
              <ul>
                {phase.content.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              {phase.details && phase.details.map((detail, dIndex) => (
                <div key={dIndex} className={styles.highlightBox}>
                  <div className={styles.highlightBoxTitle}>{detail.title}</div>
                  <ul>
                    {detail.items.map((item, iIdx) => (
                      <li key={iIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const highlights = [
  {
    icon: '🚀',
    title: 'Prompt Engineering for BSP',
    description: '开发一套专门用于"翻译"硬件手册到驱动代码的嵌入式专用提示词库'
  },
  {
    icon: '📈',
    title: '从 0 到 1 的 Mainline 能力',
    description: '强调不仅仅是跑通 Demo，而是教学生如何利用 AI 将原厂过时的内核代码"现代化"'
  },
  {
    icon: '🔄',
    title: '工具链平滑切换',
    description: '教学如何通过 VSCode Copilot 实现 C 语言驱动到 Rust (Linux kernel Rust) 的实验性转换'
  }
];

function HighlightsSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionTitle}>
          <h2>差异化技术点</h2>
          <p>Technical Highlights</p>
        </div>
        <div className="row">
          {highlights.map((item, index) => (
            <div key={index} className="col col--4">
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>{item.icon}</div>
                <h3 className={styles.featureTitle}>{item.title}</h3>
                <p className={styles.featureDescription}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const coreAdvantages = [
  {
    icon: '⚡',
    title: '实战派',
    description: '拒绝理论堆砌，直接拿三款主流芯片开刀，涵盖 ARMv7 与 ARMv8 架构'
  },
  {
    icon: '🎯',
    title: '前瞻性',
    description: '锁定 Ubuntu 24.04 和 Linux 6.x 主线内核，确保学员掌握未来 3-5 年的技术栈'
  },
  {
    icon: '⏱️',
    title: '效率革命',
    description: '教授如何将传统的 1 周开发周期（读手册 → 调参数 → 试错）缩短为 1 天'
  }
];

function CoreAdvantages() {
  return (
    <section className={[styles.section, styles.sectionDark].join(' ')}>
      <div className="container">
        <div className={styles.sectionTitle}>
          <h2>课程核心竞争力</h2>
          <p>为什么选择我们的课程？</p>
        </div>
        <div className="row">
          {coreAdvantages.map((item, index) => (
            <div key={index} className="col col--4">
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>{item.icon}</div>
                <h3 className={styles.featureTitle}>{item.title}</h3>
                <p className={styles.featureDescription}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.tagContainer} style={{justifyContent: 'center', marginTop: '2rem'}}>
          <span className={styles.tag}>i.MX6ULL</span>
          <span className={styles.tag}>T113</span>
          <span className={styles.tag}>RK3568</span>
          <span className={styles.tag}>Ubuntu 24.04</span>
          <span className={styles.tag}>Linux 6.x</span>
          <span className={styles.tag}>Docker</span>
          <span className={styles.tag}>VSCode AI</span>
          <span className={styles.tag}>Device Tree</span>
          <span className={styles.tag}>Mainline Kernel</span>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="AI 驱动的嵌入式全栈工程师"
      description="从 i.MX6ULL 到 T113 至 RK3568 的全栈进化 - 深度融合 VSCode AI 助手，攻克 Ubuntu 24 环境下的驱动移植、内核主线化与工业应用开发">
      <HeroSection />
      <main>
        <RepoStructure />
        <PhaseSection />
        <HighlightsSection />
        <CoreAdvantages />
      </main>
    </Layout>
  );
}
