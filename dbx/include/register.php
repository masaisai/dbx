<?php
require_once("../init.php");
//require_once("smtp.class.php");//邮件发送类
	$data="";
	//print_r($_POST);
	$data=json_decode($_POST['data']);
	file_put_contents('test.log', $_POST['data'], true);
	$username = $data->username; 
	$query = $db->query("select id from user where username='$username'"); 
	$row = $query->fetch_array(); 
if($row){ 
    echo '用户名已存在，请换个其他的用户名'; 
    exit; 
} 

$password = md5($data->password); //加密密码 
$email = $data->email; //邮箱 
$regtime = time(); 
   
$token = md5($username.$password.$regtime); //创建用于激活识别码 
$token_exptime = time()+60*60*24;//过期时间为24小时后 
   
$sql = "insert into `user` (`username`,`password`,`email`,`token`,`token_exptime`,`regtime`)  
values ('$username','$password','$email','$token','$token_exptime','$regtime')"; 
 if ($db->query($sql) === TRUE) {
    echo "新记录插入成功";
} else {
    echo "Error: " . $sql . "<br>" . $db->error;
}
$db->close();

?>