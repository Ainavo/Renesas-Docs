import{_ as r,r as s,o as a,c as t,a as o,b as e,d as n,e as c}from"./app-829098b3.js";const i={},p=o("h1",{id:"贡献指南",tabindex:"-1"},[o("a",{class:"header-anchor",href:"#贡献指南","aria-hidden":"true"},"#"),e(" 贡献指南")],-1),l=o("h2",{id:"概览",tabindex:"-1"},[o("a",{class:"header-anchor",href:"#概览","aria-hidden":"true"},"#"),e(" 概览")],-1),h={href:"https://pnpm.io/zh/workspaces",target:"_blank",rel:"noopener noreferrer"},u={href:"https://en.wikipedia.org/wiki/Monorepo",target:"_blank",rel:"noopener noreferrer"},b=c('<p>在 <code>packages</code> 目录下：</p><ul><li><code>bundler-vite</code>: 基于 Vite 的 Bundler 模块。使用 Vite 对 VuePress App 执行 <code>dev</code> 和 <code>build</code> 操作。</li><li><code>bundler-webpack</code>: 基于 Webpack 的 Bundler 模块。使用 Webpack 对 VuePress App 执行 <code>dev</code> 和 <code>build</code> 操作。</li><li><code>cli</code>: 命令行接口 (CLI) 模块。包含解析用户配置文件、调用 <code>@vuepress/core</code> 创建 VuePress App 、执行对应命令等功能。</li><li><code>client</code>: Client 模块。包含客户端页面入口，并提供了客户端开发时可以用到的类型和工具函数。</li><li><code>core</code>: Core 模块。提供 Node API 来创建 VuePress App ，包括页面逻辑、插件系统、数据准备等功能。</li><li><code>markdown</code>: Markdown 模块。使用 <code>markdown-it</code> 作为 Markdown 解析器，并集成了一些 VuePress 中用到的插件。</li><li><code>shared</code>: 既可以在 Node 端使用、也可以在客户端使用的工具函数模块。</li><li><code>utils</code>: 仅可以在 Node 端使用的工具函数模块。</li></ul><p>在 <code>ecosystem</code> 目录下：</p><ul><li><code>plugin-${name}</code>: 官方插件。</li><li><code>theme-default</code>: 默认主题。</li><li><code>vuepress</code>: 是 <code>vuepress-vite</code> 的封装。</li><li><code>vuepress-vite</code>: 是 <code>@vuepress/cli</code> + <code>@vuepress/bundler-vite</code> + <code>@vuepress/theme-default</code> 的封装。如果用户想使用 默认主题 + Vite ，仅安装这个 Package 就可以了。</li><li><code>vuepress-webpack</code>: 是 <code>@vuepress/cli</code> + <code>@vuepress/bundler-webpack</code> + <code>@vuepress/theme-default</code> 的封装。如果用户想使用 默认主题 + Webpack ，仅安装这个 Package 就可以了。</li></ul><h2 id="开发配置" tabindex="-1"><a class="header-anchor" href="#开发配置" aria-hidden="true">#</a> 开发配置</h2><p>开发要求：</p>',6),m={href:"http://nodejs.org",target:"_blank",rel:"noopener noreferrer"},_=o("strong",null,"version 18.16.0+",-1),v={href:"https://pnpm.io/zh/",target:"_blank",rel:"noopener noreferrer"},f=o("strong",null,"version 8+",-1),g=c(`<p>克隆代码仓库，并安装依赖：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">pnpm</span> <span class="token function">install</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>构建源代码：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">pnpm</span> build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>开始开发项目文档网站：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">pnpm</span> docs:dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>本项目开发使用的一些主要工具：</p>`,7),k={href:"https://www.typescriptlang.org/",target:"_blank",rel:"noopener noreferrer"},x={href:"https://vitest.dev/",target:"_blank",rel:"noopener noreferrer"},V={href:"https://eslint.org/",target:"_blank",rel:"noopener noreferrer"},w={href:"https://prettier.io/",target:"_blank",rel:"noopener noreferrer"},P=c('<h2 id="开发脚本" tabindex="-1"><a class="header-anchor" href="#开发脚本" aria-hidden="true">#</a> 开发脚本</h2><h3 id="pnpm-build" tabindex="-1"><a class="header-anchor" href="#pnpm-build" aria-hidden="true">#</a> <code>pnpm build</code></h3><p><code>build</code> 命令会使用 <code>tsc</code> 和 <code>tsup</code> 将 TypeScript 源文件编译为 JavaScript 文件。</p><p>此外，它还会将必要的资源文件从源文件目录复制到输出目录。这是因为一些资源文件不会被 <code>tsc</code> 或 <code>tsup</code> 处理，但它们仍需要被放置到输出目录，并保持它们的项目对路径不变。</p><p>你在克隆代码仓库后，可能需要先执行该命令来确保项目代码可以顺利运行，因为编译后的输出目录被 <code>.gitignore</code> 排除在仓库以外了。</p><h3 id="pnpm-clean" tabindex="-1"><a class="header-anchor" href="#pnpm-clean" aria-hidden="true">#</a> <code>pnpm clean</code></h3><p><code>clean</code> 命令会执行所有子 Package 中的 <code>clean</code> 命令，清除所有的输出文件目录和缓存文件。换言之，它将移除所有通过 <code>build</code> 和 <code>copy</code> 命令生成的文件。</p><p>当你想要从最初状态重新构建源代码时，你可以执行该命令。</p><h3 id="pnpm-docs" tabindex="-1"><a class="header-anchor" href="#pnpm-docs" aria-hidden="true">#</a> <code>pnpm docs:*</code></h3><h4 id="pnpm-docs-build-pnpm-docs-dev-pnpm-docs-clean" tabindex="-1"><a class="header-anchor" href="#pnpm-docs-build-pnpm-docs-dev-pnpm-docs-clean" aria-hidden="true">#</a> <code>pnpm docs:build</code>, <code>pnpm docs:dev</code>, <code>pnpm docs:clean</code></h4><p><code>docs:</code> 前缀表明，这些命令是针对文档 (documentation) 进行操作的，即 <code>docs</code> 目录。</p><p>VuePress 使用它自己来构建自己的文档网站。</p><p>你需要先执行 <code>pnpm build</code> 来构建 VuePress 源代码，然后再运行这些 <code>docs:</code> 开头的命令来开发或构建文档。</p><h4 id="pnpm-docs-serve" tabindex="-1"><a class="header-anchor" href="#pnpm-docs-serve" aria-hidden="true">#</a> <code>pnpm docs:serve</code></h4><p>在本地启动文档网站服务器。</p><p>你需要先运行 <code>pnpm docs:build</code> 来生成文档网站的输出文件，然后再通过该命令来启动文档网站。</p><h3 id="pnpm-lint" tabindex="-1"><a class="header-anchor" href="#pnpm-lint" aria-hidden="true">#</a> <code>pnpm lint</code></h3><p><code>lint</code> 命令使用 ESLint 来检查所有源文件。</p><h3 id="pnpm-test" tabindex="-1"><a class="header-anchor" href="#pnpm-test" aria-hidden="true">#</a> <code>pnpm test</code></h3><p><code>test</code> 命令使用 Vitest 来运行单元测试。</p><h2 id="文档" tabindex="-1"><a class="header-anchor" href="#文档" aria-hidden="true">#</a> 文档</h2><p>VuePress 的文档是由 VuePress 自己驱动的，是由该仓库中的源码构建而来。</p><p>所有的 Markdown 源文件都放置在 <code>docs</code> 目录下。我们维护了两种翻译：</p><ul><li>英语 (en-US) 在 <code>/</code> 路径下</li><li>中文 (zh-CN) 在 <code>/zh/</code> 路径下</li></ul><p>我们部署了两套站点：</p>',25),N={href:"https://www.netlify.com",target:"_blank",rel:"noopener noreferrer"},y={href:"https://v2.vuepress.vuejs.org",target:"_blank",rel:"noopener noreferrer"},S={href:"https://pages.github.com",target:"_blank",rel:"noopener noreferrer"},A={href:"https://vuepress.github.io",target:"_blank",rel:"noopener noreferrer"};function B(C,E){const d=s("ExternalLinkIcon");return a(),t("div",null,[p,l,o("p",null,[e("项目仓库借助于 "),o("a",h,[e("pnpm 工作空间"),n(d)]),e(" 来实现 "),o("a",u,[e("Monorepo"),n(d)]),e(" ，存放了多个互相关联的独立 Package 。")]),b,o("ul",null,[o("li",null,[o("a",m,[e("Node.js"),n(d)]),e(),_]),o("li",null,[o("a",v,[e("pnpm"),n(d)]),e(),f])]),g,o("ul",null,[o("li",null,[o("a",k,[e("TypeScript"),n(d)]),e(" 作为开发语言")]),o("li",null,[o("a",x,[e("Vitest"),n(d)]),e(" 用于单元测试")]),o("li",null,[o("a",V,[e("ESLint"),n(d)]),e(" + "),o("a",w,[e("Prettier"),n(d)]),e(" 用于代码检查和格式化")])]),P,o("ul",null,[o("li",null,[e("在 "),o("a",N,[e("Netlify"),n(d)]),e(" 部署的 Release 版本。该站点是从最新发布的版本中构建而来，因此用户不会看到未发布的改动。域名为 "),o("a",y,[e("https://v2.vuepress.vuejs.org"),n(d)]),e("。")]),o("li",null,[e("在 "),o("a",S,[e("GitHub Pages"),n(d)]),e(" 部署的 Developer 版本。该站点是从最新的提交中构建而来，因此开发者可以预览最新的改动。域名为 "),o("a",A,[e("https://vuepress.github.io"),n(d)]),e("。")])])])}const M=r(i,[["render",B],["__file","contributing.html.vue"]]);export{M as default};
