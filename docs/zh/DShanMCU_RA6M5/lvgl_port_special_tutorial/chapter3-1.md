# 3. 驱动I2C触摸屏(v1.1硬件)

本次实验我们在上一次实验的基础上驱动I2C触摸屏。从这次实验开始，我们不需要重新创建工程，而是在上一次实验项目的基础添加新的功能。

上次实验我们已经能通过使用 printf 函数打印输出信息，这次实验我们的目标是当触摸屏被按下时，打印当前被按下的触摸点的坐标信息(x, y)。

> 每个实验都是在原有的基础上添加更多的功能，因此请确保每次实验都完成并得到预期的效果。

## 3.1 复制工程

上次实验得出的工程我们可以通过复制在原有的基础上得到一个新的工程，操作步骤：

1. 复制工程：

<img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_001.png" alt="chapter-3_001" style="zoom:67%;" />

2. 粘贴工程

<img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_002.png" alt="chapter-3_002" style="zoom:67%;" />

3. 复制确认窗口中，重命名项目为 `01_dshanmcu_ra6m5_i2c_touchpad`，点击 **copy** 按钮：

<img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_003.png" alt="chapter-3_003" style="zoom:67%;" />

4. 得到重命名后的独立项目

<img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_004.png" alt="chapter-3_004" style="zoom:80%;" />

5. 为了后续开发的方便(避免混淆)，将之前的项目关闭：

<img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_005.png" alt="chapter-3_005" style="zoom:67%;" />

6. 关闭后的项目可以随时打开进行操作：

<img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_006.png" alt="chapter-3_006" style="zoom:67%;" />


## 3.2 配置FSP

### 3.2.1 查看硬件资料

1. 打开位于 `03硬件资料\1_开发板原理图\ DshanMCU_RA6M5_V4.0.pdf` 的开发板原理图，确认使用哪一个I2C，电路图如下，引脚号是 **P409 (SDA2) ** 和 **P410(SCL2) **，它使用 **SDA2/SCL2** ，记住这个编号 **2**，接下来我们根据这个信息对 r_iic_master 进行配置。

<img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_007.png" alt="chapter-3_007" style="zoom:80%;" />

2.  打开位于 `4_模块资料\02_GT911触控芯片手册\GT911 DataSheet Rev11.pdf` 的触摸屏数据手册，跳转到如下位置：

![chapter-3_007-1](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_007-1.png)

我们选择使用 **0x28** 也就是 **0x14** 的地址进行通信(我们使用的地址模式是7-bit，因此剔除最低一位，也就是将0x28右移一位的到0x14)。那么在使用iic进行通信之前，需要操作GT911的Reset引脚（P403）和INT引脚（P408），设置（告知）GT911我们想使用的通信地址。

> (参考阅读 “1_用户手册\ARM嵌入式系统中面向对象的模块编程方法.pdf” 6.13 I2C协议章节)

### 3.2.2 添加 Stacks(r_iic_master)
1. 打开 FSP Configuration 视图：双击项目文件夹中的  `configuration.xml` 文件。
2. 按照下图所示，添加  `r_sci_uart` 模块：

<img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_008.png" alt="chapter-3_008" style="zoom: 67%;" />

3. 点击刚刚添加的`r_iic_master` 在底部窗口的 `Properties` 选项卡中对其进行配置，将其配置为与下图一致：
   - Name： g_i2c_master2
   - Channel： 2
   - Slave Address： 0x14
   - Callback： i2c_master2_callback 

<img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_009.png" alt="chapter-3_009" style="zoom: 80%;" />



### 3.2.3 配置 Reset 和INT引脚

这2个引脚，在上面的原理图中有标注，分别是：

- Reset引脚 (P403)
- INT引脚     (P408)

根据上面找到的数据手册的描述，在FSP对其进行配置：

1. 按下图所示操作，打开配置IO引脚页面：

<img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_009-1.png" alt="chapter-3_009-1" style="zoom:80%;" />

2. 按下图所示操作，配置Reset引脚(P403)

<img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_009-2.png" alt="chapter-3_009-2" style="zoom: 80%;" />

3. 按下图所示操作，配置INT引脚(P408)

<img src="http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_009-3.png" alt="chapter-3_009-3" style="zoom:80%;" />

