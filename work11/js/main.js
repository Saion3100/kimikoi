
window.addEventListener('load',function(){

    
    
    var mess_box = this.document.getElementById('textbox');
    var mess_text = this.document.getElementById('text');
    var mswin_flg = true;
    var stop_flg = false;
    var end_flg = false;
    var scene_cnt = 0;
    var line_cnt = 0;

    var text = [];

    //シナリオを配列に保管、カンマ区切り=クリック回数
    text[0] = ["俺の名前はハーレム・太郎だ☆",
        "俺はこの君恋学園の三年生だ。",
        "なんでこんなに騒がしいかって？",
        "それは７日後に開催される君恋学園一大イベントの",
        "文化祭があるんだ！",
        "今日からその準備で授業はないからこんなに騒がしいってわけ☆"
    ];


    //文字送りのメソッド
    mess_box.addEventListener('click',function(){
        //シナリオが終了したら文字送りをしない
        if(end_flg)return;
        
        //テキストの文字送り
        if(mswin_flg){
           if(!stop_flg){
            line_cnt++;
            if(line_cnt >= text[scene_cnt].length){
                line_cnt = 0;
            }
           }else if(scene_cnt >= text.length){
            end_flg = true;
            return;
           }
        }
    })
});

