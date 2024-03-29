# 3. 驱动I2C触摸屏(v1.2硬件)

本次实验我们在上一次实验的基础上驱动I2C触摸屏。从这次实验开始，我们不需要重新创建工程，而是在上一次实验项目的基础添加新的功能。

上次实验我们已经能通过使用 printf 函数打印输出信息，这次实验我们的目标是当触摸屏被按下时，打印当前被按下的触摸点的坐标信息(x, y)。

> 每个实验都是在原有的基础上添加更多的功能，因此请确保每次实验都完成并得到预期的效果。

## 3.1 复制工程

上次实验得出的工程我们可以通过复制在原有的基础上得到一个新的工程，操作步骤：

1. 复制工程：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_001.png)



2. 粘贴工程

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_002.png)

3. 复制确认窗口中，重命名项目为 `01_dshanmcu_ra6m5_i2c_touchpad`，点击 **copy** 按钮：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_003.png)

4. 得到重命名后的独立项目

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_004.png)

5. 为了后续开发的方便(避免混淆)，将之前的项目关闭：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_005.png)

6. 关闭后的项目可以随时打开进行操作：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_006.png)

## 3.2 配置FSP

### 3.2.1 查看硬件资料

1. 打开位于 `03硬件资料\1_开发板原理图\ DshanMCU_RA6M5_V4.0.pdf` 的开发板原理图，确认使用哪一个I2C，电路图如下，引脚号是 **P409 (SDA2) ** 和 **P410(SCL2) **，它使用 **SDA2/SCL2** ，记住这个编号 **2**，接下来我们根据这个信息对 r_iic_master 进行配置。

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_007.png)

2. 打开位于 `4_模块资料FT5x06触控芯片手册.pdf` 的触摸屏数据手册，跳转到如下位置：

FT5X06是电容触摸IC,地址为0x38,寄存器地址为1字节,以下波型为读坐标时的波型,从寄存器0x05开始读.
时钟线SCL,数据线SDL.

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_008.png)

I2C协议相关点:

1. 总线空闲为高电平
2. 为高时数据线不能变化start信号
3. 时钟为高,数据线从高到低stop信号
4. 时钟为高,数据线从低到高

我们选择使用 **0x70** 也就是 **0x38** 的地址进行通信(我们使用的地址模式是7-bit，因此剔除最低一位，也就是将0x70右移一位的到0x38)。那么在使用iic进行通信之前，需要操作FT5X06的Reset引脚（P403）和INT引脚（P408），设置（告知）FT5X06我们想使用的通信地址。

> (参考阅读 “1_用户手册\ARM嵌入式系统中面向对象的模块编程方法.pdf” 6.13 I2C协议章节)

### 3.2.2 添加 Stacks(r_iic_master)

1. 打开 FSP Configuration 视图：双击项目文件夹中的 `configuration.xml` 文件。
2. 按照下图所示，添加 `r_sci_uart` 模块：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_009.png)

1. 点击刚刚添加的

   ```
   r_iic_master
   ```

    

   在底部窗口的

    

   ```
   Properties
   ```

    

   选项卡中对其进行配置，将其配置为与下图一致：

   - Name： g_i2c_master2
   - Channel： 2
   - Slave Address： 0x38
   - Callback： i2c_master2_callback



[#](https://renesas-docs.100ask.net/zh/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3.html#_3-2-3-配置-reset-和int引脚)1.2.3 配置 Reset 和INT引脚

这2个引脚，在上面的原理图中有标注，分别是：

- Reset引脚 (P403)
- INT引脚 (P408)

根据上面找到的数据手册的描述，在FSP对其进行配置：

1. 按下图所示操作，打开配置IO引脚页面：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_0010.png)

2. 按下图所示操作，配置Reset引脚(P403)

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_0011.png)

3. 按下图所示操作，配置INT引脚(P408)

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_0012.png)

最后，检查确认无误，点击右上角的 `“Generate Project Content”` e2studio就会根据我们对FSP的配置自动配置项目、生成相应的代码。

## 3.3 编写触摸屏驱动代码

在e2studio中打开 `01_dshanmcu_ra6m5_i2c_touchpad\dshanmcu_ra6m5\drivers` 目录，新建如下两个文件 `drv_i2c_touchpad.c` 和 `drv_i2c_touchpad.h`：



> 如果你不清楚怎么在e2studio中创建文件，请参考阅读上一节实验中新建文件的说明教程。

也可以直接在windows资源管理器中找到对应的目录添加文件或目录，这样添加的文件或目录也会自动同步在e2studio的项目列表中

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_0013.png)