最后，检查确认无误，点击右上角的 `“Generate Project Content”` e2studio就会根据我们对FSP的配置自动配置项目、生成相应的代码。


## 3.3 编写触摸屏驱动代码

在e2studio中打开 `01_dshanmcu_ra6m5_i2c_touchpad\dshanmcu_ra6m5\drivers` 目录，新建如下两个文件 `drv_i2c_touchpad.c` 和 `drv_i2c_touchpad.h`：

![chapter-3_010](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_010.png)

> 如果你不清楚怎么在e2studio中创建文件，请参考阅读上一节实验中新建文件的说明教程。

也可以直接在windows资源管理器中找到对应的目录添加文件或目录，这样添加的文件或目录也会自动同步在e2studio的项目列表中

![chapter-3_011](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_011.png)

在e2studio中点击打开 `01_dshanmcu_ra6m5_i2c_touchpad\dshanmcu_ra6m5\drivers\drv_i2c_touchpad.c` 添加下面的代码：

```c
/***********************************************************************************************************************
 * Includes
 **********************************************************************************************************************/
#include "drv_i2c_touchpad.h"
#include <stdlib.h>

/**********************************************************************************************************************
 * Macro definitions
 **********************************************************************************************************************/
#define GT911_RESET_PIN             BSP_IO_PORT_04_PIN_03
#define GT911_INT_PIN               BSP_IO_PORT_04_PIN_08

//GT911 部分寄存器定义
#define GT_CTRL_REG                 0x8040  //GT911控制寄存器
#define GT_CFGS_REG                 0x8047  //GT911配置起始地址寄存器
#define GT_CHECK_REG                0x80FF  //GT911校验和寄存器
#define GT_PID_REG                  0x8140  //GT911产品ID寄存器

#define GT_GSTID_REG                0x814E  //GT911当前检测到的触摸情况
#define GT_TP1_REG                  0x814F  //第一个触摸点数据地址
#define GT_TP2_REG                  0x8157  //第二个触摸点数据地址
#define GT_TP3_REG                  0x815F  //第三个触摸点数据地址
#define GT_TP4_REG                  0x8167  //第四个触摸点数据地址
#define GT_TP5_REG                  0x816F  //第五个触摸点数据地址

#define GT911_READ_X_MAX_REG        0x8048  /* X输出最大值 */
#define GT911_READ_Y_MAX_REG        0x804a  /* X输出最大值 */

#define GT911_READ_XY_REG           0x814E  /* 坐标寄存器 */
#define GT911_CLEARBUF_REG          0x814E  /* 清除坐标寄存器 */
#define GT911_CONFIG_REG            0x8047  /* 配置参数寄存器 */
#define GT911_COMMAND_REG           0x8040  /* 实时命令 */
#define GT911_PRODUCT_ID_REG        0x8140  /* productid */
#define GT911_VENDOR_ID_REG         0x814A  /* 当前模组选项信息 */
#define GT911_CONFIG_VERSION_REG    0x8047  /* 配置文件版本号 */
#define GT911_CONFIG_CHECKSUM_REG   0x80FF  /* 配置文件校验码 */
#define GT911_FIRMWARE_VERSION_REG  0x8144  /* 固件版本号 */

/**********************************************************************************************************************
 * Typedef definitions
 **********************************************************************************************************************/

/**用于存放每一个触控点的id，坐标，大小**/
typedef struct
{
    uint8_t id;
    uint16_t x;
    uint16_t y;
    uint16_t size;
} tp_point_info_t;

/**类结构体**/
typedef struct
{
    uint8_t tp_dev_addr;
    uint16_t height;
    uint16_t width;
    tp_rotation_t rotation;
    tp_point_info_t points_info[TOUCH_POINT_TOTAL]; //用于存储五个触控点的坐标
} tp_drv_t;

/***********************************************************************************************************************
 * Private function prototypes
 **********************************************************************************************************************/
static void i2c2_wait_for_tx(void);
static void i2c2_wait_for_rx(void);

static fsp_err_t gt911_write_reg(uint16_t reg, uint8_t *buf, uint8_t len);
static fsp_err_t gt911_read_reg(uint16_t reg, uint8_t *buf, uint8_t len);
static void gt911_clear_buf();
static void gt911_soft_reset(void);
static void gt911_get_gstid(uint8_t *buf);
static void gt911_get_version(uint8_t *buf);
static void gt911_get_vendor_id(uint8_t *buf);
static void gt911_get_product_id(uint8_t *buf);
static void gt911_get_max_x(uint8_t *buf);
static void gt911_get_max_y(uint8_t *buf);

/***********************************************************************************************************************
 * Private global variables
 **********************************************************************************************************************/
static tp_drv_t g_tp_drv;

static volatile bool g_i2c2_tx_complete = false;
static volatile bool g_i2c2_rx_complete = false;

/***********************************************************************************************************************
 * Functions
 **********************************************************************************************************************/

fsp_err_t drv_i2c_touchpad_init(void)
{
    fsp_err_t err;
    uint8_t buf[4];

    /* 初始化I2C驱动 */
    err = g_i2c_master2.p_api->open (g_i2c_master2.p_ctrl, g_i2c_master2.p_cfg);
    if (FSP_SUCCESS != err)
    {
        printf ("%s %d\r\n", __FUNCTION__, __LINE__);
        return err;
    }

    /* 选择地址 */
    // 0x14
    g_ioport.p_api->pinWrite (g_ioport.p_ctrl, GT911_RESET_PIN, BSP_IO_LEVEL_LOW);
    g_ioport.p_api->pinWrite (g_ioport.p_ctrl, GT911_INT_PIN, BSP_IO_LEVEL_HIGH);
    R_BSP_SoftwareDelay (10, BSP_DELAY_UNITS_MILLISECONDS);

    g_ioport.p_api->pinWrite (g_ioport.p_ctrl, GT911_RESET_PIN, BSP_IO_LEVEL_HIGH);
    R_BSP_SoftwareDelay (100, BSP_DELAY_UNITS_MILLISECONDS);

    g_ioport.p_api->pinCfg (g_ioport.p_ctrl, GT911_INT_PIN, IOPORT_CFG_PORT_DIRECTION_INPUT);
    R_BSP_SoftwareDelay (100, BSP_DELAY_UNITS_MILLISECONDS);

    touchpad_set_rotation (TP_ROT_NONE);

    /* 读ID */
    // 厂商标识id
    gt911_get_vendor_id (buf);
    printf ("gt911 vendor id = %02x %02x %02x %02x\r\n", buf[0], buf[1], buf[2], buf[3]);

    // 产品id
    gt911_get_product_id (buf);
    printf ("gt911 product id = %02x %02x %02x %02x\r\n", buf[0], buf[1], buf[2], buf[3]);

    // 触摸芯片固件版本
    gt911_get_version (buf);
    printf ("version = 0x%x\r\n", buf[0]);

    gt911_get_max_x (buf);
    g_tp_drv.width = (uint16_t) ((buf[1] << 8) | buf[0]);
    printf ("touchpad max x = %d\r\n", g_tp_drv.width);

    gt911_get_max_y (buf);
    g_tp_drv.height = (uint16_t) ((buf[1] << 8) | buf[0]);
    printf ("touchpad max y = %d\r\n", g_tp_drv.height);

    return err;
}

fsp_err_t touchpad_is_touched(void)
{
    uint8_t touched_state, touch_num, buffer_status;

    gt911_get_gstid (&touched_state);
    touch_num = touched_state & 0xf;            //触点数量
    buffer_status = (touched_state >> 7) & 1;   // 帧状态
    //printf("touch_num: %d\r\n", touch_num);

    if (buffer_status == 1 && (touch_num <= TOUCH_POINT_TOTAL) && (touch_num > 0))
    {
        uint16_t pointers_regs[TOUCH_POINT_TOTAL] =
        { GT_TP1_REG, GT_TP2_REG, GT_TP3_REG, GT_TP4_REG, GT_TP5_REG };
        // 获取每个触控点的坐标值并保存
        for (int i = 0; i < touch_num; ++i)
        {
            uint8_t point_info_per_size = 7;
            uint8_t *point_info_p = malloc (point_info_per_size * sizeof(uint8_t ));
            gt911_read_reg (pointers_regs[i], point_info_p, point_info_per_size);

            g_tp_drv.points_info[i].id = point_info_p[0];
            g_tp_drv.points_info[i].x = (uint16_t) (point_info_p[1] + (point_info_p[2] << 8));
            g_tp_drv.points_info[i].y = (uint16_t) (point_info_p[3] + (point_info_p[4] << 8));
            g_tp_drv.points_info[i].size = (uint16_t) (point_info_p[5] + (point_info_p[6] << 8));

            free (point_info_p);

            //旋转方向
            uint16_t temp;
            switch (g_tp_drv.rotation)
            {
                case TP_ROT_NONE:
                    g_tp_drv.points_info[i].x = g_tp_drv.width - g_tp_drv.points_info[i].x;
                    g_tp_drv.points_info[i].y = g_tp_drv.height - g_tp_drv.points_info[i].y;
                break;
                case TP_ROT_270:
                    temp = g_tp_drv.points_info[i].x;
                    g_tp_drv.points_info[i].x = g_tp_drv.width - g_tp_drv.points_info[i].y;
                    g_tp_drv.points_info[i].y = temp;
                break;
                case TP_ROT_180:
                    //g_tp_drv.points_info[i].x = g_tp_drv.points_info[i].x;
                    //g_tp_drv.points_info[i].y = g_tp_drv.points_info[i].y;
                break;
                case TP_ROT_90:
                    temp = g_tp_drv.points_info[i].x;
                    g_tp_drv.points_info[i].x = g_tp_drv.points_info[i].y;
                    g_tp_drv.points_info[i].y = g_tp_drv.height - temp;
                break;
                default:
                break;
            }
        }
        gt911_clear_buf ();
        return FSP_SUCCESS;
    }
    //必须给GT911_POINT_INFO缓冲区置0,不然读取的数据一直为128！！！！
    gt911_clear_buf ();

    return FSP_ERR_INVALID_DATA;
}

void touchpad_set_rotation(tp_rotation_t rotation)
{
    g_tp_drv.rotation = rotation;
}

void touchpad_get_pos(uint16_t *x, uint16_t *y, int index)
{
    *x = g_tp_drv.points_info[index].x;
    *y = g_tp_drv.points_info[index].y;
}

void i2c_master2_callback(i2c_master_callback_args_t *p_args)
{
    switch (p_args->event)
    {
        case I2C_MASTER_EVENT_TX_COMPLETE:
        {
            g_i2c2_tx_complete = true;
            break;
        }
        case I2C_MASTER_EVENT_RX_COMPLETE:
        {
            g_i2c2_rx_complete = true;
            break;
        }
        default:
        {
            g_i2c2_tx_complete = g_i2c2_rx_complete = false;
            break;
        }
    }
}

/***********************************************************************************************************************
 * Private Functions
 **********************************************************************************************************************/
static void i2c2_wait_for_tx(void)
{
    while (!g_i2c2_tx_complete)
        ;
    g_i2c2_tx_complete = 0;
}

static void i2c2_wait_for_rx(void)
{
    while (!g_i2c2_rx_complete)
        ;
    g_i2c2_rx_complete = 0;
}

static void gt911_soft_reset(void)
{
    uint8_t buf[1];
    buf[0] = 0x02;
    gt911_write_reg (GT911_COMMAND_REG, (uint8_t*) buf, 1);
    R_BSP_SoftwareDelay (100, BSP_DELAY_UNITS_MILLISECONDS);
    buf[0] = 0x0;
    gt911_write_reg (GT911_COMMAND_REG, (uint8_t*) buf, 1);
    R_BSP_SoftwareDelay (100, BSP_DELAY_UNITS_MILLISECONDS);
}

static void gt911_clear_buf()
{
    uint8_t buf[1] =
    { 0 };
    gt911_write_reg (GT911_CLEARBUF_REG, buf, 1);
}

static fsp_err_t gt911_write_reg(uint16_t reg, uint8_t *buf, uint8_t len)
{
    fsp_err_t err;

    uint8_t regl = (uint8_t) (reg & 0xff);
    uint8_t regh = (uint8_t) (reg >> 8);
    uint8_t *write_package = malloc ((len + 2) * sizeof(uint8_t));
    memcpy (write_package, &regh, 1);
    memcpy (write_package + 1, &regl, 1);
    memcpy (write_package + 2, buf, len);

    err = g_i2c_master2.p_api->write (g_i2c_master2.p_ctrl, write_package, len + 2, 0);

    i2c2_wait_for_tx ();
    free (write_package);
    return err;
}

static fsp_err_t gt911_read_reg(uint16_t reg, uint8_t *buf, uint8_t len)
{
    fsp_err_t err;
    uint8_t tmpbuf[2];

    tmpbuf[0] = (uint8_t) (reg >> 8);
    tmpbuf[1] = (uint8_t) (reg & 0xff);

    err = g_i2c_master2.p_api->write (g_i2c_master2.p_ctrl, tmpbuf, 2, 0);

    i2c2_wait_for_tx ();

    err = g_i2c_master2.p_api->read (g_i2c_master2.p_ctrl, buf, len, 0);

    i2c2_wait_for_rx ();

    return err;
}

static void gt911_get_max_x(uint8_t *buf)
{
    gt911_read_reg (GT911_READ_X_MAX_REG, buf, 2);
}

static void gt911_get_max_y(uint8_t *buf)
{
    gt911_read_reg (GT911_READ_Y_MAX_REG, buf, 2);
}

static void gt911_get_product_id(uint8_t *buf)
{
    gt911_read_reg (GT911_PRODUCT_ID_REG, buf, 4);
}

static void gt911_get_vendor_id(uint8_t *buf)
{
    gt911_read_reg (GT911_VENDOR_ID_REG, buf, 4);
}

static void gt911_get_version(uint8_t *buf)
{
    gt911_read_reg (GT911_CONFIG_VERSION_REG, buf, 1);
}

static void gt911_get_gstid(uint8_t *buf)
{
    gt911_read_reg (GT_GSTID_REG, buf, 1);
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

/***********************************************************************************************************************
 * Exported global variables
 **********************************************************************************************************************/

/***********************************************************************************************************************
 * Exported global functions (to be accessed by other files)
 **********************************************************************************************************************/

fsp_err_t drv_i2c_touchpad_init(void);

void touchpad_set_rotation(tp_rotation_t rotation);

fsp_err_t touchpad_is_touched(void);

void touchpad_get_pos(uint16_t *x, uint16_t *y, int index);

#endif /*DRV_I2C_TOUCHPAD_H*/

```

