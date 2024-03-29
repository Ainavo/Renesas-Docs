import{_ as a,r as d,o as p,c as i,a as t,b as e,d as _,e as o}from"./app-829098b3.js";const r={},n=o('<h1 id="第3章-开发环境搭建与体验" tabindex="-1"><a class="header-anchor" href="#第3章-开发环境搭建与体验" aria-hidden="true">#</a> 第3章 开发环境搭建与体验</h1><p>本章目标：</p><ul><li>搭建 Renesas 的开发环境</li><li>使用 e2 studio 创建工程和编写代码</li><li>使用 RA Smart Configurator 创建 MDK 工程</li></ul><h2 id="_3-1-认识瑞萨处理器的开发环境" tabindex="-1"><a class="header-anchor" href="#_3-1-认识瑞萨处理器的开发环境" aria-hidden="true">#</a> 3.1 认识瑞萨处理器的开发环境</h2><p>瑞萨处理器的软件开发支持多种集成开发环境，比如瑞萨官方的 e2 studio，还有使用非常广泛的 Keil MDK。</p><p>本节对这些开发软件进行简单介绍，比较 e2 studio 和 MDK 这两个 IDE，提供选择建议。</p><h3 id="_3-1-1-瑞萨的开发软件" tabindex="-1"><a class="header-anchor" href="#_3-1-1-瑞萨的开发软件" aria-hidden="true">#</a> 3.1.1 瑞萨的开发软件</h3><ol><li>灵活配置软件包（FSP）</li></ol><p>灵活配置软件包（FSP)是一款综合性软件，旨在以较低的内存占用量提供快速高效的驱动程序和协议栈，专门针对 RA 产品家族 MCU 的架构进行优化，RA 产品家族 MCU 的开发也充分兼顾该软件的特性。在开发 FSP 的过程中，首要目标是为工程师提供简单高效的功能和驱动程序，以简化嵌入式系统中常见用例（如通信和安全）的实现。它们构成了一个开放的软件生态系统，可以灵活使用旧代码并与第三方工具结合使用。</p><p>FSP 集成了中间件协议栈、独立于 RTOS 的硬件抽象层(HAL)驱动程序（适用于生产），以及作为所有这些组件基础工具的板级支持包(BSP)，还有广泛使用的来自 Amazon Web Services 的 FreeRTOS&quot;M 实时操作系统(RTOS)。以此为嵌入式系统设计提供了一个经过优化且易于使用的高质量软件包，该软件包可扩展，并且可以通过操作简单而功能强大的应用程序编程接口（APl）调用来访问所有功能，从而轻松实现互换性，可满足嵌入式系统软件开发阶段的大多数需求。</p><p>FSP 的层次划分和功能如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image1.png" alt=""></p><p>它包括以下部分：</p><ul><li>板级支持包(BSP)，针对每个硬件评估板和RA产品家族的微控制器进行定制。它为所有支持的模块提供起始代码并作为这些模块的基础，以确保 FSP 模块顺利运行。使用自定义硬件的开发人员也可以充分利用BSP，因为开发人员可以借助e²studio中内置的User Pack Creator 针对其最终产品和电路板来定制 BSP。</li><li>独立于 RTOS 的硬件抽象层(HAL）驱动程序，以较少的内存占用量为所有片上外设和系统服务提供高效的驱动程序。它们可以从您的硬件中提取位设置和寄存器地址，因此无需对微控制器中底层硬件的文档进行大量的深入研究。</li><li>中间件栈和协议，可以独立使用或与RTOS结合使用，使用 Arm°提供的统一APl。它们简化了连接功能的实现，如 WiFi、Bluetooth@低功耗或到云服务的 MQTT 连接。还包括其他协议栈，例如支持USB传输、图形处理或电容式触摸的协议栈。</li><li>FreeRTOST 实时操作系统提供可进行多任务处理的实时内核（采用抢占式调度形式），面向对象的灵活RAM分配，以及用于任务通知、队列、信号量和缓冲区的不同实现方法。FreeRTOS+FAT 和 FreeRTOS+TCP库为需要网络连接的应用提供额外的功能。用户可自行选择是否使用 FreeRTOS：FSP也可以与裸机系统或任何其他RTOS一起使用。</li><li>FSP 中还包含其他第三方软件解决方案。例如，ArmCortex微控制器软件接口标准（CMSIS）硬件抽象层、Arm MbedTM Crypto 和TLS 加密库、Arm Littlefs故障安全文件系统、emWin 嵌入式图形库和 Segger的J-Link调试器软件，以及 TES DIAVE 2D 图形渲染库。</li></ul><p>在FSP开发过程中要实现的一个目标是，创建简单易用的软件以及条理清晰、整齐划一的API，并进行规范的文档记录。工程师针对每个模块都编制了详细的用户文档（包括示例代码），位于GitHub资源库中或通过e² studio的智能手册功能，可在需要的位置（即开发环境内部）显示信息。FSP使用Doxygen作为默认的文档工具，因此各模块源代码的Doxygen 注释中也提供了其他详细信息。</p><ol start="2"><li>集成开发环境e2 studio</li></ol><p>e2 studio 由瑞萨开发和维护，其依托于 Eclipse。Eclipse是一种时下流行且用途广泛的开源集成开发环境，可用于不同的编程语言和目标平台。Eclipse可以轻松进行定制和扩展，因此成为全球成千上万开发人员的首选IDE，并且成为了一个事实上的标准。</p><p>e2 studio充分利用Eclipse的所有优点，并加入了额外的视图和配置器透视图，以支持 RA 产品家族的所有功能。它包含创建、编译和调试任意大小和复杂程度的项目所需的所有工具，并指导开发人员完成软件设计的三个阶段：准备、构建和调试。而且，它会定期更新，从而能够使用最新的Eclipse SDK和CDT工具。</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image2.png" style="zoom:150%;"><p>e2 studio包含为 RA产品家族单片机创建、编译和调试项目所需的所有必要工具。它基于时下流行的Eclipse IDE，但瑞萨在其中加入了一些面向解决方案的组件和插件，使其功能更加强大。配置器尤为如此，它提供了生成新项目的简单方法，并能以图形访问方式轻松访问不同的硬件和软件功能，如引脚配置或添加软件堆，无需深入研究用户手册。这些配置器将自动创建所有必要的设置和初始化代码，其中还加入了错误检查功能，在设计时就能检测出有问题的组合，从而节省大量可能会浪费在编写和/或调试对应用程序并无意义的代码上的时间。</p><ol start="3"><li>RA Smart Configurator</li></ol><p>RA Smart Configurator，简称RASC，是瑞萨官方推出的一款配置瑞萨RA系列处理器的桌面应用工具。它集成了FSP，可以配置处理器的时钟、引脚、事件与中断和外设参数，并且将这些配置生成为代码，同时适配Keil MDK和IAR两种应用广泛的集成开发环境。</p><p>当开发者的硬件板卡设计在e2 studio中无法满足调试下载时，就可以选择使用RASC配合Keil MDK或者IAR进行调试下载。</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image3.png" style="zoom:200%;"><h3 id="_3-1-2-e2-studio和keil-mdk的区别和选择" tabindex="-1"><a class="header-anchor" href="#_3-1-2-e2-studio和keil-mdk的区别和选择" aria-hidden="true">#</a> 3.1.2 e2 studio和Keil MDK的区别和选择</h3><p>e2 studio是瑞萨电子的一款包含代码开发、构建和调试的开发工具，是基于开源Eclipse IDE和与之相关的C/C++开发工具。e2 studio 托管了瑞萨的FSP灵活配置软件包，这是一个用于支持瑞萨MCU开发的固件库。通过使用FSP库，我们可以轻松配置和管理瑞萨MCU，从而轻松实现复杂的应用程序。</p><p>Keil 也称为 KEIL MDK-ARM、KEIL MDK、Keil uVision5 等，是ARM官方的一款专为微控制器应用而设计的集成开发工具。Keil软件为基于Cortex-M、Cortex-R4、ARM7、ARM9 处理器设备提供了一个完整的开发环境，功能强大，能够满足大多数的嵌入式应用。我们在使用Keil软件开发瑞萨RA MCU时，为了方便配置芯片和生成FSP库代码，需要配合RA Smart Configurator(RASC)软件一起使用。</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image4.png" style="zoom:200%;"><p>本书使用的e2 studio版本是V2023-01，已经默认支持除瑞萨自身的调试器和J-Link。本书使用的开发板集成了DAP调试器，要在e2 studio上使用DAP需要按照后续章节进行配置。相比如Keil MDK，e2 studio提供了开发者助手，它会列出模块的所有函数，可以、拖拽这些函数就可以生成代码，它也更耗系统资源。</p><p>而Keil MDK已经支持DAP调试器。</p><p>请根据个人爱好进行选择。</p><h2 id="_3-2-e2-studio的安装" tabindex="-1"><a class="header-anchor" href="#_3-2-e2-studio的安装" aria-hidden="true">#</a> 3.2 e2 studio的安装</h2><p>本节的主要内容就是讲解e2 studio的安装及其工程的创建。</p><h3 id="_3-2-1-获取e2-studio安装软件" tabindex="-1"><a class="header-anchor" href="#_3-2-1-获取e2-studio安装软件" aria-hidden="true">#</a> 3.2.1 获取e2 studio安装软件</h3><p>打开https://github.com/renesas/fsp/releases，往下拉找到“Assets”，点击下载文件“setup_fsp_v4_3_0_e2s_v2023-01.exe”：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image5.png" alt=""></p><h3 id="_3-2-2-e2-studio安装步骤" tabindex="-1"><a class="header-anchor" href="#_3-2-2-e2-studio安装步骤" aria-hidden="true">#</a> 3.2.2 e2 studio安装步骤</h3><p>双击运行setup_fsp_v4_3_0_e2s_v2023-01.exe，首先会弹出一个软件内容读取进度条，随后会要求用户选择安装权限，一般选择“All Users”，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image6.png" alt=""></p><p>在随后出现的界面里，选择“Quick Install”：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image7.png" alt=""></p><p>随后安装软件会扫描当前电脑的环境是否支持安装，支持的话会全部显示绿色✓，然后点击“Next”开始下一步安装，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image8.png" alt=""></p><p>在随后出现的界面勾选“I accept the terms of the Software Agreements”，然后一路使用默认选择即可开始安装。</p><p>安装完成后，可以得到如下界面：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image9.png" alt=""></p><h2 id="_3-3-e2-studio使用指南" tabindex="-1"><a class="header-anchor" href="#_3-3-e2-studio使用指南" aria-hidden="true">#</a> 3.3 e2 studio使用指南</h2><h3 id="_3-3-1-创建e2-studio工程" tabindex="-1"><a class="header-anchor" href="#_3-3-1-创建e2-studio工程" aria-hidden="true">#</a> 3.3.1 创建e2 studio工程</h3><p>如果是首次打开e2 studio，会要求选择工作空间（本书使用e:\\e2_projects）和指定工具链（使用默认值），如图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image10.png" alt="image10"></p><p>接着就会显示一个欢迎界面，可以在此界面选择点击“Create a new C/C++ project”创建一个工程：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image11.png" alt=""></p><p>然后在弹出的界面的左侧选择“Renesas RA”,然后在右侧选择“Renesas RA C/C++ Project”后点击“下一步”开始创建工程，如图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image12.png" alt=""></p><p>在以后的使用中，建议从菜单栏的“文件”处创建工程（后续操作是一样的），如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image13.png" alt="image13"></p><p>接下来开始创建工程。</p><ol><li>设置工程名称</li></ol><p>首先弹出的是设置工程名称的界面：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image14.png" alt=""></p><p>开发者可以在这里设置工程的名称以及该工程保存的位置，注意不要有中文。默认情况下保存在缺省位置处。</p><p>当设置好工程名称和工程保存位置后点击“下一步”开始设置工程的细节。</p><ol start="2"><li>选择芯片及工具</li></ol><p>在此页面可以指定FSP版本、指定芯片型号（本书使用R7FA6M5BF2CBG），其他都使用默认值即可，如下图所示：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image15.png"><p>注意：本书配套的板子没有继承J-Link，本章节仅供参考。</p><ol start="3"><li>选择工程类别</li></ol><p>e2 studio的工程类别有Flat、TrustZone Secure和TrustZone Non-secure三种，在没有涉及程序保密等安全需求下，选择Flat简单类别的工程即可。</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image16.png" style="zoom:80%;"><ol start="4"><li>选择工程编译结果</li></ol><p>如下图选择，表示它是一个不含RTOS代码的可执行程序：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image17.png" alt=""></p><ol start="5"><li>工程模板设定</li></ol><p>如果开发者在板卡选择那里没有使用官方板卡的话，这里只有一种选择：最小系统初始化：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image18.png" alt=""></p><ol start="6"><li>使用FSP配置外设</li></ol><p>当工程创建完毕后会弹出一个提示框提示开发者是否打开透视图：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image19.png" style="zoom:150%;"><p>这个透视图就是FSP的配置界面：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image20.png" alt=""></p><p>这个工程已经可以编译了，如下图操作：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image21.png"><p>如何使用e2 studio配置硬件、生成代码，请参考后续章节。</p><h3 id="_3-3-2-e2-studio界面说明" tabindex="-1"><a class="header-anchor" href="#_3-3-2-e2-studio界面说明" aria-hidden="true">#</a> 3.3.2 e2 studio界面说明</h3><p>当创建好工程并且打开透视图之后，呈现在读者面前的是这样一个界面：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image22.png" alt=""></p><p>菜单栏和工具快捷栏读者可以自行点击查看支持的功能，本节讲一下e2 studio的视图切换及各视图的公用区别。</p><p>切换视图的快捷键在工具快捷栏的最右侧，如下图所示：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image23.png" style="zoom:150%;"><p>“C”是切换到代码编写视图，在此视图下，随意打开一个源文件或头文件，最左侧的框图将由初始页面的FSP可视化页面变为源文件或头文件的大纲页面，显示出文件内包含的头文件、宏定义、函数声明等，例如在此视图下打开hal_entry.c，其表现如图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image24.png" alt=""></p><p>通过大纲提示，开发者可以很快的浏览了解该文件的主要内容。</p><h3 id="_3-3-3-fsp配置" tabindex="-1"><a class="header-anchor" href="#_3-3-3-fsp配置" aria-hidden="true">#</a> 3.3.3 FSP配置</h3><p>“FSP Configuration”是切换到FSP的配置页面，打开FSP配置界面，初始界面如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image25.png" alt=""></p><p>左侧框图是开发者配置处理器及其外设的主要操作窗口，它有支持的配置项如下：</p><ul><li>Summary：关于当前处理器或办卡的信息总结，包括处理器型号、工具栏及其版本、FSP版本、组件版本等等；</li><li>BSP：板级支持包（BSP）配置页，用以选择FSP版本、板卡型号、和处理器型号等；</li><li>Clocks：时钟配置页，用以配置时钟源、PLL分倍频系数，来配置系统时钟和各总线时钟；</li><li>Pins：引脚配置页，用以配置某个引脚的功能或者配置某个硬件外设的具体功能的引脚选择；</li><li>Interrupts：中断配置页，用户可以在这里查看到已经配置的所有事件/中断及其在程序中的中断服务函数命；用户也可以在此处添加自己的事件/中断，并为其中断服务函数自定义名称；</li><li>Event Links：事件链接配置页，这是一个生产者-消费者模型，目的是让事件产生者去触发一个事件消费者的中断，配置此项还需要在之后的Stacks出添加ELC配置项；</li><li>Stacks：堆栈配置页，用以配置具体硬件外设的参数，例如IO的ELC触发源、UART的波特率等等；初始情况只有IO的堆栈配置，当需要配置其它外设参数时点击该页左上方的“New Stack”来添加外设配置；</li><li>Components：组件配置页，在此处添加瑞萨官方FSP、官方HAL库、第三方中间件和第三方RTOS等；</li></ul><p>右侧框图是FSP的可视化配置图，可以在这个芯片图中右键选中某个引脚来配置其功能（跟在Pins页面配置引脚是一样的效果），以P402引脚为例，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image26.png" alt=""></p><h3 id="_3-3-4-e2-studio工程结构说明" tabindex="-1"><a class="header-anchor" href="#_3-3-4-e2-studio工程结构说明" aria-hidden="true">#</a> 3.3.4 e2 studio工程结构说明</h3><p>当创建好一个e2 studio工程后，其初始的工程结构如下图所示：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image27.png" style="zoom:150%;"><p>依次来看下这个结构中各文件夹和文件的主要内容和作用：</p><ul><li>Includes：此处显示了工程使用到的所有头文件所在的路径；</li><li>ra：此文件夹中包含的是ARM内核支持的CMSIS接口的头文件以及瑞萨的FSP源文件和头文件；</li><li>ra_gen：此文件夹包含的是经FSP配置后生成工程内容后的代码源文件；</li><li>src：初始情况下此文件夹下只有一个hal_entry.c源文件，其中实现了入口函数hal_entry()和系统初始化会调用的一个函数R_BSP_WarmStart();</li><li>Debug：此文件夹下包含的是内存寄存器地址链接文件，不可更改，如图所示：</li></ul><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image28.png" style="zoom:150%;"><ul><li>ra_cfg：此文件夹下包含的是fsp配置后的头文件，其中是对fsp配置参数的宏定义或声明；</li><li>script：此文件夹下是整个工程编译所需要的链接文件；</li><li>configuration.xml：FSP配置页面的xml文件，如果开发过程中将FSP配置页面关闭了可以双击此文件重新打开；</li><li>xxx Debug_Flat.lunch：工程调试运行信息；</li><li>Developer Assistance：开发者助手，此处会将在FSP的Stacks中配置的外设所支持的所有HAL库函数显示出来，并且可以让开发者将库函数直接拖拽到代码文件中进行编辑，如下图所示：</li></ul><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image29.png" alt=""></p><p>将“Call_R_IOPORT_Open”往hal_entry()的代码编辑处拖拽过去后，其调用方式直接就生成到了代码中，开发者只需要重新编辑该函数的参数和返回值即可，非常的方便快捷。</p><h3 id="_3-3-5-e2-studio开发者助手" tabindex="-1"><a class="header-anchor" href="#_3-3-5-e2-studio开发者助手" aria-hidden="true">#</a> 3.3.5 e2 studio开发者助手</h3><p>在上一小节已经简单演示了开发者助手在开发过程中的妙用，它不仅能让开发者快速的了解某个外设所支持的库函数有哪些，还能直接拖拽到函数中进行使用，极大的方便了开发。</p><p>要在开发者助手中了解某个外设的库函数和拖拽使用，必须要先在FSP的配置界面中的Stacks中添加该外设才行，默认情况下只有IOPORT，本书以SCI中的UART为例来简单讲解下Stacks和开发者助手的配合使用。</p><ol><li>Stacks中添加外设</li></ol><p>去FSP的Stacks中点击“New Stack”，然后选择其中的“Connectivity”，再选择其中的“UART”，如图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image30.png" alt=""></p><p>选择之后在Stacks页面的“HAL/Common Stacks”中将会新增一个UART的堆栈配置：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image31.png" alt=""></p><p>选中新增的UART的堆栈配置，在“属性”页可以配置这个UART的具体参数，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image32.png" alt=""></p><p>如果e2 studio的整个页面没有“属性”页，可以在e2 studio的菜单栏点开“窗口”，选择其中的“显示视图”，然后点击其中的“属性”，即可打开属性页，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image33.png" alt=""></p><ol start="2"><li>开发者助手中使用外设库函数</li></ol><p>在Stacks中配置好外设的参数后，点击“Generate Project Content”,随后在展开工程中的开发者助手“Developer Assistance”，继续展开其中的“HAL/Common”，就能看到其中增加了配置的那个外设的库函数，如图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image34.png" alt=""></p><p>开发者只需要将库函数拖拽到代码中再重新编辑参数和返回值即可完成库函数的调用。</p><h3 id="_3-3-6-e2-studio中配置dap调试" tabindex="-1"><a class="header-anchor" href="#_3-3-6-e2-studio中配置dap调试" aria-hidden="true">#</a> 3.3.6 e2 studio中配置DAP调试</h3><p>e2 studiostudio本身尚未支持DAP调试工具，需要开发者自行安装。本节介绍如何安装Pyocd软件以支持板载的DAP调试器。</p><ol><li>在Windows安装python</li></ol><p>Pyocd的运行需要python环境。如果读者的Windows不支持python，即使用Windows的CMD执行python后没有显示版本和python运行符的话，需要先去安装最新版本的python（请自行安装）。</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image35.png" alt=""></p><ol start="2"><li>在Windows安装pyocd</li></ol>',130),m={href:"https://pyocd.io",target:"_blank",rel:"noopener noreferrer"},h=o('<p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image36.png" alt=""> 在支持python（3.7版本以上）的Windows中，按下Win+R，输入CMD打开命令行：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image37.png" style="zoom:150%;"><p>然后输入指令：python3 -m pip install -U pyocd等待安装完成即可，有些环境下可能python3无法生效，则换成python -m pip install -U pyocd执行即可：如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image38.png" alt=""></p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image39.png" alt=""></p><p>安装完成之后，在命令行执行pyocd -V查看版本来验证pyocd是否安装成功，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image40.png" alt=""></p><p>在后续e2 studio中配置pyocd环境的时候，还需要知道pyocd-gdbserver所在路径，同样的可以在命令行执行where.exe pyocd-gdbserver获取路径，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image41.png" alt=""></p><p>图中划线部分就是后续需要的路径。</p><ol start="3"><li>使用Pyocd查看处理器型号</li></ol><p>先查看pyocd的target命令用法，特别是其中的子命令“pack”的用法：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image42.png"><p>我们需要先获取瑞萨处理器的PACK包，打开https://github.com/renesas/fsp/releases，往下拉找到“Assets”，点击下载这MDK_Device_PACKS_vxxx.zip，如下图所示：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image43.png" style="zoom:150%;"><p>将此压缩包解压出来，比如放到桌面，打开解压出来的文件夹，按住shift然后点击鼠标右键：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image44.png" alt=""></p><p>随后在打开的powershell命令行中执行下面这条指令查看这个pack文件支持的瑞萨处理器型号：</p><p>pyocd list --target --pack Renesas.RA_DFP.4.3.0.pack</p><p>如下图所示：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image45.png" style="zoom:80%;"><p>在这里可以看到瑞萨处理器的这个pack文件支持的所有的处理器型号，在后续配置pyocd调试的时候需要填写型号，内容就是从这里得来，以本书使用的R7FA6M5BF2CBG为例，需要的型号名称就是“r7fa6m5bf”或者“R7FA6MFBF”。</p><p>解压出来的Renesas.RA_DFP.4.3.0.pack，要记住它的目录，后面配置调试信息时要使用。</p><ol start="4"><li>e2 studio安装GDB Toolchain</li></ol><p>搭建好pyocd环境之后，就需要在e2 studio中进行配置了。在e2 studio配置pyocd的前提是安装好GNU ARM C/C++ Cross Development Tools。</p><p>打开e2 studio，点击“帮助”，选择“安装新软件……”，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image46.png" alt=""></p><p>在弹出的窗口中，于“Work with”后面的文本框中填入以下链接后按下回车键，获取安装信息：</p><p>http://sourceforge.net/projects/gnuarmeclipse/files/Eclipse/updates/</p><p>这会得到GNU ARM交叉编译工具链的安装信息，如下图所示：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image47.png" style="zoom:80%;"><p>如果只需要pyocd的话就只选择安装GNU ARM C/C++ Pyocd Debugging即可，如果实在不清楚，可以全选安装。选择好之后点击右下角的“下一步”开始安装：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image48.png" style="zoom:80%;"><p>随后等待安装完成即可：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image49.png" style="zoom:150%;"><p>安装过程中会弹出“Trust”窗口，勾选其中的选项然后点击“Trust Selected”继续安装，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image50.png" alt=""></p><p>安装完成之后会要求重启e2 studio软件，点击重启：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image51.png" style="zoom:150%;"><ol start="5"><li>e2 studio配置pyocd</li></ol><p>e2 studio安装了GNU ARM Pyocd软件成功且重启软件之后，点击菜单栏的“窗口”，选择其中的“首选项”：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image52.png" style="zoom:150%;"><p>在弹出的窗口中展开“运行/调试”，找到里面的“PyOCD”，在“Executable”中填入“pyocd-gdbserver.exe”，在“Folder”中填入pyocd-gdbserver.exe所在路径，也就是前文讲到的那个路径，配置如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image53.png" alt=""></p><p>至此pyocd在e2 studio中的环境配置就设置好了，下面开始设置调试。</p><ol start="6"><li>e2 studio设置基于pyocd的调试器</li></ol><p>首先打开一个e2 studio的工程，然后点击e2 studio中菜单栏的“运行”，选择其中的“调试配置”，如下图所示：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image54.png" alt="img"><p>在弹出的窗口中选择“GDB PyOCD Debugging”后鼠标右键，选择“新建配置”，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image55.png" alt=""></p><p>稍微等待一会儿，右侧会更新为GDB Pyocd的调试配置界面，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image56.png" alt=""></p><p>在主要这一栏，如果是选择了具体的工程后新建的配置，则会自动搜索指定该项目及其编译的elf文件，如果没有选择具体的工程，那么这一项会为空。</p><p>需要重点关注的是Debugger这一栏，其默认参数基本不需要修改，需要用户选择填写的是调试器、调试目标处理器型号以及参数指令，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image57.png" alt=""></p><ul><li>Board：DAP调试器；</li><li>Override target:调试处理器型号，需要勾选后再填写；</li><li>Other options：PyOCD的—pack指令指定处理器所在pack包；</li></ul><p>配置好之后直接点击“运行”即可使用DAP调试代码了。</p><ul><li>指定Renesas.RA_DFP.4.3.0.pack</li></ul><h2 id="_3-4-rasc和keil-mdk的安装" tabindex="-1"><a class="header-anchor" href="#_3-4-rasc和keil-mdk的安装" aria-hidden="true">#</a> 3.4 RASC和Keil MDK的安装</h2><h3 id="_3-4-1-获取rasc和mdk的安装软件" tabindex="-1"><a class="header-anchor" href="#_3-4-1-获取rasc和mdk的安装软件" aria-hidden="true">#</a> 3.4.1 获取RASC和MDK的安装软件</h3><p>需要下载3个软件：</p><ol><li>MDK_Device_Packs_v4.3.0.zip：它是MDK使用的瑞萨MCU支持包</li><li>setup_fsp_v4_3_0_rasc_v2023-01.exe：它是RASC的安装软件</li><li>Keil MDK：它是一个集成开发工具</li></ol><p>下载之后，先安装Keil MDK，再安装MDK_Device_Packs_v4.3.0.zip。setup_fsp_v4_3_0_rasc_v2023-01.exe的安装顺序不重要。</p><ol><li>RA Smart Configurator</li></ol><p>打开https://github.com/renesas/fsp/releases，往下拉找到“Assets”，点击下载这两个文件：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image58.png" alt=""></p><ol start="7"><li>Keil MDK</li></ol><p>在官网www.keil.com首页点击“Downloads”进入下载链接，随后选择“MDK-Arm”，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image59.png" alt=""></p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image60.png" alt=""></p><p>然后填写基本信息提交后，进入exe下载页，点击“MDKxxx.EXE”开始下载，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image61.png" alt=""></p><h3 id="_3-4-2-keil-mdk的安装步骤" tabindex="-1"><a class="header-anchor" href="#_3-4-2-keil-mdk的安装步骤" aria-hidden="true">#</a> 3.4.2 Keil MDK的安装步骤</h3><p>先安装MDKxxx.EXE，然后再安装PACKS。</p><ol><li>安装Keil MDK</li></ol><p>MDK的安装比较简单，安装步骤主要是下图所示的6步：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image62.png" style="zoom:80%;"><ol><li>安装首页，点击“Next”开始下一步安装；</li><li>协议知情书，勾选“I agree……”后点击“Next”开始下一步安装；</li><li>Keil MDK核心文件和Keil MDK 的设备Packs包安装路径，可以自定义，注意不要带有中文；设置好之后点击“Next”开始下一步安装；</li><li>基本信息收集，随意填写即可，填写好之后点击“Next”开始安装；</li><li>安装进度，等待安装完成即可；安装过程中如果弹出需要安装xxx软件，点击安装即可；</li><li>安装完成，点击“Finish”结束安装；</li></ol><p>Keil MDK主体安装完成之后会弹出一个“Pack Installer”，它会刷新和安装最新的ARM编译器、CMSIS固件等。</p><ol start="2"><li>安装RA Packs</li></ol><p>解压MDK_Device_Packs_v4.3.0.zip后，双击安装即可。安装步骤如图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image63.png" alt=""></p><p>只需要点击“Next”后等待安装完成即可，安装完成后点击“Finish”结束pack的安装。</p><h3 id="_3-4-3-rasc的安装步骤" tabindex="-1"><a class="header-anchor" href="#_3-4-3-rasc的安装步骤" aria-hidden="true">#</a> 3.4.3 RASC的安装步骤</h3><p>双击setup_fsp_v4_3_0_rasc_v2023-01.exe即可安装，一开始会弹出一个进度条然后选择用户安装权限：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image64.png" alt=""></p><p>选择“All Users”，然后开始安装流程。</p><ol><li>首先依然是环境扫描和协议告知，依次点击“Next”、勾选“I accept……”后点击“Next”：</li></ol><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image65.png" alt=""></p><ol start="2"><li>随后设置在开始菜单中的安装组，默认就好，然后点击“Install”开始安装，等待进度条执行完后就安装完成了：</li></ol><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image66.png" alt=""></p><ol start="3"><li>安装完成，点击“OK”结束安装：</li></ol><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image67.png" alt=""></p><h3 id="_3-4-4-将rasc集成到keil-mdk" tabindex="-1"><a class="header-anchor" href="#_3-4-4-将rasc集成到keil-mdk" aria-hidden="true">#</a> 3.4.4 将RASC集成到Keil MDK</h3><p>将RASC集成到Keil MDK后，可以在MDK中直接启动RASC进行配置。安装好RASC后，可以开始菜单看到如下指引，本节内容来自这个指引：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image68.png" style="zoom:150%;"><p>首先运行Keil MDK，在菜单栏点击‘Tools’，然后选择“Customize Tools Menu…”，如下图所示：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image69.png" style="zoom:150%;"><p>然后在弹出的窗口中点击“New”图标新建一个菜单项，参考下表进行填写：</p><table><thead><tr><th>目录</th><th>内容</th></tr></thead><tbody><tr><td>Menu Content</td><td>RA Smart Configurator</td></tr><tr><td>Command</td><td>C:\\path\\to\\rasc.exe （rasc.exe的完整路径）</td></tr><tr><td>Initial Folder</td><td>$P</td></tr><tr><td>Arguments</td><td>--device $D --compiler ARMv6 configuration.xml</td></tr><tr><td>Run Independent</td><td>☑</td></tr></tbody></table><p>最终结果如下图所示：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image70.png"><p>使用同样的办法继续添加其他两个菜单项：Smart Bundle Viewer、Device Partition Manager，参考下面2个表格。</p><p>l Smart Bundle Viewer的配置项：</p><table><thead><tr><th>区域</th><th>内容</th></tr></thead><tbody><tr><td>Menu Content</td><td>Smart Bundle Viewer</td></tr><tr><td>Command</td><td>C:\\path\\to\\rasc.exe （rasc.exe的完整路径）</td></tr><tr><td>Initial Folder</td><td>$P</td></tr><tr><td>Arguments</td><td>-nosplash --viewsmartbundle &quot;$L@L.sbd&quot;</td></tr><tr><td>Run Independent</td><td>☑</td></tr></tbody></table><p>l Device Partition Manager的配置项：</p><table><thead><tr><th>区域</th><th>内容</th></tr></thead><tbody><tr><td>Menu Content</td><td>Device Partition Manager</td></tr><tr><td>Command</td><td>C:\\path\\to\\rasc.exe （rasc.exe的完整路径）</td></tr><tr><td>Initial Folder</td><td>$P</td></tr><tr><td>Arguments</td><td>-application com.renesas.cdt.ddsc.dpm.ui.dpmapplication configuration.xml&quot;$L%L&quot;</td></tr><tr><td>Run Independent</td><td>☑</td></tr></tbody></table><p>配置完成后，可以在Tools菜单看到如下三个菜单项：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image71.png" style="zoom:150%;"><p>以后使用Keil打开工程后，点击“Tools &gt; RA Smart Configurator”即可打开RASC。</p><h2 id="_3-5-rasc和keil-mdk使用指南" tabindex="-1"><a class="header-anchor" href="#_3-5-rasc和keil-mdk使用指南" aria-hidden="true">#</a> 3.5 RASC和Keil MDK使用指南</h2><h3 id="_3-5-1-使用rasc创建mdk工程" tabindex="-1"><a class="header-anchor" href="#_3-5-1-使用rasc创建mdk工程" aria-hidden="true">#</a> 3.5.1 使用RASC创建MDK工程</h3><p>先启动RASC，如下图所示：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image72.png" style="zoom:150%;"><p>RASC启动后，它弹出如下对话框，开始新建工程。以“0301_mdk_demo”工程为例，如下图输入各项参数：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image73.png" alt=""></p><p>点击Next按钮，进一步配置：选择单板、芯片、IDE等。本例程使用的芯片是R7FA6M5BF2CBG、IDE是“Keil MDK Version 5”，如下图所示：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image74.png" style="zoom:150%;"><p>继续点击Next按钮，在后续的3个页面中如下图设置：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image75.png" style="zoom:80%;"><p>创建完成后得到如下的界面,点击“Summary”项中“Location”处最右端的跳转图标可以打开工程所在文件夹：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image76.png" alt=""></p><p>双击“0302_mdk_demo.uvprojx”文件即可打开此Keil工程，它并没有做实际的事情，后续可以参考《第5章 GPIO输入输出》添加LED的控制代码。但是，现在这个工程已经可以编译、下载、运行了。在Keil菜单中点击一下按钮即可编译程序：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image77.png" style="zoom:150%;"><h3 id="_3-5-2-配置mdk工程" tabindex="-1"><a class="header-anchor" href="#_3-5-2-配置mdk工程" aria-hidden="true">#</a> 3.5.2 配置MDK工程</h3><p>使用RASC创建的MDK工程可以编译通过，但是无法直接烧写，需要进一步配置。先使用USB线把板子的“UART&amp;DAP”口连接到电脑，然后打开MDK工程。</p><p>使用RASC创建的MDK工程，它的默认配置里没有为芯片添加配置（比如Flash的烧写算法）。我们可以先选择任意其他芯片，再选择回我们所使用的芯片，MDK就会为这个芯片添加配置。</p><p>方法为：先点击“魔术棒”，再点击“Device”，本教程使用的是下图编号④的R7FA6M5BF，故意先点击编号③的其他芯片，再点击编号④的芯片，就可以让MDK为R7FA6M5BF添加芯片配置信息了。如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image78.png" alt=""></p><p>这时，点击“Debug”页面，选择DAP调试器，然后点击“Setting”，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image79.png" alt=""></p><p>在设置界面，确认“SWJ”被勾选、Port被选为“SW”（下图编号⑧），并且识别出了芯片（下图编号⑨），如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image80.png" alt=""><br> 继续点击上图的“Flash Download”，勾选“Reset and Run”；并确保“Programming Algorithm”里不是空白的，否则就要回到刚开始的步骤故意切换为其他芯片再切换回R7FA6M5BF。如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image81.png" alt=""></p><h3 id="_3-5-3-编译和调试下载程序" tabindex="-1"><a class="header-anchor" href="#_3-5-3-编译和调试下载程序" aria-hidden="true">#</a> 3.5.3 编译和调试下载程序</h3><p>Keil MDK的编译可以使用快捷键“F7”来进行，也可以使用快捷栏图标进行编译和全部重新编译，如下图所示：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image82.png" style="zoom:150%;"><p>烧写代码可以点击上图中的“LOAD”双向下箭头图标进行程序烧写，也可以使用快捷键“F8”来烧写。</p><p>Keil MDK的调试按钮在快捷栏图标的左侧，如下图所示：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image83.png" style="zoom:150%;"><p>点击调试按钮即可进入调试界面，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image84.png" alt=""></p><p>上图各个区域讲解如下：</p><p>a) 寄存器区：当前内核寄存器值； b) 汇编区：显示当前MDK指针所在位置和代码的汇编内容； c) 代码区：此窗口左侧深灰色表示可以在该处打断点，右侧只是实际代码；</p><p>MDK支持的调试手段如下图所示：</p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/object_oriented_module_programming_method_in_ARM_embedded_system/chapter-3/image85.png" style="zoom:200%;"><ul><li>Reset：复位，让程序重新运行；</li><li>Run：全速运行，如果有断点则运行到断点处才停止；</li><li>Stop：停止运行程序，停止后可以观察寄存器、内存等信息；</li><li>Step：单步运行，此单步是以一句指令为最小单位，遇到函数调用会跳转进入函数内；</li><li>Step Over：单步跳过运行，此单步遇到函数调用不会进入被函数内，而是全速执行完函数后停止；如果函数内有断点，运行到断点时会停止；</li><li>Step Out：单步跳出运行，会将当前函数剩下的指令全速执行完，跳出函数后停止；</li><li>Run to Cursor Line：直行到指定行，先用鼠标点击源码某行，再点击此按钮就会运行到这行。</li></ul>',147);function c(l,g){const s=d("ExternalLinkIcon");return p(),i("div",null,[n,t("p",null,[e("Pyocd的官网网址："),t("a",m,[e("https://pyocd.io"),_(s)]),e("。 读者可以在官网中获取pyocd的安装方法和支持的指令，如下图所示：")]),h])}const A=a(r,[["render",c],["__file","chapter3.html.vue"]]);export{A as default};