在e2studio中点击打开 `01_dshanmcu_ra6m5_i2c_touchpad\dshanmcu_ra6m5\drivers\drv_i2c_touchpad.c` 添加下面的代码：

```c
#include "drv_gt911.h"
#include "hal_data.h"

#include "drv_touch.h"
#include <stdio.h>
#include <stdlib.h> 

static void I2C2WaitTxCplt(void);
static void I2C2WaitRxCplt(void);

static void FT5x06DrvWriteReg(uint16_t reg, uint8_t *buf, uint8_t len);
static void FT5x06DrvReadReg(uint16_t reg, uint8_t *buf, uint8_t len);
static void FT5x06DrvSoftReset(void);
static uint32_t FT5x06DrvReadProductID(void);
static uint32_t FT5x06DrvReadVendorID(void);
static void FT5x06DrvClearBuf(void);
static uint8_t FT5x06DrvReadVersion(void);
static uint8_t FT5x06DrvGetGSTID(void);
static void FT5x06DrvSetRotation(TouchDrv_t *tp, TouchRotation_t rot);
static bool FT5x06DrvIsTouched(TouchDrv_t * tp);

static void FT5x06DrvInit(struct TouchDev *ptDev);
static bool FT5x06DrvRead(struct TouchDev *ptDev, unsigned short *pX, unsigned short *pY);

static struct TouchDev gTouchDev = {
                                    .name = "FT5x06",
                                    .Init = FT5x06DrvInit,
                                    .Read = FT5x06DrvRead
};

static struct TouchDrv gTP;

static volatile bool gI2C2TxCplt = false;
static volatile bool gI2C2RxCplt = false;

struct TouchDev* TouchDevGet(void)
{
    return &gTouchDev;
}

void i2c_master2_callback(i2c_master_callback_args_t * p_args)
{
    switch (p_args->event)
    {
        case I2C_MASTER_EVENT_TX_COMPLETE:
        {
            gI2C2TxCplt = true;
            break;
        }
        case I2C_MASTER_EVENT_RX_COMPLETE:
        {
            gI2C2RxCplt = true;
            break;
        }
        default:
        {
            gI2C2TxCplt = gI2C2RxCplt = false;
            break;
        }
    }
}

static void I2C2WaitTxCplt(void)
{
    uint16_t wTimeOut = 100;
    while(!gI2C2TxCplt && wTimeOut)
    {
        R_BSP_SoftwareDelay(1, BSP_DELAY_UNITS_MILLISECONDS);
        wTimeOut--;
    }
    gI2C2TxCplt = false;
}

static void I2C2WaitRxCplt(void)
{
    uint16_t wTimeOut = 100;
    while(!gI2C2RxCplt && wTimeOut)
    {
        R_BSP_SoftwareDelay(1, BSP_DELAY_UNITS_MILLISECONDS);
        wTimeOut--;
    }
    gI2C2RxCplt = false;
}

static void FT5x06DrvWriteReg(uint16_t reg, uint8_t *buf, uint8_t len)
{
    uint8_t regl = (uint8_t)(reg & 0xff);
    uint8_t regh = (uint8_t)(reg>>8);
    uint8_t * write_package = (uint8_t*)malloc((len + 2) * sizeof(uint8_t));
    memcpy(write_package, &regh, 1);
    memcpy(write_package + 1, &regl, 1);
    memcpy(write_package + 2, buf, len);

    fsp_err_t err = g_i2c_master2.p_api->write(g_i2c_master2.p_ctrl, write_package, len + 2, 0);
    if (FSP_SUCCESS != err)
    {
        //printf("%s %d\r\n", __FUNCTION__, __LINE__);
        return;
    }
    I2C2WaitTxCplt();

    free(write_package);
}

static void FT5x06DrvReadReg(uint16_t reg, uint8_t *buf, uint8_t len)
{
    uint8_t tmpbuf[2];

    tmpbuf[0] = (uint8_t)reg;

    fsp_err_t err = g_i2c_master2.p_api->write(g_i2c_master2.p_ctrl, tmpbuf, 1, 0);
    if (FSP_SUCCESS != err)
    {
        //printf("%s %d\r\n", __FUNCTION__, __LINE__);
        return;
    }
    I2C2WaitTxCplt();

    err = g_i2c_master2.p_api->read(g_i2c_master2.p_ctrl, buf, len, 0);
    if (FSP_SUCCESS != err)
    {
        //printf("%s %d\r\n", __FUNCTION__, __LINE__);
        return;
    }
    I2C2WaitRxCplt();
}



static uint32_t FT5x06DrvReadVendorID(void)
{
    uint32_t id = 0;
    FT5x06DrvReadReg(0xa3, (uint8_t*)&id ,1);
    return id;
}

/* GT9XX可以选择2个I2C地址:0x5d 或 x14
 * rst信号从低到高变化: int信号是0则使用地址0x5d, 是1则使用地址0x14,
 * 在这之后再把int信号设置为中断引脚
 */
static void FT5x06DrvInit(struct TouchDev *ptDev)
{
    int i;
    
    if(NULL == ptDev->name) return;
   gTP.ucAddr = (uint8_t)g_i2c_master2.p_cfg->slave;
    gTP.tRotation = TP_ROT_NONE;

    /* 复位 */
    g_ioport.p_api->pinWrite(g_ioport.p_ctrl,
                             BSP_IO_PORT_04_PIN_03,
                             BSP_IO_LEVEL_LOW);
    R_BSP_SoftwareDelay(10, BSP_DELAY_UNITS_MILLISECONDS);

    g_ioport.p_api->pinWrite(g_ioport.p_ctrl,
                             BSP_IO_PORT_04_PIN_03,
                             BSP_IO_LEVEL_HIGH);
    R_BSP_SoftwareDelay(100, BSP_DELAY_UNITS_MILLISECONDS);

    g_ioport.p_api->pinCfg(g_ioport.p_ctrl,
                             BSP_IO_PORT_04_PIN_08,
                             IOPORT_CFG_PORT_DIRECTION_INPUT);
    /* 初始化I2C驱动 */
    fsp_err_t err = g_i2c_master2.p_api->open(g_i2c_master2.p_ctrl, g_i2c_master2.p_cfg);
    if (FSP_SUCCESS != err)
    {
        //printf("%s %d\r\n", __FUNCTION__, __LINE__);
        return;
    }
	
	//g_i2c_master2.p_api->slaveAddressSet(g_i2c_master2.p_ctrl,0x5D, I2C_MASTER_ADDR_MODE_7BIT);

    /* 读ID */
    for (i = 0; i < 100; i++)
    {
        uint32_t nVendorID = 0;
    	nVendorID = FT5x06DrvReadVendorID();
        if((nVendorID==0x06)||(nVendorID==0x36)||(nVendorID== 0x64))
        {
            //printf("ft5x06 read vendor id %d times: 0x%.4x\r\n", i, (int)nVendorID);
		 	return;
        }
    }

    //printf("ft5x06 vendor id err\r\n");

}

//read touch point information
static bool FT5x06DrvRead(struct TouchDev *ptDev, unsigned short *pX, unsigned short *pY)
{
#define CFG_MAX_TOUCH_POINTS  5
#define CFG_POINT_READ_BUF  (3 + 6 * (CFG_MAX_TOUCH_POINTS))

    unsigned short tmp_p;
    uint8_t buf[CFG_POINT_READ_BUF] = {0};
    int ret = -1;
    int i;
    int touch_point;    

    FT5x06DrvReadReg(0, buf, CFG_POINT_READ_BUF);

    ////printf("touch point = %d\n\r", buf[2]);
    touch_point = buf[2]; 
    if (!touch_point)        
        return false;


#if 0
    for (i = 0; i < event->touch_point; i++)
    {
        event->au16_x[i] = (s16)(buf[3 + 6*i] & 0x0F)<<8 | (s16)buf[4 + 6*i];
        event->au16_y[i] = (s16)(buf[5 + 6*i] & 0x0F)<<8 | (s16)buf[6 + 6*i];
        event->auint8_t_touch_event[i] = buf[0x3 + 6*i] >> 6;
        event->auint8_t_finger_id[i] = (buf[5 + 6*i])>>4;
        //printk("%d, %d\n", event->au16_x[i], event->au16_y[i]);
    }
#endif
    *pX = (uint16_t)(buf[3 + 6*0] & 0x0F)<<8 | (uint16_t)buf[4 + 6*0];
    *pY = (uint16_t)(buf[5 + 6*0] & 0x0F)<<8 | (uint16_t)buf[6 + 6*0];

    //*pX = (uint16_t)(buf[3 + 6*0] & 0x0F)<<8;
    //*pY = (uint16_t)(buf[5 + 6*0] & 0x0F)<<8;

    //旋转方向
    uint16_t temp;
    switch (TP_ROT_90)
    {
        case TP_ROT_NONE:
            break;
        case TP_ROT_270:
            temp = *pX;
            *pX = 320 - *pY;
            *pY = temp;
            break;
        case TP_ROT_180:
            temp = *pY;
            *pY = *pX;
            *pX = temp;
            break;
        case TP_ROT_90:
            temp = *pY;
            *pY = *pX;
            *pX = 480 - temp;
            break;
        default:
            break;
    }

    return true;    
}

```

