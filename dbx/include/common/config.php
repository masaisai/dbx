<?

/*

 * 系统配置文件

*/



define("DEBUG", true);

//error_reporting(0);



//数据库连接

$config["db_host"] = "localhost";

$config["db_user"] = "root";

$config["db_pass"] = "";

$config["db_name"] = "dbx";

$timezone="Asia/Shanghai";

//系统配置

define("DEFAULT_PAGE_SIZE", 20);					//	默认分页时每页的记录数(对后台)

define("MAX_IMAGE_SIZE", 1024 * 1024 * 40);			//	图片最大 40M

//define("UPLOAD_PATH_FOR_ADMIN", "../upload/");		//	文件上传路径(对后台)

//define("UPLOAD_PATH", "/dbx/upload/");			//	文件上传路径(对前台)

?>
