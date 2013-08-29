var BOSS_LIST = [
    {label:"上長を追加...", available: false, editable: false, additem: true},
    {label:"なし", available: false, editable: false}
];
var ALL_BOSS=[];
function init_boss_list(){
    ALL_BOSS = initMasterItems(ALL_BOSS,'boss_list',BOSS_LIST);
    var all_item = ALL_BOSS;
    var select_ul = boss_select_list_ul;
    var edit_ul = boss_edit_list_ul;
    var edit_done_btn = boss_edit_done_btn;
    var edit_cancel_btn = boss_edit_cancel_btn;
    var select_function = "set_selected_boss";
    var delete_function = "delete_boss_name";
    var item_create_page = "#popup_new_boss";
    var label_suffix = "さん";
    init_list(all_item,select_ul,edit_ul,edit_done_btn,edit_cancel_btn,select_function,delete_function,item_create_page,label_suffix);
}

function set_selected_boss(idx){
    selected_boss = idx;
    var item_info = ALL_BOSS[selected_boss];
    if(item_info.available){
        selected_boss_disp.innerHTML=":"+item_info.label+"さん";
    }else{
        selected_boss_disp.innerHTML="";
    }
    if(item_info.additem){
        document.location.href="#popup_new_boss";
    }else{
        document.location.href="#menu";
    }
}
function add_boss_name(){
    if(!boss_name.value){
        return
    }
    ALL_BOSS.push({label:boss_name.value, available: true, editable: true});
    setStorage('boss_list', ALL_BOSS);
    
    document.location.href="#page_boss_select";
    $.mobile.showPageLoadingMsg();
    document.location.reload(true);
}
function start_boss_edit_list(){
    boss_select_list_ul.style.display="none";
    boss_edit_list_ul.style.display="block";
    boss_edit_btn.style.display="none";
    boss_edit_done_btn.style.display="block";
    page_boss_select_back_btn.style.display="none";
    boss_edit_cancel_btn.style.display="block";
}

var delete_boss_list=[]
function delete_boss_name(obj,idx){
    var item_info = ALL_BOSS[idx];
    if(item_info.editable){
        delete_boss_list.push(idx);
    }
    
    obj.style.display="none";
}

function done_boss_edit(){
    var new_boss_list=[];
    for(var i=0;i<ALL_BOSS.length;i++){
        var item_info = ALL_BOSS[i];
        var is_delete=false;
        for(var j=0;j<delete_boss_list.length;j++){
            if(delete_boss_list[j] == i){
                if(item_info.editable){
                    if(selected_boss==i){
                        selected_boss=null;
                    }
                    is_delete=true;
                    break;
                }
            }
        }
        if(!is_delete){
            new_boss_list.push(item_info);
        }
    }
    setStorage('boss_list', new_boss_list);
    delete_boss_list=[];
    $.mobile.showPageLoadingMsg();
    document.location.reload(true);
}
function cancel_boss_edit_list(){
    delete_boss_list=[];
    $.mobile.showPageLoadingMsg();
    document.location.reload(true);
}