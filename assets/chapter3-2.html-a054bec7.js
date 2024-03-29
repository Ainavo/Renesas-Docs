import{_ as t,r as e,o,c,a as n,b as s,d as i,e as a}from"./app-829098b3.js";const l={},u=a(`<h1 id="_3-驱动i2c触摸屏-v1-2硬件" tabindex="-1"><a class="header-anchor" href="#_3-驱动i2c触摸屏-v1-2硬件" aria-hidden="true">#</a> 3. 驱动I2C触摸屏(v1.2硬件)</h1><p>本次实验我们在上一次实验的基础上驱动I2C触摸屏。从这次实验开始，我们不需要重新创建工程，而是在上一次实验项目的基础添加新的功能。</p><p>上次实验我们已经能通过使用 printf 函数打印输出信息，这次实验我们的目标是当触摸屏被按下时，打印当前被按下的触摸点的坐标信息(x, y)。</p><blockquote><p>每个实验都是在原有的基础上添加更多的功能，因此请确保每次实验都完成并得到预期的效果。</p></blockquote><h2 id="_3-1-复制工程" tabindex="-1"><a class="header-anchor" href="#_3-1-复制工程" aria-hidden="true">#</a> 3.1 复制工程</h2><p>上次实验得出的工程我们可以通过复制在原有的基础上得到一个新的工程，操作步骤：</p><ol><li>复制工程：</li></ol><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_001.png" alt=""></p><ol start="2"><li>粘贴工程</li></ol><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_002.png" alt=""></p><ol start="3"><li>复制确认窗口中，重命名项目为 <code>01_dshanmcu_ra6m5_i2c_touchpad</code>，点击 <strong>copy</strong> 按钮：</li></ol><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_003.png" alt=""></p><ol start="4"><li>得到重命名后的独立项目</li></ol><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_004.png" alt=""></p><ol start="5"><li>为了后续开发的方便(避免混淆)，将之前的项目关闭：</li></ol><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_005.png" alt=""></p><ol start="6"><li>关闭后的项目可以随时打开进行操作：</li></ol><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_006.png" alt=""></p><h2 id="_3-2-配置fsp" tabindex="-1"><a class="header-anchor" href="#_3-2-配置fsp" aria-hidden="true">#</a> 3.2 配置FSP</h2><h3 id="_3-2-1-查看硬件资料" tabindex="-1"><a class="header-anchor" href="#_3-2-1-查看硬件资料" aria-hidden="true">#</a> 3.2.1 查看硬件资料</h3><ol><li>打开位于 <code>03硬件资料\\1_开发板原理图\\ DshanMCU_RA6M5_V4.0.pdf</code> 的开发板原理图，确认使用哪一个I2C，电路图如下，引脚号是 **P409 (SDA2) ** 和 **P410(SCL2) **，它使用 <strong>SDA2/SCL2</strong> ，记住这个编号 <strong>2</strong>，接下来我们根据这个信息对 r_iic_master 进行配置。</li></ol><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_007.png" alt=""></p><ol start="2"><li>打开位于 <code>4_模块资料FT5x06触控芯片手册.pdf</code> 的触摸屏数据手册，跳转到如下位置：</li></ol><p>FT5X06是电容触摸IC,地址为0x38,寄存器地址为1字节,以下波型为读坐标时的波型,从寄存器0x05开始读. 时钟线SCL,数据线SDL.</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_008.png" alt=""></p><p>I2C协议相关点:</p><ol><li>总线空闲为高电平</li><li>为高时数据线不能变化start信号</li><li>时钟为高,数据线从高到低stop信号</li><li>时钟为高,数据线从低到高</li></ol><p>我们选择使用 <strong>0x70</strong> 也就是 <strong>0x38</strong> 的地址进行通信(我们使用的地址模式是7-bit，因此剔除最低一位，也就是将0x70右移一位的到0x38)。那么在使用iic进行通信之前，需要操作FT5X06的Reset引脚（P403）和INT引脚（P408），设置（告知）FT5X06我们想使用的通信地址。</p><blockquote><p>(参考阅读 “1_用户手册\\ARM嵌入式系统中面向对象的模块编程方法.pdf” 6.13 I2C协议章节)</p></blockquote><h3 id="_3-2-2-添加-stacks-r-iic-master" tabindex="-1"><a class="header-anchor" href="#_3-2-2-添加-stacks-r-iic-master" aria-hidden="true">#</a> 3.2.2 添加 Stacks(r_iic_master)</h3><ol><li>打开 FSP Configuration 视图：双击项目文件夹中的 <code>configuration.xml</code> 文件。</li><li>按照下图所示，添加 <code>r_sci_uart</code> 模块：</li></ol><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_009.png" alt=""></p><ol><li><p>点击刚刚添加的</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>r_iic_master
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>在底部窗口的</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Properties
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>选项卡中对其进行配置，将其配置为与下图一致：</p><ul><li>Name： g_i2c_master2</li><li>Channel： 2</li><li>Slave Address： 0x38</li><li>Callback： i2c_master2_callback</li></ul></li></ol>`,33),r={href:"https://renesas-docs.100ask.net/zh/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3.html#_3-2-3-%E9%85%8D%E7%BD%AE-reset-%E5%92%8Cint%E5%BC%95%E8%84%9A",target:"_blank",rel:"noopener noreferrer"},k=a(`<p>这2个引脚，在上面的原理图中有标注，分别是：</p><ul><li>Reset引脚 (P403)</li><li>INT引脚 (P408)</li></ul><p>根据上面找到的数据手册的描述，在FSP对其进行配置：</p><ol><li>按下图所示操作，打开配置IO引脚页面：</li></ol><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_0010.png" alt=""></p><ol start="2"><li>按下图所示操作，配置Reset引脚(P403)</li></ol><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_0011.png" alt=""></p><ol start="3"><li>按下图所示操作，配置INT引脚(P408)</li></ol><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_0012.png" alt=""></p><p>最后，检查确认无误，点击右上角的 <code>“Generate Project Content”</code> e2studio就会根据我们对FSP的配置自动配置项目、生成相应的代码。</p><h2 id="_3-3-编写触摸屏驱动代码" tabindex="-1"><a class="header-anchor" href="#_3-3-编写触摸屏驱动代码" aria-hidden="true">#</a> 3.3 编写触摸屏驱动代码</h2><p>在e2studio中打开 <code>01_dshanmcu_ra6m5_i2c_touchpad\\dshanmcu_ra6m5\\drivers</code> 目录，新建如下两个文件 <code>drv_i2c_touchpad.c</code> 和 <code>drv_i2c_touchpad.h</code>：</p><blockquote><p>如果你不清楚怎么在e2studio中创建文件，请参考阅读上一节实验中新建文件的说明教程。</p></blockquote><p>也可以直接在windows资源管理器中找到对应的目录添加文件或目录，这样添加的文件或目录也会自动同步在e2studio的项目列表中</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_0013.png" alt=""></p><p>在e2studio中点击打开 <code>01_dshanmcu_ra6m5_i2c_touchpad\\dshanmcu_ra6m5\\drivers\\drv_i2c_touchpad.c</code> 添加下面的代码：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;drv_gt911.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;hal_data.h&quot;</span></span>

<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;drv_touch.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdio.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdlib.h&gt;</span> </span>

<span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">I2C2WaitTxCplt</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">I2C2WaitRxCplt</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">FT5x06DrvWriteReg</span><span class="token punctuation">(</span><span class="token class-name">uint16_t</span> reg<span class="token punctuation">,</span> <span class="token class-name">uint8_t</span> <span class="token operator">*</span>buf<span class="token punctuation">,</span> <span class="token class-name">uint8_t</span> len<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">FT5x06DrvReadReg</span><span class="token punctuation">(</span><span class="token class-name">uint16_t</span> reg<span class="token punctuation">,</span> <span class="token class-name">uint8_t</span> <span class="token operator">*</span>buf<span class="token punctuation">,</span> <span class="token class-name">uint8_t</span> len<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">FT5x06DrvSoftReset</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">static</span> <span class="token class-name">uint32_t</span> <span class="token function">FT5x06DrvReadProductID</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">static</span> <span class="token class-name">uint32_t</span> <span class="token function">FT5x06DrvReadVendorID</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">FT5x06DrvClearBuf</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">static</span> <span class="token class-name">uint8_t</span> <span class="token function">FT5x06DrvReadVersion</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">static</span> <span class="token class-name">uint8_t</span> <span class="token function">FT5x06DrvGetGSTID</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">FT5x06DrvSetRotation</span><span class="token punctuation">(</span>TouchDrv_t <span class="token operator">*</span>tp<span class="token punctuation">,</span> TouchRotation_t rot<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">static</span> bool <span class="token function">FT5x06DrvIsTouched</span><span class="token punctuation">(</span>TouchDrv_t <span class="token operator">*</span> tp<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">FT5x06DrvInit</span><span class="token punctuation">(</span><span class="token keyword">struct</span> <span class="token class-name">TouchDev</span> <span class="token operator">*</span>ptDev<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">static</span> bool <span class="token function">FT5x06DrvRead</span><span class="token punctuation">(</span><span class="token keyword">struct</span> <span class="token class-name">TouchDev</span> <span class="token operator">*</span>ptDev<span class="token punctuation">,</span> <span class="token keyword">unsigned</span> <span class="token keyword">short</span> <span class="token operator">*</span>pX<span class="token punctuation">,</span> <span class="token keyword">unsigned</span> <span class="token keyword">short</span> <span class="token operator">*</span>pY<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">static</span> <span class="token keyword">struct</span> <span class="token class-name">TouchDev</span> gTouchDev <span class="token operator">=</span> <span class="token punctuation">{</span>
                                    <span class="token punctuation">.</span>name <span class="token operator">=</span> <span class="token string">&quot;FT5x06&quot;</span><span class="token punctuation">,</span>
                                    <span class="token punctuation">.</span>Init <span class="token operator">=</span> FT5x06DrvInit<span class="token punctuation">,</span>
                                    <span class="token punctuation">.</span>Read <span class="token operator">=</span> FT5x06DrvRead
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">static</span> <span class="token keyword">struct</span> <span class="token class-name">TouchDrv</span> gTP<span class="token punctuation">;</span>

<span class="token keyword">static</span> <span class="token keyword">volatile</span> bool gI2C2TxCplt <span class="token operator">=</span> false<span class="token punctuation">;</span>
<span class="token keyword">static</span> <span class="token keyword">volatile</span> bool gI2C2RxCplt <span class="token operator">=</span> false<span class="token punctuation">;</span>

<span class="token keyword">struct</span> <span class="token class-name">TouchDev</span><span class="token operator">*</span> <span class="token function">TouchDevGet</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token operator">&amp;</span>gTouchDev<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">void</span> <span class="token function">i2c_master2_callback</span><span class="token punctuation">(</span><span class="token class-name">i2c_master_callback_args_t</span> <span class="token operator">*</span> p_args<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">switch</span> <span class="token punctuation">(</span>p_args<span class="token operator">-&gt;</span>event<span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token keyword">case</span> I2C_MASTER_EVENT_TX_COMPLETE<span class="token operator">:</span>
        <span class="token punctuation">{</span>
            gI2C2TxCplt <span class="token operator">=</span> true<span class="token punctuation">;</span>
            <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">case</span> I2C_MASTER_EVENT_RX_COMPLETE<span class="token operator">:</span>
        <span class="token punctuation">{</span>
            gI2C2RxCplt <span class="token operator">=</span> true<span class="token punctuation">;</span>
            <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">default</span><span class="token operator">:</span>
        <span class="token punctuation">{</span>
            gI2C2TxCplt <span class="token operator">=</span> gI2C2RxCplt <span class="token operator">=</span> false<span class="token punctuation">;</span>
            <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">I2C2WaitTxCplt</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token class-name">uint16_t</span> wTimeOut <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>
    <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token operator">!</span>gI2C2TxCplt <span class="token operator">&amp;&amp;</span> wTimeOut<span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token function">R_BSP_SoftwareDelay</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> BSP_DELAY_UNITS_MILLISECONDS<span class="token punctuation">)</span><span class="token punctuation">;</span>
        wTimeOut<span class="token operator">--</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    gI2C2TxCplt <span class="token operator">=</span> false<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">I2C2WaitRxCplt</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token class-name">uint16_t</span> wTimeOut <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>
    <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token operator">!</span>gI2C2RxCplt <span class="token operator">&amp;&amp;</span> wTimeOut<span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token function">R_BSP_SoftwareDelay</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> BSP_DELAY_UNITS_MILLISECONDS<span class="token punctuation">)</span><span class="token punctuation">;</span>
        wTimeOut<span class="token operator">--</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    gI2C2RxCplt <span class="token operator">=</span> false<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">FT5x06DrvWriteReg</span><span class="token punctuation">(</span><span class="token class-name">uint16_t</span> reg<span class="token punctuation">,</span> <span class="token class-name">uint8_t</span> <span class="token operator">*</span>buf<span class="token punctuation">,</span> <span class="token class-name">uint8_t</span> len<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token class-name">uint8_t</span> regl <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">uint8_t</span><span class="token punctuation">)</span><span class="token punctuation">(</span>reg <span class="token operator">&amp;</span> <span class="token number">0xff</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">uint8_t</span> regh <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">uint8_t</span><span class="token punctuation">)</span><span class="token punctuation">(</span>reg<span class="token operator">&gt;&gt;</span><span class="token number">8</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">uint8_t</span> <span class="token operator">*</span> write_package <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">uint8_t</span><span class="token operator">*</span><span class="token punctuation">)</span><span class="token function">malloc</span><span class="token punctuation">(</span><span class="token punctuation">(</span>len <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token class-name">uint8_t</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">memcpy</span><span class="token punctuation">(</span>write_package<span class="token punctuation">,</span> <span class="token operator">&amp;</span>regh<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">memcpy</span><span class="token punctuation">(</span>write_package <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>regl<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">memcpy</span><span class="token punctuation">(</span>write_package <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">,</span> buf<span class="token punctuation">,</span> len<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token class-name">fsp_err_t</span> err <span class="token operator">=</span> g_i2c_master2<span class="token punctuation">.</span>p_api<span class="token operator">-&gt;</span><span class="token function">write</span><span class="token punctuation">(</span>g_i2c_master2<span class="token punctuation">.</span>p_ctrl<span class="token punctuation">,</span> write_package<span class="token punctuation">,</span> len <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>FSP_SUCCESS <span class="token operator">!=</span> err<span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token comment">//printf(&quot;%s %d\\r\\n&quot;, __FUNCTION__, __LINE__);</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token function">I2C2WaitTxCplt</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token function">free</span><span class="token punctuation">(</span>write_package<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">FT5x06DrvReadReg</span><span class="token punctuation">(</span><span class="token class-name">uint16_t</span> reg<span class="token punctuation">,</span> <span class="token class-name">uint8_t</span> <span class="token operator">*</span>buf<span class="token punctuation">,</span> <span class="token class-name">uint8_t</span> len<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token class-name">uint8_t</span> tmpbuf<span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

    tmpbuf<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">uint8_t</span><span class="token punctuation">)</span>reg<span class="token punctuation">;</span>

    <span class="token class-name">fsp_err_t</span> err <span class="token operator">=</span> g_i2c_master2<span class="token punctuation">.</span>p_api<span class="token operator">-&gt;</span><span class="token function">write</span><span class="token punctuation">(</span>g_i2c_master2<span class="token punctuation">.</span>p_ctrl<span class="token punctuation">,</span> tmpbuf<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>FSP_SUCCESS <span class="token operator">!=</span> err<span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token comment">//printf(&quot;%s %d\\r\\n&quot;, __FUNCTION__, __LINE__);</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token function">I2C2WaitTxCplt</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    err <span class="token operator">=</span> g_i2c_master2<span class="token punctuation">.</span>p_api<span class="token operator">-&gt;</span><span class="token function">read</span><span class="token punctuation">(</span>g_i2c_master2<span class="token punctuation">.</span>p_ctrl<span class="token punctuation">,</span> buf<span class="token punctuation">,</span> len<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>FSP_SUCCESS <span class="token operator">!=</span> err<span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token comment">//printf(&quot;%s %d\\r\\n&quot;, __FUNCTION__, __LINE__);</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token function">I2C2WaitRxCplt</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>



<span class="token keyword">static</span> <span class="token class-name">uint32_t</span> <span class="token function">FT5x06DrvReadVendorID</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token class-name">uint32_t</span> id <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token function">FT5x06DrvReadReg</span><span class="token punctuation">(</span><span class="token number">0xa3</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token class-name">uint8_t</span><span class="token operator">*</span><span class="token punctuation">)</span><span class="token operator">&amp;</span>id <span class="token punctuation">,</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> id<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">/* GT9XX可以选择2个I2C地址:0x5d 或 x14
 * rst信号从低到高变化: int信号是0则使用地址0x5d, 是1则使用地址0x14,
 * 在这之后再把int信号设置为中断引脚
 */</span>
<span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">FT5x06DrvInit</span><span class="token punctuation">(</span><span class="token keyword">struct</span> <span class="token class-name">TouchDev</span> <span class="token operator">*</span>ptDev<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">int</span> i<span class="token punctuation">;</span>
    
    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token constant">NULL</span> <span class="token operator">==</span> ptDev<span class="token operator">-&gt;</span>name<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
   gTP<span class="token punctuation">.</span>ucAddr <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">uint8_t</span><span class="token punctuation">)</span>g_i2c_master2<span class="token punctuation">.</span>p_cfg<span class="token operator">-&gt;</span>slave<span class="token punctuation">;</span>
    gTP<span class="token punctuation">.</span>tRotation <span class="token operator">=</span> TP_ROT_NONE<span class="token punctuation">;</span>

    <span class="token comment">/* 复位 */</span>
    g_ioport<span class="token punctuation">.</span>p_api<span class="token operator">-&gt;</span><span class="token function">pinWrite</span><span class="token punctuation">(</span>g_ioport<span class="token punctuation">.</span>p_ctrl<span class="token punctuation">,</span>
                             BSP_IO_PORT_04_PIN_03<span class="token punctuation">,</span>
                             BSP_IO_LEVEL_LOW<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">R_BSP_SoftwareDelay</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">,</span> BSP_DELAY_UNITS_MILLISECONDS<span class="token punctuation">)</span><span class="token punctuation">;</span>

    g_ioport<span class="token punctuation">.</span>p_api<span class="token operator">-&gt;</span><span class="token function">pinWrite</span><span class="token punctuation">(</span>g_ioport<span class="token punctuation">.</span>p_ctrl<span class="token punctuation">,</span>
                             BSP_IO_PORT_04_PIN_03<span class="token punctuation">,</span>
                             BSP_IO_LEVEL_HIGH<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">R_BSP_SoftwareDelay</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">,</span> BSP_DELAY_UNITS_MILLISECONDS<span class="token punctuation">)</span><span class="token punctuation">;</span>

    g_ioport<span class="token punctuation">.</span>p_api<span class="token operator">-&gt;</span><span class="token function">pinCfg</span><span class="token punctuation">(</span>g_ioport<span class="token punctuation">.</span>p_ctrl<span class="token punctuation">,</span>
                             BSP_IO_PORT_04_PIN_08<span class="token punctuation">,</span>
                             IOPORT_CFG_PORT_DIRECTION_INPUT<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">/* 初始化I2C驱动 */</span>
    <span class="token class-name">fsp_err_t</span> err <span class="token operator">=</span> g_i2c_master2<span class="token punctuation">.</span>p_api<span class="token operator">-&gt;</span><span class="token function">open</span><span class="token punctuation">(</span>g_i2c_master2<span class="token punctuation">.</span>p_ctrl<span class="token punctuation">,</span> g_i2c_master2<span class="token punctuation">.</span>p_cfg<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>FSP_SUCCESS <span class="token operator">!=</span> err<span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token comment">//printf(&quot;%s %d\\r\\n&quot;, __FUNCTION__, __LINE__);</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
	
	<span class="token comment">//g_i2c_master2.p_api-&gt;slaveAddressSet(g_i2c_master2.p_ctrl,0x5D, I2C_MASTER_ADDR_MODE_7BIT);</span>

    <span class="token comment">/* 读ID */</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">100</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token class-name">uint32_t</span> nVendorID <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    	nVendorID <span class="token operator">=</span> <span class="token function">FT5x06DrvReadVendorID</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token punctuation">(</span>nVendorID<span class="token operator">==</span><span class="token number">0x06</span><span class="token punctuation">)</span><span class="token operator">||</span><span class="token punctuation">(</span>nVendorID<span class="token operator">==</span><span class="token number">0x36</span><span class="token punctuation">)</span><span class="token operator">||</span><span class="token punctuation">(</span>nVendorID<span class="token operator">==</span> <span class="token number">0x64</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            <span class="token comment">//printf(&quot;ft5x06 read vendor id %d times: 0x%.4x\\r\\n&quot;, i, (int)nVendorID);</span>
		 	<span class="token keyword">return</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//printf(&quot;ft5x06 vendor id err\\r\\n&quot;);</span>

<span class="token punctuation">}</span>

<span class="token comment">//read touch point information</span>
<span class="token keyword">static</span> bool <span class="token function">FT5x06DrvRead</span><span class="token punctuation">(</span><span class="token keyword">struct</span> <span class="token class-name">TouchDev</span> <span class="token operator">*</span>ptDev<span class="token punctuation">,</span> <span class="token keyword">unsigned</span> <span class="token keyword">short</span> <span class="token operator">*</span>pX<span class="token punctuation">,</span> <span class="token keyword">unsigned</span> <span class="token keyword">short</span> <span class="token operator">*</span>pY<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">CFG_MAX_TOUCH_POINTS</span>  <span class="token expression"><span class="token number">5</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">CFG_POINT_READ_BUF</span>  <span class="token expression"><span class="token punctuation">(</span><span class="token number">3</span> <span class="token operator">+</span> <span class="token number">6</span> <span class="token operator">*</span> <span class="token punctuation">(</span>CFG_MAX_TOUCH_POINTS<span class="token punctuation">)</span><span class="token punctuation">)</span></span></span>

    <span class="token keyword">unsigned</span> <span class="token keyword">short</span> tmp_p<span class="token punctuation">;</span>
    <span class="token class-name">uint8_t</span> buf<span class="token punctuation">[</span>CFG_POINT_READ_BUF<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token number">0</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token keyword">int</span> ret <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">int</span> i<span class="token punctuation">;</span>
    <span class="token keyword">int</span> touch_point<span class="token punctuation">;</span>    

    <span class="token function">FT5x06DrvReadReg</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> buf<span class="token punctuation">,</span> CFG_POINT_READ_BUF<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">////printf(&quot;touch point = %d\\n\\r&quot;, buf[2]);</span>
    touch_point <span class="token operator">=</span> buf<span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">;</span> 
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>touch_point<span class="token punctuation">)</span>        
        <span class="token keyword">return</span> false<span class="token punctuation">;</span>


<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">if</span> <span class="token expression"><span class="token number">0</span></span></span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> event<span class="token operator">-&gt;</span>touch_point<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        event<span class="token operator">-&gt;</span>au16_x<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>s16<span class="token punctuation">)</span><span class="token punctuation">(</span>buf<span class="token punctuation">[</span><span class="token number">3</span> <span class="token operator">+</span> <span class="token number">6</span><span class="token operator">*</span>i<span class="token punctuation">]</span> <span class="token operator">&amp;</span> <span class="token number">0x0F</span><span class="token punctuation">)</span><span class="token operator">&lt;&lt;</span><span class="token number">8</span> <span class="token operator">|</span> <span class="token punctuation">(</span>s16<span class="token punctuation">)</span>buf<span class="token punctuation">[</span><span class="token number">4</span> <span class="token operator">+</span> <span class="token number">6</span><span class="token operator">*</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
        event<span class="token operator">-&gt;</span>au16_y<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>s16<span class="token punctuation">)</span><span class="token punctuation">(</span>buf<span class="token punctuation">[</span><span class="token number">5</span> <span class="token operator">+</span> <span class="token number">6</span><span class="token operator">*</span>i<span class="token punctuation">]</span> <span class="token operator">&amp;</span> <span class="token number">0x0F</span><span class="token punctuation">)</span><span class="token operator">&lt;&lt;</span><span class="token number">8</span> <span class="token operator">|</span> <span class="token punctuation">(</span>s16<span class="token punctuation">)</span>buf<span class="token punctuation">[</span><span class="token number">6</span> <span class="token operator">+</span> <span class="token number">6</span><span class="token operator">*</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
        event<span class="token operator">-&gt;</span>auint8_t_touch_event<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> buf<span class="token punctuation">[</span><span class="token number">0x3</span> <span class="token operator">+</span> <span class="token number">6</span><span class="token operator">*</span>i<span class="token punctuation">]</span> <span class="token operator">&gt;&gt;</span> <span class="token number">6</span><span class="token punctuation">;</span>
        event<span class="token operator">-&gt;</span>auint8_t_finger_id<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>buf<span class="token punctuation">[</span><span class="token number">5</span> <span class="token operator">+</span> <span class="token number">6</span><span class="token operator">*</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">&gt;&gt;</span><span class="token number">4</span><span class="token punctuation">;</span>
        <span class="token comment">//printk(&quot;%d, %d\\n&quot;, event-&gt;au16_x[i], event-&gt;au16_y[i]);</span>
    <span class="token punctuation">}</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span></span>
    <span class="token operator">*</span>pX <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">uint16_t</span><span class="token punctuation">)</span><span class="token punctuation">(</span>buf<span class="token punctuation">[</span><span class="token number">3</span> <span class="token operator">+</span> <span class="token number">6</span><span class="token operator">*</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">&amp;</span> <span class="token number">0x0F</span><span class="token punctuation">)</span><span class="token operator">&lt;&lt;</span><span class="token number">8</span> <span class="token operator">|</span> <span class="token punctuation">(</span><span class="token class-name">uint16_t</span><span class="token punctuation">)</span>buf<span class="token punctuation">[</span><span class="token number">4</span> <span class="token operator">+</span> <span class="token number">6</span><span class="token operator">*</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token operator">*</span>pY <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">uint16_t</span><span class="token punctuation">)</span><span class="token punctuation">(</span>buf<span class="token punctuation">[</span><span class="token number">5</span> <span class="token operator">+</span> <span class="token number">6</span><span class="token operator">*</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">&amp;</span> <span class="token number">0x0F</span><span class="token punctuation">)</span><span class="token operator">&lt;&lt;</span><span class="token number">8</span> <span class="token operator">|</span> <span class="token punctuation">(</span><span class="token class-name">uint16_t</span><span class="token punctuation">)</span>buf<span class="token punctuation">[</span><span class="token number">6</span> <span class="token operator">+</span> <span class="token number">6</span><span class="token operator">*</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

    <span class="token comment">//*pX = (uint16_t)(buf[3 + 6*0] &amp; 0x0F)&lt;&lt;8;</span>
    <span class="token comment">//*pY = (uint16_t)(buf[5 + 6*0] &amp; 0x0F)&lt;&lt;8;</span>

    <span class="token comment">//旋转方向</span>
    <span class="token class-name">uint16_t</span> temp<span class="token punctuation">;</span>
    <span class="token keyword">switch</span> <span class="token punctuation">(</span>TP_ROT_90<span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token keyword">case</span> TP_ROT_NONE<span class="token operator">:</span>
            <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token keyword">case</span> TP_ROT_270<span class="token operator">:</span>
            temp <span class="token operator">=</span> <span class="token operator">*</span>pX<span class="token punctuation">;</span>
            <span class="token operator">*</span>pX <span class="token operator">=</span> <span class="token number">320</span> <span class="token operator">-</span> <span class="token operator">*</span>pY<span class="token punctuation">;</span>
            <span class="token operator">*</span>pY <span class="token operator">=</span> temp<span class="token punctuation">;</span>
            <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token keyword">case</span> TP_ROT_180<span class="token operator">:</span>
            temp <span class="token operator">=</span> <span class="token operator">*</span>pY<span class="token punctuation">;</span>
            <span class="token operator">*</span>pY <span class="token operator">=</span> <span class="token operator">*</span>pX<span class="token punctuation">;</span>
            <span class="token operator">*</span>pX <span class="token operator">=</span> temp<span class="token punctuation">;</span>
            <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token keyword">case</span> TP_ROT_90<span class="token operator">:</span>
            temp <span class="token operator">=</span> <span class="token operator">*</span>pY<span class="token punctuation">;</span>
            <span class="token operator">*</span>pY <span class="token operator">=</span> <span class="token operator">*</span>pX<span class="token punctuation">;</span>
            <span class="token operator">*</span>pX <span class="token operator">=</span> <span class="token number">480</span> <span class="token operator">-</span> temp<span class="token punctuation">;</span>
            <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token keyword">default</span><span class="token operator">:</span>
            <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> true<span class="token punctuation">;</span>    
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在e2studio中点击打开 <code>01_dshanmcu_ra6m5_i2c_touchpad\\dshanmcu_ra6m5\\drivers\\drv_i2c_touchpad.h</code> 添加下面的代码：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">ifndef</span> <span class="token expression">DRV_I2C_TOUCHPAD_H</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">DRV_I2C_TOUCHPAD_H</span></span>

<span class="token comment">/***********************************************************************************************************************
 * Includes
 **********************************************************************************************************************/</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;hal_data.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdio.h&gt;</span></span>

<span class="token comment">/**********************************************************************************************************************
 * Macro definitions
 **********************************************************************************************************************/</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">TOUCH_POINT_TOTAL</span>           <span class="token expression"><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span>     </span><span class="token comment">/* 此芯片最多支持五点触控 */</span></span>

<span class="token comment">/**********************************************************************************************************************
 * Typedef definitions
 **********************************************************************************************************************/</span>
<span class="token keyword">typedef</span> <span class="token keyword">enum</span>
<span class="token punctuation">{</span>
    TP_ROT_NONE <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span>
    TP_ROT_90<span class="token punctuation">,</span>
    TP_ROT_180<span class="token punctuation">,</span>
    TP_ROT_270
<span class="token punctuation">}</span> <span class="token class-name">tp_rotation_t</span><span class="token punctuation">;</span>

<span class="token comment">/**用于存放每一个触控点的id，坐标，大小**/</span>
<span class="token keyword">typedef</span> <span class="token keyword">struct</span> <span class="token class-name">TouchPointInfo</span><span class="token punctuation">{</span>
    <span class="token keyword">unsigned</span> <span class="token keyword">char</span> id<span class="token punctuation">;</span>
    <span class="token keyword">unsigned</span> <span class="token keyword">short</span> x<span class="token punctuation">;</span>
    <span class="token keyword">unsigned</span> <span class="token keyword">short</span> y<span class="token punctuation">;</span>
    <span class="token keyword">unsigned</span> <span class="token keyword">short</span> size<span class="token punctuation">;</span>
<span class="token punctuation">}</span>TouchPointInfo_t<span class="token punctuation">;</span>

<span class="token comment">/**类结构体**/</span>
<span class="token keyword">typedef</span> <span class="token keyword">struct</span> <span class="token class-name">TouchDrv</span><span class="token punctuation">{</span>
    <span class="token keyword">unsigned</span> <span class="token keyword">char</span>  ucAddr<span class="token punctuation">;</span>
    <span class="token keyword">unsigned</span> <span class="token keyword">short</span> wHeight<span class="token punctuation">;</span>
    <span class="token keyword">unsigned</span> <span class="token keyword">short</span> wWidth<span class="token punctuation">;</span>
    TouchRotation_t tRotation<span class="token punctuation">;</span>
    TouchPointInfo_t tPointsInfo<span class="token punctuation">[</span>TOUCH_POINT_TOTAL<span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">//用于存储五个触控点的坐标</span>
<span class="token punctuation">}</span>TouchDrv_t<span class="token punctuation">;</span>

<span class="token keyword">typedef</span> <span class="token keyword">struct</span> <span class="token class-name">TouchDev</span><span class="token punctuation">{</span>
    <span class="token keyword">char</span> <span class="token operator">*</span>name<span class="token punctuation">;</span>
    <span class="token keyword">void</span> <span class="token punctuation">(</span><span class="token operator">*</span>Init<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">struct</span> <span class="token class-name">TouchDev</span> <span class="token operator">*</span>ptDev<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">bool</span> <span class="token punctuation">(</span><span class="token operator">*</span>Read<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">struct</span> <span class="token class-name">TouchDev</span> <span class="token operator">*</span>ptDev<span class="token punctuation">,</span> <span class="token keyword">unsigned</span> <span class="token keyword">short</span> <span class="token operator">*</span>pX<span class="token punctuation">,</span> <span class="token keyword">unsigned</span> <span class="token keyword">short</span> <span class="token operator">*</span>pY<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>TouchDev<span class="token punctuation">,</span> <span class="token operator">*</span>PTouchDev<span class="token punctuation">;</span>

<span class="token comment">/***********************************************************************************************************************
 * Exported global variables
 **********************************************************************************************************************/</span>

<span class="token comment">/***********************************************************************************************************************
 * Exported global functions (to be accessed by other files)
 **********************************************************************************************************************/</span>

<span class="token keyword">struct</span> <span class="token class-name">TouchDev</span><span class="token operator">*</span> <span class="token function">TouchDevGet</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span> <span class="token comment">/*DRV_I2C_TOUCHPAD_H*/</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-4-编写app" tabindex="-1"><a class="header-anchor" href="#_3-4-编写app" aria-hidden="true">#</a> 3.4 编写app</h2><p>在 <code>01_dshanmcu_ra6m5_i2c_touchpad\\dshanmcu_ra6m5\\applications</code> 目录下新建两个 <code>app_i2c_touchpad_test.c</code> 文件，如下图所示：</p><p><img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_0014.png" alt=""></p><p>打开 <code>app_i2c_touchpad_test.c</code> 添加如下代码：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">/***********************************************************************************************************************
 * Includes
 **********************************************************************************************************************/</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;app.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;drv_uart.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;drv_i2c_touchpad.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdio.h&gt;</span></span>

<span class="token comment">/**********************************************************************************************************************
 * Macro definitions
 **********************************************************************************************************************/</span>


<span class="token comment">/**********************************************************************************************************************
 * Typedef definitions
 **********************************************************************************************************************/</span>


<span class="token comment">/***********************************************************************************************************************
 * Private function prototypes
 **********************************************************************************************************************/</span>
<span class="token keyword">static</span> <span class="token class-name">fsp_err_t</span> <span class="token function">i2c_touchpad_read</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">/***********************************************************************************************************************
 * Private global variables
 **********************************************************************************************************************/</span>

<span class="token comment">/***********************************************************************************************************************
 * Functions
 **********************************************************************************************************************/</span>

<span class="token keyword">void</span> <span class="token function">app_i2c_touchpad_test</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    TouchDev <span class="token operator">*</span>ptDev <span class="token operator">=</span> <span class="token function">TouchDevGet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token constant">NULL</span> <span class="token operator">==</span> ptDev<span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Error. Not Found Touch Device!\\r\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    ptDev<span class="token operator">-&gt;</span><span class="token function">Init</span><span class="token punctuation">(</span>ptDev<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">uint16_t</span> x <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> y <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>ptDev<span class="token operator">-&gt;</span><span class="token function">Read</span><span class="token punctuation">(</span>ptDev<span class="token punctuation">,</span> <span class="token operator">&amp;</span>x<span class="token punctuation">,</span> <span class="token operator">&amp;</span>y<span class="token punctuation">)</span> <span class="token operator">==</span> true<span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Touch-Position: (%d,%d)\\r\\n&quot;</span><span class="token punctuation">,</span> x<span class="token punctuation">,</span> y<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">else</span>
            <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;not touch\\n\\r&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">/***********************************************************************************************************************
 * Private Functions
 **********************************************************************************************************************/</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>将 <code>app.h</code> 改为如下代码：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">ifndef</span> <span class="token expression">APP_TEST_H</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">APP_TEST_H</span></span>

<span class="token comment">/***********************************************************************************************************************
 * Includes
 **********************************************************************************************************************/</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;hal_data.h&quot;</span></span>

<span class="token comment">/**********************************************************************************************************************
 * Macro definitions
 **********************************************************************************************************************/</span>

<span class="token comment">/**********************************************************************************************************************
 * Typedef definitions
 **********************************************************************************************************************/</span>

<span class="token comment">/***********************************************************************************************************************
 * Exported global variables
 **********************************************************************************************************************/</span>

<span class="token comment">/***********************************************************************************************************************
 * Exported global functions (to be accessed by other files)
 **********************************************************************************************************************/</span>

<span class="token keyword">void</span> <span class="token function">app_uart_test</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">void</span> <span class="token function">app_i2c_touchpad_test</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span> <span class="token comment">/*APP_TEST_H*/</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-5-调用app" tabindex="-1"><a class="header-anchor" href="#_3-5-调用app" aria-hidden="true">#</a> 3.5 调用app</h2><p>打开 <code>01_dshanmcu_ra6m5_i2c_touchpad\\src\\hal_entry.c</code> ，按照如下步骤进行修改：</p><p>将 <code>hal_entry</code> 函数修改为如下所示的代码：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">hal_entry</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token comment">/* TODO: add your own code here */</span>
    <span class="token comment">//app_uart_test();</span>
    <span class="token function">app_i2c_touchpad_test</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">if</span> <span class="token expression">BSP_TZ_SECURE_BUILD</span></span>
    <span class="token comment">/* Enter non-secure code */</span>
    <span class="token function">R_BSP_NonSecureEnter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-6-验证效果" tabindex="-1"><a class="header-anchor" href="#_3-6-验证效果" aria-hidden="true">#</a> 3.6 验证效果</h2><p>点击编译按钮，再点击 debug 按钮，将程序烧写到开发板中。打开串口工具，在e2stduio点击运行代码，会看到串口工具有信息输出，此时触摸屏幕会将所有触摸点的数值打印出来，串口输出现象：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code>Touch<span class="token operator">-</span>Position<span class="token operator">:</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span>x<span class="token punctuation">)</span>
Touch<span class="token operator">-</span>Position<span class="token operator">:</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span>x<span class="token punctuation">)</span>
Touch<span class="token operator">-</span>Position<span class="token operator">:</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span>x<span class="token punctuation">)</span>
Touch<span class="token operator">-</span>Position<span class="token operator">:</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span>x<span class="token punctuation">)</span>
或
not touch
not touch
not touch
not touch
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,33);function d(v,m){const p=e("ExternalLinkIcon");return o(),c("div",null,[u,n("p",null,[n("a",r,[s("#"),i(p)]),s("1.2.3 配置 Reset 和INT引脚")]),k])}const _=t(l,[["render",d],["__file","chapter3-2.html.vue"]]);export{_ as default};
