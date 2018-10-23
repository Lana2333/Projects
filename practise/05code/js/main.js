$(function () {
/**********搜索///提问*********/
	$('#search_button').button({
		icons : {
			primary : 'ui-icon-search',
		},
	});
	$('#question_button').button({
		icons : {
			primary : 'ui-icon-lightbulb',
		},
	}).click(function(){
		if($.cookie('user')){
			$('#question').dialog('open');
		}else{
			$('#error').dialog('open');
			setTimeout(function(){
				$('#error').dialog('close');
				$('#login').dialog('open');
			},1000);
		}
	});
	$.ajax({
		url : 'show_content.php',
		type : 'POST',
		success : function(response, status, xhr){
			var json = $.parseJSON(response);
			var html = '';
			var arr = [];
			var summary = [];
			$.each(json, function (index, value) {
				html += '<h4>' + value.user + ' 发表于 ' + value.date + '</h4><h3>' + value.title + '</h3><div class="editor">' + value.content + '</div><div class="bottom">0条评论 <span class="up">收起</span></div><hr noshade="noshade" size="1" />';
			});
			$('.content').append(html);
			$.each($('.editor'), function (index, value) {
				arr[index] = $(value).html();
				summary[index] = arr[index].substr(0, 200);
				
				if (summary[index].substring(199,200) == '<') {
					summary[index] = replacePos(summary[index], 200, '');
				}
				if (summary[index].substring(198,200) == '</') {
					summary[index] = replacePos(summary[index], 200, '');
					summary[index] = replacePos(summary[index], 199, '');
				}
				
				if (arr[index].length > 100) {
					summary[index] += '...<span class="down">显示全部</span>';
					$(value).html(summary[index]);
				}
				$('.bottom .up').hide();
			});

			$.each($('.editor'), function (index, value) {
				$(this).on('click', '.down', function () {
					$('.editor').eq(index).html(arr[index]);
					$(this).hide();
					$('.bottom .up').eq(index).show();
				});
			});
			
			$.each($('.bottom'), function (index, value) {
				$(this).on('click', '.up', function () {
					$('.editor').eq(index).html(summary[index]);
					$(this).hide();
					$('.editor .down').eq(index).show();
				});
			});
		},
	});

	$('#question').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		width : 500,
		height : 360,
		buttons : {
			'发布' : function () {
				$(this).ajaxSubmit({
					url : 'question.php',
					type : 'POST',
					data : {
						user : $.cookie('user'),
						content : $('.uEditorCustom').contents().find('#iframeBody').html(),
					},
					beforeSubmit:function(formDta,jqForm,option){
						$('#loading').dialog('open');
						$('#question').dialog('widget').find('button').eq(1).button('disable');
					},
					success : function(responseText,statusText){
						if(responseText){
							$('#question').dialog('widget').find('button').eq(1).button('enable');
							$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html('发布成功!');					}
							
							setTimeout(function(){
								$('#loading').dialog('close');
								$('#question').dialog('close');
								$('#question').resetForm();
								$('.uEditorCustom').contents().find('#iframeBody').html('请输入问题描述：');
								$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html('数据提交中...');
							},1000);
						},
				});
			},
		},
	});

	$('.uEditorCustom').uEditor();
	
/**********数据交互*********/
	$('#member,#logout').hide();

	if($.cookie('user')){
		$('#member,#logout').show();
		$('#reg_a,#login_a').hide();
		$('#member').html($.cookie('user'));
	}else{
		$('#member,#logout').hide();
		$('#reg_a,#login_a').show();
	}

	$('#logout').click(function(){
		$.removeCookie('user');
		window.location.href = '/05code/';
	});
	
	$('#loading').dialog({
		autoOpen : false,
		modal : true,
		closeOnEscape : false,
		resizable : false,
		draggable : false,
		width : 180,
		height : 50,
	}).parent().find('.ui-widget-header').hide();

	$('#error').dialog({
		autoOpen : false,
		modal : true,
		closeOnEscape : false,
		resizable : false,
		draggable : false,
		width : 180,
		height : 50,
	}).parent().find('.ui-widget-header').hide();