在e2studio中点击打开 `01_dshanmcu_ra6m5_i2c_touchpad\dshanmcu_ra6m5\drivers\drv_i2c_touchpad.h` 添加下面的代码：

```c
#ifndef DRV_I2C_TOUCHPAD_H
#define DRV_I2C_TOUCHPAD_H

/***********************************************************************************************************************
 * Includes
 **********************************************************************************************************************/
#include "hal_data.h"
#include <stdio.h>

/**********************************************************************************************************************
 * Macro definitions
 **********************************************************************************************************************/
#define TOUCH_POINT_TOTAL           (5)     /* 此芯片最多支持五点触控 */

/**********************************************************************************************************************
 * Typedef definitions
 **********************************************************************************************************************/
typedef enum
{
    TP_ROT_NONE = 0,
    TP_ROT_90,
    TP_ROT_180,
    TP_ROT_270
} tp_rotation_t;

/**用于存放每一个触控点的id，坐标，大小**/
typedef struct TouchPointInfo{
    unsigned char id;
    unsigned short x;
    unsigned short y;
    unsigned short size;
}TouchPointInfo_t;

/**类结构体**/
typedef struct TouchDrv{
    unsigned char  ucAddr;
    unsigned short wHeight;
    unsigned short wWidth;
    TouchRotation_t tRotation;
    TouchPointInfo_t tPointsInfo[TOUCH_POINT_TOTAL]; //用于存储五个触控点的坐标
}TouchDrv_t;

typedef struct TouchDev{
    char *name;
    void (*Init)(struct TouchDev *ptDev);
    bool (*Read)(struct TouchDev *ptDev, unsigned short *pX, unsigned short *pY);
}TouchDev, *PTouchDev;

/***********************************************************************************************************************
 * Exported global variables
 **********************************************************************************************************************/

/***********************************************************************************************************************
 * Exported global functions (to be accessed by other files)
 **********************************************************************************************************************/

struct TouchDev* TouchDevGet(void);

#endif /*DRV_I2C_TOUCHPAD_H*/
```

