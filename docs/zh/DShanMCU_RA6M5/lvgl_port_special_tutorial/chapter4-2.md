# 4. 驱动SPI LCD屏(v1.2硬件)

本次实验我们在上一次实验的基础上驱动 LCD屏(SPI)。

上次实验我们已经能驱动触摸屏(I2C)并打印触摸点坐标，这次实验我们的目标是点亮LCD屏，向屏幕依次刷写红绿蓝三种不同的颜色，并在串口终端打印当前刷新的颜色文本信息。

## 4.1 复制工程

上次实验得出的工程我们可以通过复制在原有的基础上得到一个新的工程。

> 如果你不清楚复制工程的步骤，请参考阅读第2章实验的步骤教程。

本次实验我们的项目命名为：**02_dshanmcu_ra6m5_spi_display**

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_001.png)

## 4.2 配置FSP

### 4.2.1 查看硬件资料

打开位于 `03硬件资料\1_开发板原理图\ DshanMCU_RA6M5_V4.0.pdf` 的开发板原理图，确认SPI引脚，电路图如下：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_002.png)

可以看到原理图并没有像之前那样直接就能确定使用的是哪一路spi，因此需要打开位于 `03硬件资料\5_官方资料\RA6M5 Group User's Manual Hardware.pdf` 的文档，跳转到下图所示的两个位置，确定使用的是 spi1：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_003.png)![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_004.png)

`03硬件资料\5_官方资料\RA6M5 Group User's Manual Hardware.pdf` 的文档，跳转到下图所示的位置，确定SPI时钟频率计算公式：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_005.png)

打开 e2studio 如下窗口，确定当前的 PCLKA： 由下图可知 PCLKA 为 200MHz，因此可得出支持的SPI最大时钟频率为：`100/ (2*(0+1) * 2^0) = 100 / 2 = 50Mbps`

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_006.png)

打开位于 `4_模块资料\01_ST7796显示器芯片手册\ST7796U2_SPEC_V1.0.pdf` 的文档，跳转到下图所示的位置：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_007.png)

通过换算可得出时钟频率： 1000000000 / 15= 66,666,666.66666667 ≈ 66.5Mhz

接下来我们根据这些信息对 `r_spi` 进行配置。

### 4.2.2 添加 Stacks(r_spi_master)

1. 打开 `FSP Configuration` 视图：双击项目文件夹中的 `configuration.xml` 文件。
2. 按照下图所示，添加 `r_spi` 模块：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_008.png)

1. 点击刚刚添加的 `r_spi` 在底部窗口的 `Properties` 选项卡中对其进行配置，将其配置为与下图一致：
   - Name： g_spi1
   - Channel： 1
   - Callback： spi1_callback
   - Bitrate： 50000000

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_009.png)

配置完成之后，如果马上编译会发现编译出错、可以根据错误信息进行解决，也可以在编译前参考下图解决：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_0010.png)

点击刚刚添加的 `r_dmac` 在底部窗口的 `Properties` 选项卡中对其进行配置，将其配置为与下图一致：

- Name： g_transfer1
- Channel：1

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_0011.png)

### 4.2.3 配置RS、RESET、PWM引脚

这三个引脚，在上面的原理图中有标注，负责的功能分别是：

- RS引脚(P104)：低电平代表发送的是指令，高电平代表发送的是数据
- RESET引脚(P105)：控制LCD屏的复位
- PWM引脚(P608)：可以自由调节背光亮度调节，给高电平常亮

根据他们负责的功能特性，在FSP对其进行配置：

1. 按下图所示操作，打开配置IO引脚页面：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_0012.png)

1. 按下图所示操作，配置RS引脚(P104)

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_0013.png)

1. 按下图所示操作，配置RESET引脚(P105)

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_0014.png)

1. 按下图所示操作，配置PWM引脚(P608)

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_0015.png)

最后检查确认无误，点击右上角的 `“Generate Project Content”` e2studio就会根据我们对FSP的配置自动配置项目、生成相应的代码。

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_0016.png)

## 4.3 编写LCD驱动代码

在e2studio中进入 `02_dshanmcu_ra6m5_spi_display\dshanmcu_ra6m5\drivers` 目录，新建如下两个文件 `drv_spi_display.c` 和 `drv_spi_display.h`：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_0017.png)