/**********注册*********/
	$('#reg_a').click(function(){
		$('#reg').dialog('open');
	});

	$('#reg').buttonset();
	$('#reg').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		width : 325,
		height : 340,
		buttons : {
			'注册' : function () {
				$(this).submit();
			}
		}
	}).validate({
	
		submitHandler : function (form) {
			$(form).ajaxSubmit({
				url:'add.php',
				type:'POST',
				beforeSubmit:function(formDta,jqForm,option){
					$('#loading').dialog('open');
					$('#reg').dialog('widget').find('button').eq(1).button('disable');
				},
				success : function(responseText,statusText){
					if(responseText){
						$('#reg').dialog('widget').find('button').eq(1).button('enable');
						$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html('注册成功!');					}
						$.cookie('user',$('#user').val());
						setTimeout(function(){
							$('#loading').dialog('close');
							$('#reg').dialog('close');
							$('#reg').resetForm();
							$('#reg span.star').html('*').removeClass('succ');
							$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html('数据提交中...');
							$('#member,#logout').show();
							$('#reg_a,#login_a').hide();
							$('#member').html($.cookie('user'));
						},1000);
					},
			});
		},
	
		showErrors : function (errorMap, errorList) {
			var errors = this.numberOfInvalids();
			
			if (errors > 0) {
				$('#reg').dialog('option', 'height', errors * 20 + 340);
			} else {
				$('#reg').dialog('option', 'height', 340);
			}
			
			this.defaultShowErrors();
		},
		
		highlight : function (element, errorClass) {
			$(element).css('border', '1px solid red');
			$(element).parent().find('span').html('*').removeClass('succ');
		},
		
		unhighlight : function (element, errorClass) {
			$(element).css('border', '1px solid #ccc');
			$(element).parent().find('span').html('&nbsp;').addClass('succ');
		},
	
		errorLabelContainer : 'ol.reg_error',
		wrapper : 'li',
	
		rules : {
			user : {
				required : true,
				minlength : 2,
				remote : {
					url : 'is_user.php',
					type : 'POST',
				},
			},
			pass : {
				required : true,
				minlength : 6,
			},
			email : {
				required : true,
				email : true
			},
			date : {
				date : true,
			},
		},
		messages : {
			user : {
				required : '帐号不得为空！',
				minlength : jQuery.format('帐号不得小于{0}位！'),
				remote : '账号已被注册！',
			},
			pass : {
				required : '密码不得为空！',
				minlength : jQuery.format('密码不得小于{0}位！'),
			},
			email : {
				required : '邮箱不得为空！',
				minlength : '请输入正确的邮箱地址！',
			},	
		}
	});

	$('#birthday').datepicker({
		dateFormat:'yy-mm-dd',
		dayNamesMin:['日','一','二','三','四','五','六'],
		showWeek:true,
		weekHeader:'周',
		fristDay:1,
		changeMonth : true,
		changeYear : true,
		yearSuffix : '',
		maxDate : 0,
		yearRange : '1950:2020',
	});

	$('#email').autocomplete({
		delay:0,
		autoFocus:true,
		source:function(request,response){
			var hosts=['qq.com','163.com','263.come','gmail.com','hotmail.com']
			term = request.term,
			ix = term.indexOf('@'),//indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置
			name = term,
			host = '',
			result = [];
			result.push(term);
			if(ix > -1){
				name=term.slice(0,ix);
				host=term.slice(ix+1);
			}
			if(name){
				//$.grep() 函数使用指定的函数过滤数组中的元素，并返回过滤后的数组。
				var findedHosts = (host?$.grep(hosts,function(value,index){
					return value.indexOf(host)>-1
				}):hosts),
				findedResult = $.map(findedHosts,function(value,index){
					return name+'@'+value;
				});
				result = result.concat(findedResult);
			}
			response(result);
		},
	});

/**********登录*********/
	$('#login_a').click(function(){
		$('#login').dialog('open');
	});

	$('#login').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		width : 325,
		height : 250,
		buttons : {
			'登录' : function () {
				$(this).submit();
			}
		}
	}).validate({

		submitHandler : function (form) {
			$(form).ajaxSubmit({
				url:'login.php',
				type:'POST',
				beforeSubmit:function(formDta,jqForm,option){
					$('#loading').dialog('open');
					$('#login').dialog('widget').find('button').eq(1).button('disable');
				},
				success : function(responseText,statusText){
					if(responseText){
						$('#login').dialog('widget').find('button').eq(1).button('enable');
						$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html('登录成功!');					}
						
						if($('#expires').is(':checked')){
							$.cookie('user',$('#login_user').val(),{
								expires : 7,
							});
						}else{
							$.cookie('user',$('#login_user').val());
						}
						setTimeout(function(){
							$('#loading').dialog('close');
							$('#login').dialog('close');
							$('#login').resetForm();
							$('#login span.star').html('*').removeClass('succ');
							$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html('数据提交中...');
							$('#member,#logout').show();
							$('#reg_a,#login_a').hide();
							$('#member').html($.cookie('user'));
						},1000);
					},
			});
		},

		showErrors : function (errorMap, errorList) {
			var errors = this.numberOfInvalids();
			
			if (errors > 0) {
				$('#login').dialog('option', 'height', errors * 20 + 250);
			} else {
				$('#login').dialog('option', 'height', 250);
			}
			
			this.defaultShowErrors();
		},
		
		highlight : function (element, errorClass) {
			$(element).css('border', '1px solid red');
			$(element).parent().find('span').html('*').removeClass('succ');
		},
		
		unhighlight : function (element, errorClass) {
			$(element).css('border', '1px solid #ccc');
			$(element).parent().find('span').html('&nbsp;').addClass('succ');
		},

		errorLabelContainer : 'ol.login_error',
		wrapper : 'li',

		rules : {
			login_user : {
				required : true,
				minlength : 2,
			},
			login_pass : {
				required : true,
				minlength : 6,
				remote : {
					url : 'login.php',
					type : 'POST',
					data : {
						login_user : function(){
							return $('#login_user').val();
						},
					},
				},
			},
		},
		messages : {
			login_user : {
				required : '帐号不得为空！',
				minlength : jQuery.format('帐号不得小于{0}位！'),
			},
			login_pass : {
				required : '密码不得为空！',
				minlength : jQuery.format('密码不得小于{0}位！'),
				remote : '用户名或密码不正确！',
			},	
		}
	});

/**********选项卡*********/
	$('#tabs').tabs();

/**********菜单*********/
	$('#menus').accordion({
		collapsible: true,
		active: true,
		header: 'h3',
		icons: {
			"header": "ui-icon-plus",
			"activeHeader": "ui-icon-minus",
		},
	});
});