## 3.4 编写app

在 `01_dshanmcu_ra6m5_i2c_touchpad\dshanmcu_ra6m5\applications` 目录下新建两个 `app_i2c_touchpad_test.c` 文件，如下图所示：

![](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter3-2/chapter3-2_0014.png)

打开 `app_i2c_touchpad_test.c` 添加如下代码：

```c
/***********************************************************************************************************************
 * Includes
 **********************************************************************************************************************/
#include "app.h"
#include "drv_uart.h"
#include "drv_i2c_touchpad.h"
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
static fsp_err_t i2c_touchpad_read(void);

/***********************************************************************************************************************
 * Private global variables
 **********************************************************************************************************************/

/***********************************************************************************************************************
 * Functions
 **********************************************************************************************************************/

void app_i2c_touchpad_test(void)
{
    TouchDev *ptDev = TouchDevGet();
    if(NULL == ptDev)
    {
        printf("Error. Not Found Touch Device!\r\n");
        return;
    }
    ptDev->Init(ptDev);
    uint16_t x = 0, y = 0;
    while(1)
    {
        if(ptDev->Read(ptDev, &x, &y) == true)
        {
            printf("Touch-Position: (%d,%d)\r\n", x, y);
        }
        else
            printf("not touch\n\r");
    }
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

#endif /*APP_TEST_H*/
```

## 3.5 调用app

打开 `01_dshanmcu_ra6m5_i2c_touchpad\src\hal_entry.c` ，按照如下步骤进行修改：

将 `hal_entry` 函数修改为如下所示的代码：

```c
void hal_entry(void)
{
    /* TODO: add your own code here */
    //app_uart_test();
    app_i2c_touchpad_test();

#if BSP_TZ_SECURE_BUILD
    /* Enter non-secure code */
    R_BSP_NonSecureEnter();
#endif
}
```

## 3.6 验证效果

点击编译按钮，再点击 debug 按钮，将程序烧写到开发板中。打开串口工具，在e2stduio点击运行代码，会看到串口工具有信息输出，此时触摸屏幕会将所有触摸点的数值打印出来，串口输出现象：

```c
Touch-Position:(x,x)
Touch-Position:(x,x)
Touch-Position:(x,x)
Touch-Position:(x,x)
或
not touch
not touch
not touch
not touch
```

