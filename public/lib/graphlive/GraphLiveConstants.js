  /**
   * 绘图常量定义类
   *
   */
  var GraphliveConstants = {};
  /************************************** 预制图例形状定义 (形状见文档)开始 **************************************/
  GraphliveConstants.LT001 = "LT001";
  GraphliveConstants.LT002 = "LT002";
  GraphliveConstants.LT003 = "LT003";
  GraphliveConstants.LT004 = "LT004";
  GraphliveConstants.LT005 = "LT005";
  GraphliveConstants.LT006 = "LT006";
  GraphliveConstants.LT007 = "LT007";
  GraphliveConstants.LT008 = "LT008";
  GraphliveConstants.LT009 = "LT009";
  GraphliveConstants.LT010 = "LT010";
  GraphliveConstants.LT011 = "LT011";
  GraphliveConstants.LT012 = "LT012";
  GraphliveConstants.LT013 = "LT013";
  GraphliveConstants.LT014 = "LT014";
  GraphliveConstants.LT015 = "LT015";
  GraphliveConstants.LT016 = "LT016";
  GraphliveConstants.LT017 = "LT017";
  GraphliveConstants.LT018 = "LT018";
  GraphliveConstants.LT019 = "LT019";
  GraphliveConstants.LT020 = "LT020";
  GraphliveConstants.LT021 = "LT021";
  GraphliveConstants.LT022 = "LT022";
  GraphliveConstants.LT023 = "LT023";
  GraphliveConstants.LT024 = "LT024";
  GraphliveConstants.LT025 = "LT025";
  GraphliveConstants.LT026 = "LT026";
  GraphliveConstants.LT027 = "LT027";
  GraphliveConstants.LT028 = "LT028";
  GraphliveConstants.LT029 = "LT029";
  GraphliveConstants.LT030 = "LT030";
  GraphliveConstants.LT031 = "LT031";
  GraphliveConstants.LT032 = "LT032";
  GraphliveConstants.LT033 = "LT033";
  GraphliveConstants.LT034 = "LT034";
  GraphliveConstants.LT035 = "LT035";
  GraphliveConstants.LT036 = "LT036";
  GraphliveConstants.LT037 = "LT037";
  GraphliveConstants.LT038 = "LT038";
  GraphliveConstants.LT039 = "LT039";
  

  GraphliveConstants.CHAR = "CHAR";
  /************************************** 预制图例形状定义 结束 **************************************/

  /************************************** 预制序列形状定义 结束 **************************************/
  GraphliveConstants.ST001 = "ST001";//一般折线类序列
  GraphliveConstants.ST002 = "ST002";//存在首末端图例的直线自动前行/停止序列
  GraphliveConstants.ST003 = "ST003";//无首末端图例的直线自动前行/停止序列
  GraphliveConstants.ST004 = "ST004";//无首末端图例的wwww型自动前行/停止序列

  /************************************** 图例序列定义 开始 **************************************/

  /************************************** 图例类型定义 开始 **************************************/
  /** 收缩压 **/
  //GraphliveConstants.SBP = "SBP";
  /** 舒张压 **/
  //GraphliveConstants.DBP = "DBP";
  /** 脉搏 **/
  //GraphliveConstants.PULSE = "PULSE";
  /** 自主呼吸 **/
  //GraphliveConstants.SPONT = "SPONT";
  /** 机械通气 **/
  //GraphliveConstants.FMMV = "FMMV";
  /** 麻醉开始 **/
  //GraphliveConstants.AO = "AO";
  /** 手术置管 **/
  //GraphliveConstants.CATH = "cathetering";
  /** 手术拔管 **/
  //GraphliveConstants.EXTUB = "extubation";
  /** 手术开始 **/
  //GraphliveConstants.OPS = "OPS";
  /** 手术结束 **/
  //GraphliveConstants.OPE = "OPE";
  /** 体温 **/
  //GraphliveConstants.TP = "TP";
  /** 用药进度条 **/
  GraphliveConstants.GANTT = "GANTT";
  /** 脉搏氧饱和度图例 **/
  //GraphliveConstants.PULSEOS = "PULSEOS";
  /** 甘特序列静止端点图例 **/
  GraphliveConstants.GANTT_STOP = "GANTT_STOP";
  /** 甘特序列前进图例 **/
  GraphliveConstants.GANTT_RUN = "GANTT_RUN";
  /** 自动前进图例 **/
  GraphliveConstants.AUTO_RUN = "AUTO_RUN";
  /** 时间轴图例 **/
  GraphliveConstants.TIME_LINE = "TIME_LINE";

  /** 直线 **/
  GraphliveConstants.LINE = "LINE";
  /** 标注线 **/
  GraphliveConstants.MARK_LINE = "MARK_LINE";
  /** 矩形 **/
  GraphliveConstants.RECT = "RECT";
  /** 标签 **/
  GraphliveConstants.LABEL = "LABEL";

  /** 标签 **/
  GraphliveConstants.NO_LENGED = "NO_LENGED";

  /** 轴 **/
  GraphliveConstants.AXIS = "AXIS";

  /** 网格 **/
  GraphliveConstants.GRID = "GRID";
  /** 序列 **/
  GraphliveConstants.SERIES = "SERIES";

  /** 甘特序列 **/
  GraphliveConstants.GANTTSERIES = "GANTTSERIES";

  /** 图例 **/
  GraphliveConstants.LEGEND = "LEGEND";
  /** 辅助线 **/
  GraphliveConstants.GUIDE = "GUIDE";

  /** PACU入室 **/
  //GraphliveConstants.PACU_IN = "PACU_IN";
  /** PACU出室 **/
  //GraphliveConstants.PACU_OUT = "PACU_OUT";
  /** PACU平均动脉压 **/
  //GraphliveConstants.PACU_MAP = "PACU_MAP";
  /** PACU中心静脉压 **/
  //GraphliveConstants.PACU_CVP = "PACU_CVP";
  /** PACU麻醉相关药物 **/
  //GraphliveConstants.PACU_A = "PACU_A";
  /** PACU血液制品 **/
  //GraphliveConstants.PACU_B = "PACU_B";
  /** PACU其他用药 **/
  //GraphliveConstants.PACU_O = "PACU_O";
  /** PACU体液 **/
  //GraphliveConstants.PACU_F = "PACU_F";
  /** PACU置入喉罩 **/
  //GraphliveConstants.PACU_LMA_IN = "PACU_LMA_IN";
  /** PACU拔出喉罩 **/
  //GraphliveConstants.PACU_LMA_OUT = "PACU_LMA_OUT";
  /** PACU 深静脉置管**/
  //GraphliveConstants.PACU_DVC = "PACU_DVC";
  /** PACU动脉置管 **/
  //GraphliveConstants.PACU_ALB = "PACU_ALB";
  /** PACU气管插管 **/
  //GraphliveConstants.PACU_CATH = "PACU_CATH";
  /** PACU气管拔管 **/
  //GraphliveConstants.PACU_EXTUB = "PACU_EXTUB";
  /** 空心正三角 **/
  //GraphliveConstants.TRI = "TRI";
  /** 米字符 **/
  //GraphliveConstants.ICP = "ICP";
  /**    需求分析 **/
  //GraphliveConstants.BGA = "BGA";
  /** 心率 **/
  //GraphliveConstants.HR = "HR";


  /*************************************** 图例类型定义 结束 *************************************/

  /*************************************** 图例类型映射名字 序列上tip的显示，在此映射序列名和显示值开始 *************************************/
  /*
  GraphliveConstants.TYPE_NAME_MAPPING={
    *//** 收缩压 **//*
  "SBP" : "收缩压",
  
  "DBP" : "舒张压",
  
  "PULSE" : "脉搏",

  "SPONT" : "呼吸",
  
  "FMMV" : "机械通气",
  
  "AO" : "麻醉开始",
  
  "CATH" : "手术置管",
  
  "EXTUB" : "手术拔管",
  
  "OPS" : "手术开始",
  
  "OPE" : "手术结束",
  
  "TP" : "体温",
  
  "PACU_IN" : "入室",
  
  "PACU_OUT" : "出室",
  
  "PACU_MAP" : "平均动脉压",
  
  "PACU_CVP" : "中心静脉压",
  
  "PACU_A" : "麻醉相关药物",
  
  "PACU_B" : "血液制品",
  
  "PACU_O" : "其他用药",
  
  "PACU_F" : "体液",
  
  "PACU_LMA_IN" : "置入喉罩",
  
  "PACU_LMA_OUT" : "拔出喉罩",
  
  "PACU_DVC" : "深静脉置管",
  
  "PACU_ALB" : "动脉置管",
  
  "PACU_CATH" : "气管插管",
  
  "PACU_EXTUB" : "气管拔管",

   "HR" : "心率"
  };*/
  /*************************************** 图例类型映射名字 结束 *************************************/

  /*************************************** 特殊字符大小类别定义开始 *************************************/
  GraphliveConstants.CHAR_SIZE_15="①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿";
  /*************************************** 特殊字符大小类别定义结束 *************************************/

  /*************************************** 事件类型定义 开始 *************************************/
  /** 鼠标放置在物体上事件定义 **/
  GraphliveConstants.OVER = "OVER";
  /** 鼠标离开物体上事件定义 **/
  GraphliveConstants.OUT = "OUT";
  /** 双击事件定义 **/
  GraphliveConstants.DBLCLICK = "dblclick";
  /** 鼠标右键事件事件定义 **/
  GraphliveConstants.RIGHTCLICK = "rightclick";
  /** 鼠标放置图例上事件定义 **/
  GraphliveConstants.LEGEND_OVER = "LEGEND_OVER";
  /** 鼠标离开图例上事件定义 **/
  GraphliveConstants.LEGEND_OUT = "LEGEND_OUT";
  /** 鼠标在图例上按下事件定义 **/
  GraphliveConstants.LEGEND_DOWN = "LEGEND_DOWN";
  /** 鼠标在图例上释放事件定义 **/
  GraphliveConstants.LEGEND_UP = "LEGEND_UP";
  /** 鼠标在向导图例上释放事件定义 **/
  GraphliveConstants.GUIDE_UP = "GUIDE_UP";
  /** 图例在画布上移动事件定义 **/
  GraphliveConstants.LEGEND_MOVE = "LEGEND_MOVE";
  /** 移动类型的图例停止事件定义 **/
  GraphliveConstants.LEGEND_STOP = "LEGEND_STOP";
  /** 图例在画布上双击事件定义 **/
  GraphliveConstants.LEGEND_DB_CLICK = "LEGEND_DB_CLICK";
  /** 序列在画布上双击事件定义 **/
  GraphliveConstants.SERIES_DB_CLICK = "SERIES_DB_CLICK";
  /** 序列拖拽事件定义 **/
  GraphliveConstants.DND = "DND";
  /** 图元移动事件定义 **/
  GraphliveConstants.MOVE = "MOVE";
  /** 鼠标在绘图控件上移动事件定义 **/
  GraphliveConstants.MOUSE_MOVE = "MOUSE_MOVE";
  /** 序列值改变事件定义 **/
  GraphliveConstants.SERIES_LEGEND_MOVE = "SERIES_LEGEND_MOVE";
  /** 分页事件定义 **/
  GraphliveConstants.PAGING = "PAGING";
  /** 时间线移动事件定义 **/
  GraphliveConstants.TIMELINE_MOVE = "TIMELINE_MOVE";
  /** 鼠标在绘图区按下事件定义 **/
  GraphliveConstants.BUTTON_DOWN = "BUTTON_DOWN";
  /** 鼠标在绘图区释放事件定义 **/
  GraphliveConstants.BUTTON_UP = "BUTTON_UP";
  /** 轴刷新事件定义 **/
  GraphliveConstants.AXIS_UPDATE = "AXIS_UPDATE";


  /*************************************** 绘图编辑器默认配置模型定义 开始 *************************************/
  /*
   *图例Legend模型JSON定义，示例,如果不传入，则取示例中默认的值
   */
  GraphliveConstants.LEGEND_MODEL = {
    xField: 0, //绑定的水平轴业务值
    yField: 0, //绑定垂直轴业务值
    legendType: 'LT001', //图例类型，默认绘制出来是矩形
    bindXAxisName: 'H0', //图例水平绑定轴名称，
    bindYAxisName: null, //图例垂直绑定轴名称，
    maxLegendValue: false, //最大图例值 最大最小值控制图例可拖动的范围，不传入的时候没人不能拖出画布
    minLegendValue: false, //最小图例值
    fill: '', //填充颜色 填充颜色一般不传
    stroke: '', //笔触颜色 笔触颜色
    strokeWidth: 1, //线条的宽度
    opacity: 1, //透明度
    width: 8, //图例宽
    height: 8, //图例高
    selectable: true, //是否能被选中，及出现边框
    lockMovementX: true, //是否不允许水平移动
    lockMovementY: true, //是否不允许垂直动
    hasControls: false, //是否有控制边框
    owner: null, //图例的所有者
    hasBorders: false, //是否有边框，默认为没有
    legendIndex: 0, //图例的序列默认为0
    id: '', //图例的唯一标识
    name: '', //图例的名称
    mark: '', //图例的标注
    guide: null, //是否是辅助产生
    extData: {} //扩展数据
  }
  /*
   *序列模型JSON定义，示例,如果不传入，则取示例中默认的值
   */
  GraphliveConstants.SERIES_MODEL = {
    xField: [], //绑定的水平轴业务值集合 只有序列是line类型的菜有值，甘特(gantt)类型的永远为空数组
    yField: [], //绑定垂直轴业务值集合 序列是line类型的时候存在bind的Y轴时是没个序列值的Y轴轴值，甘特类型的时候是一个垂直Y坐标值
    bindXAxisName: 'H0', //序列水平绑定轴名称，
    bindYAxisName: 'V0', //序列垂直绑定轴名称，
    type: 'line', //序列类型，支持两种渲染方式，一种是甘特图(gantt)类型，另一种是折线图(line)类型
    id: '', //序列的唯一标识
    name: '', //序列的名称
    seriesType:'ST001',//序列的类型细分代码
    legendType: 'LT001', //gantt类型的序列线上显示图例的类型代码，类型代码与形状的对应见文档
    strokeWidth: 1, //线条的宽度
    maxSeriesValue: false, //最大序列值 控制序列上图例拖动的最大最小值
    minSeriesValue: false, //最小序列值
    label: [{ //序列的注释数组，每个元素是一个注释。位置支持top,left,botton,right
      field: false, //显示的标注
      color: 'black', //颜色暂不支持，有颜色会显示字很模糊，
      position: 'top' //位置
    }], //序列的注释数组，每个元素是一个注释。
    color: '#CC0D00', //序列颜色 
    opacity: 1, //透明度
    medianValue: false, //gantt类型的中值点 对于line类型的则为false ，甘特序列可选，有则认为先到此处，然后再慢慢走到结尾
    startValue: false, //gantt类型的起点 对于line类型的则为false 甘特必须
    endValue: false, //gantt类型的终点 对于line类型的则为false 甘特可选，没有的话会慢慢走到画布尽头
    lockHead: false, //gantt图锁定首端不允许移动
    lockEnd: false, //gantt图锁定末端不允许移动
    extData: {} //扩展数据 
  }
  /*
   *序列模型JSON定义，示例,如果不传入，则取示例中默认的值
   */
  GraphliveConstants.GUIDE_MODEL = {
    seriesName: '', //辅助线产生序列的的名字如SPB等
    seriesId: '', //辅助线产生序列的id
    seriesTitle: false, //辅助线产生序列的id
    stroke: '#CC0D00', //辅助线颜色
    yField: '120', //绑定Y轴的轴值，不存在Y轴则是垂直坐标系的y值
    bindXAxisName: 'H0', //序列水平绑定轴名称，
    bindYAxisName: 'V0', //序列垂直绑定轴名称，
  }

  /*
   *动态图例或者时间线走动频率，默认是15秒
   */
  GraphliveConstants.FREQUENCY = 15000;

  /*
   *绘图所用到的共工数据传递对象定义列表，定义只是为了明确传递对象中的属性，并不能保证不合规范的存取
   */

  /*
   *缩放比率定义，用于调整绘图区大小时由绘图编辑器传递给网格、轴等对象
   */
  function ResizeRate(wr, hr) {
    this.widthRate = wr || 1; //宽度比率
    this.heightRate = hr || 1; //高度比率
  };



  /*
   *尺寸定义
   */
  function Dimensions(w, h) {
    this.width = w || 0; //宽度
    this.height = h || 0; //高度
  };