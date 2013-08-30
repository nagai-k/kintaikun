var KINTAI_STATUS_LIST =[
    {label:"状況を追加...", available: false, editable: false, additem: true, has_time: false},
    {label:"遅刻", available: true, editable: true, has_time: true},
    {label:"有給取得", available: true, editable: true, has_time: false},
    {label:"早退", available: true, editable: true, has_time: true},
    {label:"代休取得", available: true, editable: true, has_time: false}
];

var ALL_KINTAI_STATU=[];
function init_kintai_status_list(){
    ALL_KINTAI_STATU = initMasterItems(ALL_KINTAI_STATU,'kintai_status_list',KINTAI_STATUS_LIST);
    var all_item = ALL_KINTAI_STATU;
    var select_ul = kintai_status_select_list_ul;
    var edit_ul = kintai_status_edit_list_ul;
    var edit_done_btn = kintai_status_edit_done_btn;
    var edit_cancel_btn = kintai_status_edit_cancel_btn;
    var select_function = "set_selected_kintai_status";
    var delete_function = "delete_kintai_status_name";
    var item_create_page = "#popup_new_kintai_status";
    var label_suffix = "";
    init_list(all_item,select_ul,edit_ul,edit_done_btn,edit_cancel_btn,select_function,delete_function,item_create_page,label_suffix);
}

function set_selected_kintai_status(idx){
    selected_kintai_status = idx;
    var item_info = ALL_KINTAI_STATU[selected_kintai_status];
    if(item_info.available){
        selected_kintai_status_disp.innerHTML=":"+item_info.label;
    }else{
        selected_kintai_status_disp.innerHTML="";
    }
    
    if(item_info.additem){
        $.mobile.changePage('#popup_new_kintai_status');
    }else if(item_info.has_time){
        kintai_status_time_title.innerHTML=item_info.label;
        init_kintai_status_time();
        $.mobile.changePage('#page_kintai_status_time');
    }else{
        $.mobile.changePage('#menu');
    }
}
function add_kintai_status_name(){
    if(!kintai_status_name.value){
        return
    }
    if(kintai_status_hastime.value=="yes"){
        var hastime=true;
    }else{
        var hastime=false;
    }
    ALL_KINTAI_STATU.push({label:kintai_status_name.value, available: true, editable: true, has_time: hastime});
    setStorage('kintai_status_list', ALL_KINTAI_STATU);
    
    $.mobile.changePage('#page_kintai_status_select');
    $.mobile.showPageLoadingMsg();
    document.location.reload(true);
}
function start_kintai_status_edit_list(){
    kintai_status_select_list_ul.style.display="none";
    kintai_status_edit_list_ul.style.display="block";
    kintai_status_edit_btn.style.display="none";
    kintai_status_edit_done_btn.style.display="block";
    page_kintai_status_select_back_btn.style.display="none";
    kintai_status_edit_cancel_btn.style.display="block";
}

var delete_kintai_status_list=[]
function delete_kintai_status_name(obj,idx){
    var item_info = ALL_KINTAI_STATU[idx];
    if(item_info.editable){
        delete_kintai_status_list.push(idx);
    }
    
    obj.style.display="none";
}

function done_kintai_status_edit(){
    var new_kintai_status_list=[];
    for(var i=0;i<ALL_KINTAI_STATU.length;i++){
        var item_info = ALL_KINTAI_STATU[i];
        var is_delete=false;
        for(var j=0;j<delete_kintai_status_list.length;j++){
            if(delete_kintai_status_list[j] == i){
                if(item_info.editable){
                    if(selected_kintai_status==i){
                        selected_kintai_status=null;
                    }
                    is_delete=true;
                    break;
                }
            }
        }
        if(!is_delete){
            new_kintai_status_list.push(item_info);
        }
    }
    setStorage('kintai_status_list', new_kintai_status_list);
    delete_kintai_status_list=[];
    $.mobile.showPageLoadingMsg();
    document.location.reload(true);
}
function cancel_kintai_status_edit_list(){
    delete_kintai_status_list=[];
    $.mobile.showPageLoadingMsg();
    document.location.reload(true);
}

function init_kintai_status_time(){
    kintai_status_hour_select.innerHTML="";
    kintai_status_minute_select.innerHTML="";
    
    var set_hour;
    var set_minute;
    var now = new Date();
    if(kintai_status_hour){
        set_hour=kintai_status_hour;
    }else{
        set_hour=now.getHours();
    }
    if(kintai_status_minute){
        set_minute=kintai_status_minute;
    }else{
        set_minute=now.getMinutes();
    }
    
    for(var i=1;i<24;i++){
        var option = document.createElement('option');
        option.value=i;
        option.innerHTML=i;
        if(i==now.getHours()){
            option.selected=true;
        }
        kintai_status_hour_select.appendChild(option);
    }
    for(var i=0;i<60;i++){
        var option = document.createElement('option');
        option.value=i;
        option.innerHTML=i;
        if(i==now.getMinutes()){
            option.selected=true;
        }
        kintai_status_minute_select.appendChild(option);
    }
    set_kintai_status_time();
}

function set_kintai_status_time(){
    var hour_options = kintai_status_hour_select.children;
    for(var i=0;i<hour_options.length;i++){
        if(hour_options[i].selected){
            kintai_status_hour = hour_options[i].value;
            break;
        }
    }
    
    var minute_options = kintai_status_minute_select.children;
    for(var i=0;i<minute_options.length;i++){
        if(minute_options[i].selected){
            kintai_status_minute = minute_options[i].value;
            break;
        }
    }
    var disp_str = kintai_status_hour+"時"+kintai_status_minute+"分";
    kintai_status_time_disp.innerHTML = disp_str;
    
    if(selected_kintai_status){
        var item_info = ALL_KINTAI_STATU[selected_kintai_status];
        selected_kintai_status_disp.innerHTML=":"+item_info.label+"("+disp_str+")";
    }
}