## 3.4 编写app

在 `01_dshanmcu_ra6m5_i2c_touchpad\dshanmcu_ra6m5\applications` 目录下新建两个 `app_i2c_touchpad_test.c` 文件，如下图所示：

![chapter-3_012](http://photos.100ask.net/renesas-docs/DShanMCU_RA6M5/lvgl_port_special_tutorial/chapter-3/chapter-3_012.png)

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
    fsp_err_t err;

    err = drv_uart_init();
    if(FSP_SUCCESS != err) __BKPT();

    err = drv_i2c_touchpad_init();
    if(FSP_SUCCESS != err) __BKPT();

    while (1)
    {
        i2c_touchpad_read();
    }
}

static fsp_err_t i2c_touchpad_read(void)
{
    fsp_err_t err;
    uint16_t x = 0, y = 0;

    err = touchpad_is_touched ();

    if (FSP_SUCCESS == err)
    {
        //循环读取每个触控点的位置值
        for (int i = 0; i < TOUCH_POINT_TOTAL; ++i)
        {
            touchpad_get_pos (&x, &y, i);
            printf ("No: %d, touched x: %d, touched y: %d\r\n", i, x, y);
        }
    }
    return err;
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

```shell
gt911 vendor id = 00 00 00 00
gt911 product id = 39 31 31 00
version = 0x7d
touchpad max x = 320
touchpad max y = 480
No: 0, touched x: 117, touched y: 447
No: 1, touched x: 0, touched y: 0
No: 2, touched x: 0, touched y: 0
No: 3, touched x: 0, touched y: 0
No: 4, touched x: 0, touched y: 0
No: 0, touched x: 117, touched y: 447
No: 1, touched x: 0, touched y: 0
No: 2, touched x: 0, touched y: 0
No: 3, touched x: 0, touched y: 0
No: 4, touched x: 0, touched y: 0
```


<center>本节完</center>

<div STYLE="page-break-after: always;"></div>
