
window.addEventListener('load',function(){
    console.log("読み込まれた text 配列：", window.ScenarioData.text);
 const text = window.ScenarioData.text;
    var mess_box = this.document.getElementById('textbox');
    var mess_text = this.document.getElementById('text');
    var mswin_flg = true;
    var stop_flg = false;
    var end_flg = false;
    var scene_cnt = 0;
    var line_cnt = 0;
    var split_chars = [];
    const lINTERVA = 60; //文字送りの速さ


    function main(){
        var tmp = split_chars.shift();
        if(tmp !== undefined) {
            if (!stop_flg) {
                mess_text.innerHTML += tmp;
                setTimeout(main, lINTERVA);
            } else {
                mess_text.innerHTML += '<span class="blink-text"></span>';
            }
         }
    }

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
                //scene_cnt++;
            }
           }else if(scene_cnt >= text.length){
            end_flg = true;
            return;
           }
        }
        split_chars=text[scene_cnt][line_cnt].split('');
        mess_text.innerHTML='';
        main();
    })
});

