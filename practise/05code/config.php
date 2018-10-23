<?php
    header('Content-Type:text/html;charest=utf-8');

    define('DB_HOST','localhost');
    define('DB_USRE','root');
    define('DB_PWD','123456');
    define('DB_NAME','zhiwen');

    $conn = @mysql_connect(DB_HOST,DB_USRE,DB_PWD) or die('数据库链接失败:'.mysql_error());
    @mysql_select_db(DB_NAME) or die('字符集错误:'.mysql_error());
?>