在e2studio中点击打开 `02_dshanmcu_ra6m5_spi_display\dshanmcu_ra6m5\drivers\drv_spi_display.c` 添加下面的代码：

```c
/***********************************************************************************************************************
 * Includes
 **********************************************************************************************************************/
#include "drv_spi_display.h"
#include <stdio.h>

/**********************************************************************************************************************
 * Macro definitions
 **********************************************************************************************************************/
#define LCD_DC_PIN              BSP_IO_PORT_01_PIN_04
#define LCD_RESET_PIN           BSP_IO_PORT_01_PIN_05
#define LCD_PWM_PIN             BSP_IO_PORT_06_PIN_08

#define SPI_SEND_DATA           BSP_IO_LEVEL_HIGH
#define SPI_SEND_CMD            BSP_IO_LEVEL_LOW

/* ST7796S部分寄存器定义 */
#define LCD_DISPLAY_CMD_RAMCTRL           0xb0 // RAM Control
#define LCD_DISPLAY_CMD_CASET             0x2a // Column address set
#define LCD_DISPLAY_CMD_RASET             0x2b // Row address set
#define LCD_DISPLAY_CMD_RAMWR             0x2c // Memory write

/**********************************************************************************************************************
 * Typedef definitions
 **********************************************************************************************************************/

/***********************************************************************************************************************
 * Private function prototypes
 **********************************************************************************************************************/
static void spi1_wait_for_tx(void);
static void spi_display_init(void);

static fsp_err_t spi_send_data_cmd(uint8_t * uc_data, bsp_io_level_t uc_cmd, uint32_t len);
static fsp_err_t spi_display_backlight_opt(bsp_io_level_t opt);
static fsp_err_t spi_display_reset(void);

/***********************************************************************************************************************
 * Private global variables
 **********************************************************************************************************************/
/* Event flags for master */
static volatile spi_event_t g_master_event_flag;    // Master Transfer Event completion flag

/***********************************************************************************************************************
 * Functions
 **********************************************************************************************************************/

fsp_err_t drv_spi_display_init(void)
{
    fsp_err_t err;

    /* 初始化I2C驱动 */
    err = g_spi1.p_api->open(&g_spi1_ctrl, &g_spi1_cfg);
    if (FSP_SUCCESS != err)
    {
        printf ("%s %d\r\n", __FUNCTION__, __LINE__);
        return err;
    }

    spi_display_init();

    return err;
}

void spi_display_set_window(uint16_t x1, uint16_t y1, uint16_t x2, uint16_t y2)
{
    uint8_t caset[4];
    uint8_t raset[4];

    caset[0] = (uint8_t)(x1 >> 8) & 0xFF;
    caset[1] = (uint8_t)(x1 & 0xff);
    caset[2] = (uint8_t)(x2 >> 8) & 0xFF;
    caset[3] = (uint8_t)(x2 & 0xff) ;

    raset[0] = (uint8_t)(y1 >> 8) & 0xFF;
    raset[1] = (uint8_t)(y1 & 0xff);
    raset[2] = (uint8_t)(y2 >> 8) & 0xFF;
    raset[3] = (uint8_t)(y2 & 0xff);

    spi_send_data_cmd((uint8_t []){LCD_DISPLAY_CMD_CASET}, SPI_SEND_CMD, 1); // Horiz
    spi_send_data_cmd(caset, SPI_SEND_DATA, 4);
    spi_send_data_cmd((uint8_t []){LCD_DISPLAY_CMD_RASET}, SPI_SEND_CMD, 1); // Vert
    spi_send_data_cmd(raset, SPI_SEND_DATA, 4);
    spi_send_data_cmd((uint8_t []){LCD_DISPLAY_CMD_RAMWR}, SPI_SEND_CMD, 1); // Memory write
}

fsp_err_t drv_spi_display_flush_data(uint8_t * data, uint32_t len)
{
    fsp_err_t err;

    err = spi_send_data_cmd(data, SPI_SEND_DATA, len);
    if (FSP_SUCCESS != err)
    {
        printf ("%s %d\r\n", __FUNCTION__, __LINE__);
        return err;
    }

    return err;
}


void spi1_callback(spi_callback_args_t *p_args)
{
    /* 判断是否是发送完成触发的中断 */
    /* 如果是的话就将发送完成标志位置1 */
    if (SPI_EVENT_TRANSFER_COMPLETE == p_args->event)
    {
        g_master_event_flag = SPI_EVENT_TRANSFER_COMPLETE;
    }
    else
    {
        g_master_event_flag = SPI_EVENT_TRANSFER_ABORTED;
    }
}

/***********************************************************************************************************************
 * Private Functions
 **********************************************************************************************************************/
static void spi1_wait_for_tx(void)
{
    while(!g_master_event_flag);
    g_master_event_flag = false;
}


static void spi_display_init(void)
{
    spi_display_reset();
    spi_display_backlight_opt(BSP_IO_LEVEL_HIGH); // backlight on

// Positive Gamma Control
    LCDDrvWriteReg(0xe0);
    LCDDrvWriteDat(0xf0);
    LCDDrvWriteDat(0x3e);
    LCDDrvWriteDat(0x30);
    LCDDrvWriteDat(0x06);
    LCDDrvWriteDat(0x0a);
    LCDDrvWriteDat(0x03);
    LCDDrvWriteDat(0x4d);
    LCDDrvWriteDat(0x56);
    LCDDrvWriteDat(0x3a);
    LCDDrvWriteDat(0x06);
    LCDDrvWriteDat(0x0f);
    LCDDrvWriteDat(0x04);
    LCDDrvWriteDat(0x18);
    LCDDrvWriteDat(0x13);
    LCDDrvWriteDat(0x00);

    // Negative Gamma Control
    LCDDrvWriteReg(0xe1);
    LCDDrvWriteDat(0x0f);
    LCDDrvWriteDat(0x37);
    LCDDrvWriteDat(0x31);
    LCDDrvWriteDat(0x0b);
    LCDDrvWriteDat(0x0d);
    LCDDrvWriteDat(0x06);
    LCDDrvWriteDat(0x4d);
    LCDDrvWriteDat(0x34);
    LCDDrvWriteDat(0x38);
    LCDDrvWriteDat(0x06);
    LCDDrvWriteDat(0x11);
    LCDDrvWriteDat(0x01);
    LCDDrvWriteDat(0x18);
    LCDDrvWriteDat(0x13);
    LCDDrvWriteDat(0x00);
    
    // Power Control 1
    LCDDrvWriteReg(0xc0);
    LCDDrvWriteDat(0x18);
    LCDDrvWriteDat(0x17);

    // Power Control 2
    LCDDrvWriteReg(0xc1);
    LCDDrvWriteDat(0x41);

    // Power Control 3
    LCDDrvWriteReg(0xc5);
    LCDDrvWriteDat(0x00);

    // VCOM Control
    LCDDrvWriteReg(0x1a);
    LCDDrvWriteDat(0x80);

    // Memory Access Control
    LCDDrvWriteReg(0x36);
    LCDDrvWriteDat(0x48);

    // Pixel Interface Format
    LCDDrvWriteReg(0x3a);
    LCDDrvWriteDat(0x55);

    // Interface Mode Control
    LCDDrvWriteReg(0xb0);
    LCDDrvWriteDat(0x00);

    // Frame Rate Control
    LCDDrvWriteReg(0xb1);
    LCDDrvWriteDat(0xa0);

    // Display Inversion Control
    LCDDrvWriteReg(0xb4);
    LCDDrvWriteDat(0x02);

    // Display Function Control
    LCDDrvWriteReg(0xb6);
    LCDDrvWriteDat(0x02);
    LCDDrvWriteDat(0x02);

    // Set image function
    LCDDrvWriteReg(0xe9);
    LCDDrvWriteDat(0x00);

    //Adjust Control 3
    LCDDrvWriteReg(0xf7);
    LCDDrvWriteDat(0xa9);
    LCDDrvWriteDat(0x51);
    LCDDrvWriteDat(0x2c);
    LCDDrvWriteDat(0x82);

    // Write_memory_start
    LCDDrvWriteReg(0x21);
    R_BSP_SoftwareDelay(120, BSP_DELAY_UNITS_MILLISECONDS);
    //Exit Sleep
    LCDDrvWriteReg(0x11);
    R_BSP_SoftwareDelay(120, BSP_DELAY_UNITS_MILLISECONDS);
    //Display on
    LCDDrvWriteReg(0x29);
    R_BSP_SoftwareDelay(120, BSP_DELAY_UNITS_MILLISECONDS);

    // PROTATION 90
    LCDDrvWriteReg(0x36);
    LCDDrvWriteDat(0xe8);

    // set_screen_size
    LCDDrvWriteReg(0x2a);
    LCDDrvWriteDat(0x00);
    LCDDrvWriteDat(0x00);
    LCDDrvWriteDat(0x01);
    LCDDrvWriteDat(0x3f);

    LCDDrvWriteReg(0x2b);
    LCDDrvWriteDat(0x00);
    LCDDrvWriteDat(0x00);
    LCDDrvWriteDat(0x01);
    LCDDrvWriteDat(0xdf);

}

static fsp_err_t spi_send_data_cmd(uint8_t * uc_data, bsp_io_level_t uc_cmd, uint32_t len)
{
    fsp_err_t err = FSP_SUCCESS;     // Error status

    /* Master send data to device */
    err = g_ioport.p_api->pinWrite(g_ioport.p_ctrl, LCD_DC_PIN, uc_cmd);
    if(FSP_SUCCESS != err)
    {
        printf ("%s %d\r\n", __FUNCTION__, __LINE__);
        return err;
    }

    err = g_spi1.p_api->write(g_spi1.p_ctrl, uc_data, len, SPI_BIT_WIDTH_8_BITS);
    if(FSP_SUCCESS != err)
    {
        printf ("%s %d\r\n", __FUNCTION__, __LINE__);
        return err;
    }

    spi1_wait_for_tx();

    return err;
}

static fsp_err_t spi_display_backlight_opt(bsp_io_level_t opt)
{
    fsp_err_t err = FSP_SUCCESS;     // Error status

    g_ioport.p_api->pinWrite((ioport_ctrl_t * const )&g_ioport.p_ctrl, LCD_PWM_PIN, opt);
    return err;
}


static fsp_err_t spi_display_reset(void)
{
    fsp_err_t err = FSP_SUCCESS;     // Error status

    g_ioport.p_api->pinWrite((ioport_ctrl_t * const )&g_ioport.p_ctrl, LCD_RESET_PIN, BSP_IO_LEVEL_LOW);
    R_BSP_SoftwareDelay(120, BSP_DELAY_UNITS_MILLISECONDS); //延时120ms
    g_ioport.p_api->pinWrite((ioport_ctrl_t * const )&g_ioport.p_ctrl, LCD_RESET_PIN, BSP_IO_LEVEL_HIGH);
    R_BSP_SoftwareDelay(120, BSP_DELAY_UNITS_MILLISECONDS); //延时120ms

    return err;
}
```

