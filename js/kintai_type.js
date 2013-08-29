var KINTAI_TYPE_LIST =[
   {label:"種別を追加...", available: false, editable: false, additem: true},
   {label:"自己都合", available: true, editable: true},
   {label:"私用", available: true, editable: true},
   {label:"業務都合", available: true, editable: true},
   {label:"不可抗力", available: true, editable: true}
];

var ALL_KINTAI_TYPE=[];
function init_kintai_type_list(){
    ALL_KINTAI_TYPE = initMasterItems(ALL_KINTAI_TYPE,'kintai_type_list',KINTAI_TYPE_LIST);
    var all_item = ALL_KINTAI_TYPE;
    var select_ul = kintai_type_select_list_ul;
    var edit_ul = kintai_type_edit_list_ul;
    var edit_done_btn = kintai_type_edit_done_btn;
    var edit_cancel_btn = kintai_type_edit_cancel_btn;
    var select_function = "set_selected_kintai_type";
    var delete_function = "delete_kintai_type_name";
    var item_create_page = "#popup_new_kintai_type";
    var label_suffix = "";
    init_list(all_item,select_ul,edit_ul,edit_done_btn,edit_cancel_btn,select_function,delete_function,item_create_page,label_suffix);
}

function set_selected_kintai_type(idx){
    selected_kintai_type = idx;
    var item_info = ALL_KINTAI_TYPE[selected_kintai_type];
    if(item_info.available){
        selected_kintai_type_disp.innerHTML=":"+item_info.label;
    }else{
        selected_kintai_type_disp.innerHTML="";
    }
    if(item_info.additem){
        document.location.href="#popup_new_kintai_type";
    }else{
        document.location.href="#menu";
    }
}
function add_kintai_type_name(){
    if(!kintai_type_name.value){
        return
    }
    ALL_KINTAI_TYPE.push({label:kintai_type_name.value, available: true, editable: true});
    setStorage('kintai_type_list', ALL_KINTAI_TYPE);
    
    document.location.href="#page_kintai_type_select";
    $.mobile.showPageLoadingMsg();
    document.location.reload(true);
}
function start_kintai_type_edit_list(){
    kintai_type_select_list_ul.style.display="none";
    kintai_type_edit_list_ul.style.display="block";
    kintai_type_edit_btn.style.display="none";
    kintai_type_edit_done_btn.style.display="block";
    page_kintai_type_select_back_btn.style.display="none";
    kintai_type_edit_cancel_btn.style.display="block";
}

var delete_kintai_type_list=[]
function delete_kintai_type_name(obj,idx){
    var item_info = ALL_KINTAI_TYPE[idx];
    if(item_info.editable){
        delete_kintai_type_list.push(idx);
    }
    
    obj.style.display="none";
}

function done_kintai_type_edit(){
    var new_kintai_type_list=[];
    for(var i=0;i<ALL_KINTAI_TYPE.length;i++){
        var item_info = ALL_KINTAI_TYPE[i];
        var is_delete=false;
        for(var j=0;j<delete_kintai_type_list.length;j++){
            if(delete_kintai_type_list[j] == i){
                if(item_info.editable){
                    if(selected_kintai_type==i){
                        selected_kintai_type=null;
                    }
                    is_delete=true;
                    break;
                }
            }
        }
        if(!is_delete){
            new_kintai_type_list.push(item_info);
        }
    }
    setStorage('kintai_type_list', new_kintai_type_list);
    delete_kintai_type_list=[];
    $.mobile.showPageLoadingMsg();
    document.location.reload(true);
}
function cancel_kintai_type_edit_list(){
    delete_kintai_type_list=[];
    $.mobile.showPageLoadingMsg();
    document.location.reload(true);
}