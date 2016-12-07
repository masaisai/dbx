<?
ob_start();											//使用缓冲

//装载必须的文件
require("config.php");

header("Content-Type:text/html;charset=utf-8;");	//指定字符集

 

//输入检查， addslashes() 函数返回在预定义字符之前添加反斜杠的字符串。
//function process_variables(&$val, $key)
//{
//	if (is_array($val))
//	{
//		foreach ($val as $k => $v)
//		{
//			process_variables($v, $k);
//		}
//	}
//	else
//	{
//		$val = addslashes($val);
//	}
//}
//
//if (!get_magic_quotes_gpc())
//{
//	array_walk($_GET, "process_variables");
//	array_walk($_POST, "process_variables");
//	array_walk($_FILES, "process_variables");
//	array_walk($_COOKIE, "process_variables");
//	if (is_array(@$_SESSION))
//		array_walk($_SESSION, "process_variables");
//}

//建立数据库连接对象
$db	= new mysqli($config["db_host"], $config["db_user"], $config["db_pass"], $config["db_name"]);
if ($db->connect_error) {
    die("连接失败: " . $db->connect_error);
} 
date_default_timezone_set($timezone); //北京时间
echo "<script>console.log('数据库连接成功！')</script>";
//查询基本信息
//$sql = "select name, title, icp, keyword, description, hotline, contact, jsHeader, javascript, rightButton from config_base where id=1";
//$rst = $db->query($sql);
//if ($row = $db->fetch_array($rst))
//{
//	$config_name			= $row["name"];
//	$config_title			= $row["title"];
//	$config_icp				= $row["icp"];
//	$config_keyword			= $row["keyword"];
//	$config_description		= $row["description"];
//	$config_hotline			= $row["hotline"];
//	$config_contact			= $row["contact"];
//	$config_jsHeader		= $row["jsHeader"];
//	$config_javascript		= $row["javascript"];
//	$config_rightButton		= $row["rightButton"];
//}

//常规设置
$content_width	= 938; // 内容模式图片允许最大宽度
$pic_width		= 266; // 默认图片列表页图片宽度
$pic_height		= 214; // 默认图片列表页图片高

$picTxt_width	= 200; // 默认图文列表页图片宽度
$picTxt_height	= 150; // 默认图文列表页图片高

//获取基本栏目
//$sql = "select id, name from info_class where id like '___' order by sortnum asc";
//$rst = $db->query($sql);
//while ($row = $db->fetch_array($rst)) {
//	$baseClassArray[]	= $row;
//}
//
//$baseClassCnt = count($baseClassArray);
//if ($baseClassCnt < 1) {
//	$baseClassCnt = -1;
//}
//
//for ($j = 0; $j < $baseClassCnt; $j++) {
//	$sql = "select id, name, has_sub from info_class where id like '".$baseClassArray[$j]['id']."___' order by sortnum asc";
//	$rst = $db->query($sql);
//	$bid = $baseClassArray[$j]['id'];
//	while ($row = $db->fetch_array($rst)) {
//		$secondClassArray[$bid][] = $row;
//	}
	//var_dump($sql);
	//var_dump($secondClassArray);
	//exit;
//}
?>