在e2studio中点击打开 `02_dshanmcu_ra6m5_spi_display\dshanmcu_ra6m5\drivers\drv_spi_display.h` 添加下面的代码：

```c
#ifndef DRV_SPI_DISPLAY_H
#define DRV_SPI_DISPLAY_H

/***********************************************************************************************************************
 * Includes
 **********************************************************************************************************************/
#include "hal_data.h"

/**********************************************************************************************************************
 * Macro definitions
 **********************************************************************************************************************/
#define LCD_SCREEN_WIDTH        (320)
#define LCD_SCREEN_HEIGHT       (480)

#define LCD_COLOR_RED           (0xF800)
#define LCD_COLOR_GREEN         (0x07E0)
#define LCD_COLOR_BLUE          (0x001F)

/**********************************************************************************************************************
 * Typedef definitions
 **********************************************************************************************************************/

/***********************************************************************************************************************
 * Exported global variables
 **********************************************************************************************************************/

/***********************************************************************************************************************
 * Exported global functions (to be accessed by other files)
 **********************************************************************************************************************/

fsp_err_t drv_spi_display_init(void);

void spi_display_set_window(uint16_t x1, uint16_t y1, uint16_t x2, uint16_t y2);

fsp_err_t drv_spi_display_flush_data(uint8_t * data, uint32_t len);

#endif /*DRV_SPI_DISPLAY_H*/
```

