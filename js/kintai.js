var dest_email="";
var sender_group="";
var sender_lastname=""
var sender_firstname="";
var senddate_year;
var senddate_month;
var senddate_day;
var kintai_status_hour;
var kintai_status_minute;

var selected_kintai_status;
var selected_kintai_type;
var selected_boss;

var original_mail_subject_template;
var original_mail_body_template;

function getStorage(key,default_obj){
    var obj;
    var str = localStorage[key];
    if(typeof str === "undefined" || str.length==0){
        obj = default_obj;
    }else{
        obj = JSON.parse(str);
    }
    return obj;
}
function setStorage(key,value){
    localStorage[key] = JSON.stringify(value);
}
function initMasterItems(all_item,storage_key,master_list){
    if(all_item.lengs>0){
        return all_item;
    }

    var all_item = getStorage(storage_key,[]);
    if(all_item.length==0){
        all_item = master_list;
        setStorage(all_item);
    }
    return all_item;
}
function init_list(all_item,select_ul,edit_ul,edit_done_btn,edit_cancel_btn,select_function,delete_function,item_create_page,label_suffix){
    if(select_ul.children.length>0){
        return;
    }
    select_ul.innerHTML="";
    var add_item;
    var add_item_edit;
    for(var i=0;i<all_item.length;i++){
        
        //select list
        var item_info = all_item[i];
        var list_label;
        if(i>1){
            var list_label = item_info.label+label_suffix;
        }else{
            var list_label = item_info.label;
        }
        var is_additem = item_info.additem;
        var is_editable = item_info.editable;
        var is_hastime = item_info.has_time;
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href="#";
        a.innerHTML=list_label;
        li.appendChild(a);
        $(a).attr("data-role","button");
        $(a).attr("data-icon","");
        $(a).attr("data-iconpos","left");
        $(a).css("text-align", "left");
        if(i==0){
            $(a).attr("onClick",'$.mobile.changePage( "'+item_create_page+'", { transition: "pop", role: "dialog", reverse: false } );');
        }else{
            $(a).attr("onClick",select_function+"("+i+")");
        }
        $(a).attr("data-iconpos","right");
        if(is_hastime){
            $(a).attr("data-icon", "arrow-r");
        }
        
        if(is_additem){
            add_item = li;
        }else{
            select_ul.appendChild(li);
        }
        
        //edit list
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href="#";
        a.innerHTML=list_label;
        li.appendChild(a);
        edit_ul.appendChild(li);
        $(a).attr("data-role","button");
        
        $(a).attr("data-iconpos","left");
        $(a).css("text-align", "left");
        if(is_editable){
            $(a).attr("data-icon", "delete");
            $(a).attr("onClick", delete_function+"(this,"+i+")");
        }else{
            $(a).attr("data-icon","alert");
        }
        if(is_additem){
            add_item_edit = li;
        }else{
            edit_ul.appendChild(li);
        }
    }
    if(add_item){
        select_ul.appendChild(add_item);
        edit_ul.appendChild(add_item_edit);
    }
    
    edit_ul.style.display="none";
    edit_done_btn.style.display="none";
    edit_cancel_btn.style.display="none";
}
var is_inited=false;
function init(){
    if(is_inited){
        return;
    }
    is_inited = true;
    console.log("init");
    //送信先初期化
    if(localStorage['dest_email']){
        dest_email = localStorage['dest_email'];
        dest_email_input.value = dest_email;
    }
    
    //送信者初期化
    if(localStorage['sender_group']){
        sender_group     = localStorage['sender_group'];
        sender_group_input.value     = sender_group;
    }
    if(localStorage['sender_lastname']){
        sender_lastname  = localStorage['sender_lastname'];
        sender_lastname_input.value  = sender_lastname;
    }
    if(localStorage['sender_firstname']){
        sender_firstname = localStorage['sender_firstname'];
        sender_firstname_input.value = sender_firstname;
    }
    
    initSenddate();
    init_kintai_status_time();
    
    init_boss_list();
    init_kintai_status_list();
    init_kintai_type_list();
    
    init_mail_subject_template();
    init_mail_body_template();
}
function initSenddate(){
    var now = new Date();
    for(var i=now.getFullYear();i<now.getFullYear()+11;i++){
        var option = document.createElement('option');
        option.value=i;
        option.innerHTML=i;
        if(i==now.getFullYear()){
            option.selected=true;
        }
        senddate_year_select.appendChild(option);
    }
    for(var i=1;i<13;i++){
        var option = document.createElement('option');
        option.value=i;
        option.innerHTML=i;
        if(i==now.getMonth() + 1){
            option.selected=true;
        }
        senddate_month_select.appendChild(option);
    }
    for(var i=1;i<32;i++){
        var option = document.createElement('option');
        option.value=i;
        option.innerHTML=i;
        if(i==now.getDate()){
            option.selected=true;
        }
        senddate_day_select.appendChild(option);
    }
    setSenddate();
}
function setDestEmail(){
    dest_email = dest_email_input.value;
    localStorage['dest_email'] = dest_email;
}
function setSender_name(){
    sender_group     = sender_group_input.value;
    sender_lastname  = sender_lastname_input.value;
    sender_firstname = sender_firstname_input.value;
    localStorage['sender_group']     = sender_group;
    localStorage['sender_lastname']  = sender_lastname;
    localStorage['sender_firstname'] = sender_firstname;
}
function setSenddate(){
    var year_options = senddate_year_select.children;
    for(var i=0;i<year_options.length;i++){
        if(year_options[i].selected){
            senddate_year = year_options[i].value;
            break;
        }
    }
    
    var month_options = senddate_month_select.children;
    for(var i=0;i<month_options.length;i++){
        if(month_options[i].selected){
            senddate_month = month_options[i].value;
            break;
        }
    }
    
    var day_options = senddate_day_select.children;
    for(var i=0;i<day_options.length;i++){
        if(day_options[i].selected){
            senddate_day = day_options[i].value;
            break;
        }
    }
    var disp_str = senddate_month+"月"+senddate_day+"日";
    senddate_disp.innerHTML = ":"+disp_str;
    senddate_disp2.innerHTML = disp_str;
}
function init_mail_subject_template(){
    var org_str = mail_subject_template.value;
    original_mail_subject_template = org_str;
    var subject_template = getStorage("mail_subject_template",original_mail_subject_template);
    mail_subject_template.value = subject_template;
    publish_mail_subject_template();
}
function publish_mail_subject_template(){
    var params = getMailParams();
    mail_subject_published.innerHTML="";
    $.tmpl(mail_subject_template.value, params).appendTo( "#mail_subject_published" );
}
function change_mail_subject_template(){
    var subject_template = mail_subject_template.value;
    setStorage("mail_subject_template",subject_template);
    publish_mail_subject_template();
}
function reset_mail_subject_template(){
    mail_subject_template.value = original_mail_subject_template;
    change_mail_subject_template();
}


