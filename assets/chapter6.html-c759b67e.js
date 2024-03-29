import{_ as t,o as n,c as a,e}from"./app-829098b3.js";const s={},r=e(`<h1 id="第6章-freertos源码概述" tabindex="-1"><a class="header-anchor" href="#第6章-freertos源码概述" aria-hidden="true">#</a> 第6章 FreeRTOS源码概述</h1><h2 id="_6-1-freertos目录结构" tabindex="-1"><a class="header-anchor" href="#_6-1-freertos目录结构" aria-hidden="true">#</a> 6.1 FreeRTOS目录结构</h2><p>以源码“0501_freertos”为例，它的FreeRTOS的目录如下:</p><img src="https://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/FreeRTOS/chapter-6/image1.png" style="zoom:67%;"><p>主要涉及3个目录：</p><ul><li>ra\\aws\\FreeRTOS\\FreeRTOS\\Source：存放的是FreeRTOS的核心文件</li><li>ra_gen：从main.c可以看到创建任务的函数调用过程</li><li>src：使用RASC创建任务时，在src目录下生成任务的入口函数</li></ul><h2 id="_6-2-核心文件" tabindex="-1"><a class="header-anchor" href="#_6-2-核心文件" aria-hidden="true">#</a> 6.2 核心文件</h2><p>FreeRTOS的最核心文件只有2个：</p><ul><li>FreeRTOS/Source/tasks.c</li><li>FreeRTOS/Source/list.c</li></ul><p>其他文件的作用也一起列表如下：</p><table><thead><tr><th><strong>FreeRTOS/Source/下的文件</strong></th><th><strong>作用</strong></th></tr></thead><tbody><tr><td>tasks.c</td><td>必需，任务操作</td></tr><tr><td>list.c</td><td>必须，列表</td></tr><tr><td>queue.c</td><td>基本必需，提供队列操作、信号量(semaphore)操作</td></tr><tr><td>timer.c</td><td>可选，software timer</td></tr><tr><td>event_groups.c</td><td>可选，提供event group功能</td></tr></tbody></table><h2 id="_6-3-移植时涉及的文件" tabindex="-1"><a class="header-anchor" href="#_6-3-移植时涉及的文件" aria-hidden="true">#</a> 6.3 移植时涉及的文件</h2><p>移植FreeRTOS时涉及的文件放在“ra\\fsp\\src\\rm_freertos_port”目录下，里面有2个文件：</p><ul><li>port.c</li><li>portmacro.h</li></ul><p>FreeRTOS已经支持绝大多数的芯片，本课程不涉及FreeRTOS的移植。</p><h2 id="_6-4-头文件相关" tabindex="-1"><a class="header-anchor" href="#_6-4-头文件相关" aria-hidden="true">#</a> 6.4 头文件相关</h2><h3 id="_6-4-1-头文件目录" tabindex="-1"><a class="header-anchor" href="#_6-4-1-头文件目录" aria-hidden="true">#</a> 6.4.1 头文件目录</h3><p>FreeRTOS需要3个头文件目录：</p><ul><li>FreeRTOS本身的头文件：ra\\aws\\FreeRTOS\\FreeRTOS\\Source\\include</li><li>移植时用到的头文件：ra\\fsp\\src\\rm_freertos_port\\portmacro.h</li><li>含有配置文件FreeRTOSConfig.h的目录：ra_cfg\\aws</li></ul><h3 id="_6-4-2-头文件" tabindex="-1"><a class="header-anchor" href="#_6-4-2-头文件" aria-hidden="true">#</a> 6.4.2 头文件</h3><p>列表如下：</p><table><thead><tr><th><strong>头文件</strong></th><th><strong>作用</strong></th></tr></thead><tbody><tr><td>FreeRTOSConfig.h</td><td>FreeRTOS的配置文件，比如选择调度算法：configUSE_PREEMPTION 每个工程都必定含有FreeRTOSConfig.h</td></tr><tr><td>FreeRTOS.h</td><td>使用FreeRTOS API函数时，必须包含此文件。 在FreeRTOS.h之后，再去包含其他头文件，比如： task.h、queue.h、semphr.h、event_group.h</td></tr></tbody></table><h2 id="_6-5-内存管理" tabindex="-1"><a class="header-anchor" href="#_6-5-内存管理" aria-hidden="true">#</a> 6.5 内存管理</h2><p>文件在“ra\\aws\\FreeRTOS\\FreeRTOS\\Source\\portable\\MemMang”下，“portable”意味着你可以提供自己的函数。</p><p>FreeRTOS提供了5个文件，对应内存管理的5种方法，在《第7章 内存管理》里详细介绍。</p><h2 id="_6-6-工程入口" tabindex="-1"><a class="header-anchor" href="#_6-6-工程入口" aria-hidden="true">#</a> 6.6 工程入口</h2><p>从ra_gen\\main.c的main函数，可以看到任务的创建、启动，源码如下：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code> <span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>
 <span class="token punctuation">{</span>
     g_fsp_common_thread_count <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
     g_fsp_common_initialized <span class="token operator">=</span> false<span class="token punctuation">;</span>

     <span class="token comment">/* Create semaphore to make sure common init is done before threads start running. */</span>
     g_fsp_common_initialized_semaphore <span class="token operator">=</span>
     <span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">if</span> <span class="token expression">configSUPPORT_STATIC_ALLOCATION</span></span>
     <span class="token function">xSemaphoreCreateCountingStatic</span><span class="token punctuation">(</span>
     <span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">else</span></span>
     <span class="token function">xSemaphoreCreateCounting</span><span class="token punctuation">(</span>
     <span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span></span>
         <span class="token number">256</span><span class="token punctuation">,</span>
         <span class="token number">1</span>
         <span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">if</span> <span class="token expression">configSUPPORT_STATIC_ALLOCATION</span></span>
         <span class="token punctuation">,</span> <span class="token operator">&amp;</span>g_fsp_common_initialized_semaphore_memory
         <span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span></span>
     <span class="token punctuation">)</span><span class="token punctuation">;</span>

     <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token constant">NULL</span> <span class="token operator">==</span> g_fsp_common_initialized_semaphore<span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token function">rtos_startup_err_callback</span><span class="token punctuation">(</span>g_fsp_common_initialized_semaphore<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token punctuation">}</span>

     <span class="token comment">/* Init RTOS tasks. */</span>
     <span class="token function">led_thread_create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token function">log_thread_create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

     <span class="token comment">/* Start the scheduler. */</span>
     <span class="token function">vTaskStartScheduler</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第25、26行分别创建led任务、log任务，第29行启动调度器。</p><h2 id="_6-7-数据类型和编程规范" tabindex="-1"><a class="header-anchor" href="#_6-7-数据类型和编程规范" aria-hidden="true">#</a> 6.7 数据类型和编程规范</h2><h3 id="_6-7-1-数据类型" tabindex="-1"><a class="header-anchor" href="#_6-7-1-数据类型" aria-hidden="true">#</a> 6.7.1 数据类型</h3><p>每个移植的版本都含有自己的 <strong>portmacro.h</strong> 头文件，里面定义了2个数据类型：</p><ul><li>TickType_t： <ul><li>FreeRTOS配置了一个周期性的时钟中断：Tick Interrupt</li><li>每发生一次中断，中断次数累加，这被称为tick count</li><li>tick count这个变量的类型就是TickType_t</li><li>TickType_t可以是16位的，也可以是32位的</li><li>FreeRTOSConfig.h中定义configUSE_16_BIT_TICKS时，TickType_t就是uint16_t</li><li>否则TickType_t就是uint32_t</li></ul></li></ul><p>对于32位架构，建议把TickType_t配置为uint32_t</p><ul><li>BaseType_t： <ul><li>这是该架构最高效的数据类型</li><li>32位架构中，它就是uint32_t</li><li>16位架构中，它就是uint16_t</li><li>8位架构中，它就是uint8_t</li><li>BaseType_t通常用作简单的返回值的类型，还有逻辑值，比如 <strong>pdTRUE/pdFALSE</strong></li></ul></li></ul><h3 id="_61-7-2-变量名" tabindex="-1"><a class="header-anchor" href="#_61-7-2-变量名" aria-hidden="true">#</a> 61.7.2 变量名</h3><p>变量名有前缀：</p><table><thead><tr><th><strong>变量名前缀</strong></th><th><strong>含义</strong></th></tr></thead><tbody><tr><td>c</td><td>char</td></tr><tr><td>s</td><td>int16_t，short</td></tr><tr><td>l</td><td>int32_t，long</td></tr><tr><td>x</td><td>BaseType_t， 其他非标准的类型：结构体、task handle、queue handle等</td></tr><tr><td>u</td><td>unsigned</td></tr><tr><td>p</td><td>指针</td></tr><tr><td>uc</td><td>uint8_t，unsigned char</td></tr><tr><td>pc</td><td>char指针</td></tr></tbody></table><h3 id="_6-7-3-函数名" tabindex="-1"><a class="header-anchor" href="#_6-7-3-函数名" aria-hidden="true">#</a> 6.7.3 函数名</h3><p>函数名的前缀有2部分：返回值类型、在哪个文件定义。</p><table><thead><tr><th><strong>函数名前缀</strong></th><th><strong>含义</strong></th></tr></thead><tbody><tr><td>vTaskPrioritySet</td><td>返回值类型：void 在task.c中定义</td></tr><tr><td>xQueueReceive</td><td>返回值类型：BaseType_t 在queue.c中定义</td></tr><tr><td>pvTimerGetTimerID</td><td>返回值类型：pointer to void 在tmer.c中定义</td></tr></tbody></table><h3 id="_6-7-4-宏的名" tabindex="-1"><a class="header-anchor" href="#_6-7-4-宏的名" aria-hidden="true">#</a> 6.7.4 宏的名</h3><p>宏的名字是大小，可以添加小写的前缀。前缀是用来表示：宏在哪个文件中定义。</p><table><thead><tr><th><strong>宏的前缀</strong></th><th><strong>含义：在哪个文件里定义</strong></th></tr></thead><tbody><tr><td>port (比如portMAX_DELAY)</td><td>portable.h或portmacro.h</td></tr><tr><td>task (比如taskENTER_CRITICAL())</td><td>task.h</td></tr><tr><td>pd (比如pdTRUE)</td><td>projdefs.h</td></tr><tr><td>config (比如configUSE_PREEMPTION)</td><td>FreeRTOSConfig.h</td></tr><tr><td>err (比如errQUEUE_FULL)</td><td>projdefs.h</td></tr></tbody></table><p>通用的宏定义如下：</p><table><thead><tr><th><strong>宏</strong></th><th><strong>值</strong></th></tr></thead><tbody><tr><td>pdTRUE</td><td>1</td></tr><tr><td>pdFALSE</td><td>0</td></tr><tr><td>pdPASS</td><td>1</td></tr><tr><td>pdFAIL</td><td>0</td></tr></tbody></table>`,46),i=[r];function d(o,p){return n(),a("div",null,i)}const l=t(s,[["render",d],["__file","chapter6.html.vue"]]);export{l as default};