## 4.4 编写app

在 `02_dshanmcu_ra6m5_spi_display\dshanmcu_ra6m5\applications` 目录下新建 `app_spi_display_test.c` 文件，如下图所示：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_0018.png)

打开 `app_spi_display_test.c` 添加如下代码：

```c
/***********************************************************************************************************************
 * Includes
 **********************************************************************************************************************/
#include "app.h"
#include "drv_uart.h"
#include "drv_spi_display.h"
#include <stdio.h>

/**********************************************************************************************************************
 * Macro definitions
 **********************************************************************************************************************/

/**********************************************************************************************************************
 * Typedef definitions
 **********************************************************************************************************************/


/***********************************************************************************************************************
 * Private function prototypes
 **********************************************************************************************************************/
static void spi_display_show_color(uint16_t color_le);

/***********************************************************************************************************************
 * Private global variables
 **********************************************************************************************************************/

/***********************************************************************************************************************
 * Functions
 **********************************************************************************************************************/
void app_spi_display_test(void)
{
    fsp_err_t err;

    err = drv_uart_init();
    if(FSP_SUCCESS != err) __BKPT();

    err = drv_spi_display_init();
    if(FSP_SUCCESS != err)
    {
        printf ("%s %d\r\n", __FUNCTION__, __LINE__);
        __BKPT();
    }

    while(1)
    {
        spi_display_show_color((uint16_t)LCD_COLOR_RED);
        printf ("Full screen display in red\r\n");
        R_BSP_SoftwareDelay(500, BSP_DELAY_UNITS_MILLISECONDS); //延时500ms

        spi_display_show_color((uint16_t)LCD_COLOR_GREEN);
        printf ("Full screen display in green\r\n");
        R_BSP_SoftwareDelay(500, BSP_DELAY_UNITS_MILLISECONDS); //延时500ms

        spi_display_show_color((uint16_t)LCD_COLOR_BLUE);
        printf ("Full screen display in blue\r\n");
        R_BSP_SoftwareDelay(500, BSP_DELAY_UNITS_MILLISECONDS); //延时500ms
    }

}


static void spi_display_show_color(uint16_t color_le)
{
    uint8_t color_be[2];
    color_be [0] = (uint8_t)((color_le & 0xff00) >> 8);
    color_be [1] = (uint8_t)(color_le & 0xff);

    spi_display_set_window(0, 0, LCD_SCREEN_WIDTH, LCD_SCREEN_HEIGHT);

    for(uint16_t x = 0; x < LCD_SCREEN_WIDTH; x++)
        for(uint16_t y = 0; y < LCD_SCREEN_HEIGHT; y++)
            drv_spi_display_flush_data(color_be, 2);
}
/***********************************************************************************************************************
 * Private Functions
 **********************************************************************************************************************/
```