function init_mail_body_template(){
    var org_str = mail_body_template.value;
    original_mail_body_template = org_str;
    var body_template = getStorage("mail_body_template",original_mail_body_template);
    mail_body_template.value = body_template;
    publish_mail_body_template();
}
function publish_mail_body_template(){
    var params = getMailParams();
    mail_body_published.innerHTML="";
    
    var body_template = mail_body_template.innerHTML;
    body_template = body_template.replace(/[\r\n]/g,"${br}");
    
    $.tmpl(body_template, params).appendTo( "#mail_body_published" );
    
}
function change_mail_body_template(){
    var body_template = mail_body_template.value;
    setStorage("mail_body_template",body_template);
    publish_mail_body_template();
}
function reset_mail_body_template(){
    mail_body_template.value = original_mail_body_template;
    change_mail_body_template();
}


function getMailParams(){
    var kintai_status = ALL_KINTAI_STATU[selected_kintai_status];
    var kintai_type = ALL_KINTAI_TYPE[selected_kintai_type];
    var boss = ALL_BOSS[selected_boss];
    var params=[
        {
            Date: senddate_month+"月"+senddate_day+"日",
            YourName_lastName: sender_lastname,
            YourName_firstName: sender_firstname,
            Situation_title: (kintai_status) ? kintai_status.label : "",
            Situation_time: (kintai_status && kintai_status.has_time) ? kintai_status_hour+"時"+kintai_status_minute+"分" : "",
            Type_name: (kintai_type) ? kintai_type.label : "",
            Boss_name: (boss) ? boss.label : "",
            br: "\n"
        }
    ];
    return params;
}
function createNewMail(){
    publish_mail_subject_template();
    publish_mail_body_template();
    var subject = encodeURI(mail_subject_published.innerHTML);
    var body = encodeURI(mail_body_published.innerHTML);
    var mailto = encodeURI(dest_email);
    
    document.location.href ="mailto:"+mailto+"?subject="+subject+"&body="+body;
    return;
}