将 `app.h` 改为如下代码：

```c
#ifndef APP_TEST_H
#define APP_TEST_H

/***********************************************************************************************************************
 * Includes
 **********************************************************************************************************************/
#include "hal_data.h"

/**********************************************************************************************************************
 * Macro definitions
 **********************************************************************************************************************/

/**********************************************************************************************************************
 * Typedef definitions
 **********************************************************************************************************************/

/***********************************************************************************************************************
 * Exported global variables
 **********************************************************************************************************************/

/***********************************************************************************************************************
 * Exported global functions (to be accessed by other files)
 **********************************************************************************************************************/

void app_uart_test(void);

void app_i2c_touchpad_test(void);

void app_spi_display_test(void);

#endif /*APP_TEST_H*/
```

## 4.5 调用app

打开 `02_dshanmcu_ra6m5_spi_display\src\hal_entry.c` ，按照如下步骤进行修改：

将 `hal_entry` 函数修改为如下所示的代码：

```c
void hal_entry(void)
{
    /* TODO: add your own code here */
    //app_uart_test();
    //app_i2c_touchpad_test();
    app_spi_display_test();

#if BSP_TZ_SECURE_BUILD
    /* Enter non-secure code */
    R_BSP_NonSecureEnter();
#endif
}
```

## 4.6 验证效果

点击编译按钮，再点击 debug 按钮，将程序烧写到开发板中。会看到屏幕依次循环刷红、绿、蓝三种颜色。

## 【拓展】为什么要交换RGB565颜色数据两个字节的顺序

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter4-2/chapter4-2_0019.png)

