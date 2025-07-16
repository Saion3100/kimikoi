
window.addEventListener('load', function () {
    //console.log("読み込まれた text 配列：", window.ScenarioData.text);
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
    var select1 = document.getElementById('select1');
    var select2 = document.getElementById('select2');
    var select3 = document.getElementById('select3');
    var select_text1 = document.getElementById('selectText1');
    var select_text2 = document.getElementById('selectText2');
    var select_text3 = document.getElementById('selectText3');


    function main() {
        var tmp = split_chars.shift();
        //タグ処理
        if (tmp == '<') {
            let tagget_str = '';
            tmp = split_chars.shift();
            while (tmp != '>' && tmp !== undefined) {
                tagget_str += tmp;
                tmp = split_chars.shift();
            }

            tagget_str = tagget_str.split(/\s/);
            //分岐選択肢
            switch (tagget_str[0]) {
                case 'selectBox':
                    $('.selectBox').addClass('show');
                    break;
                case 'text1':
                    select_text1.innerHTML = tagget_str[1];
                    break;
                case 'text2':
                    select_text2.innerHTML = tagget_str[1];
                    break;
                case 'text3':
                    select_text3.innerHTML = tagget_str[1];
                    break;
                case 'select1':
                    if (tagget_str[1] === "none") {
                        $('#select1').addClass('none');
                    } else {
                        select_num1 = tagget_str[1];
                        select1.addEventListener('click', function () {
                            scene_cnt = select_num1;
                            line_cnt = -1;
                            $('.selectBox').removeClass('show');
                            selectNoneRemove();
                            textClick();
                        });
                    }
                    break;
                case 'select2':
                    if (tagget_str[1] === "none") {
                        $('#select2').addClass('none');
                    } else {
                        select_num2 = tagget_str[1];
                        select2.addEventListener('click', function () {
                            scene_cnt = select_num2;
                            line_cnt = -1;
                            $('.selectBox').removeClass('show');
                            selectNoneRemove();
                            textClick();
                        });
                    }
                    break;
                case 'select3':
                    if (tagget_str[1] === "none") {
                        $('#select3').addClass('none');
                    } else {
                        select_num3 = tagget_str[1];
                        select3.addEventListener('click', function () {
                            scene_cnt = select_num3;
                            line_cnt = -1;
                            $('.selectBox').removeClass('show');
                            selectNoneRemove();
                            textClick();
                        });
                    }
                    break;
                case 'break':
                    mess_text.innerHTML += '<br>';
                    break;
                case 'skip':
                    scene_cnt = tagget_str[1];
                    line_cnt = -1;
                    break;
                case 'stop':
                //エンディングに飛ばしたい。
            }
            setTimeout(main, lINTERVA);
            return;
        }
        //通常文字出力
        if (tmp !== undefined && !stop_flg) {
            mess_text.innerHTML += tmp;
            setTimeout(main, lINTERVA);
        } else {
            mess_text.innerHTML += '<span class="blink-text"></span>';
        }
    }




    //文字送りのメソッド
    mess_box.addEventListener('click', function () {
        //シナリオが終了したら文字送りをしない
        if (end_flg) return;

        //テキストの文字送り
        if (mswin_flg) {
            if (!stop_flg) {
                line_cnt++;
                if (line_cnt >= text[scene_cnt].length) {
                    line_cnt = 0;
                    //scene_cnt++;
                }
            } else if (scene_cnt >= text.length) {
                end_flg = true;
                return;
            }

            split_chars = text[scene_cnt][line_cnt].split('');
            mess_text.innerHTML = '';
            main();
        }
    });

    function textClick() {
        $('#textbox').trigger('click');
    }
    function selectNoneRemove() {
        $('#select1').removeClass('none');
        $('#select2').removeClass('none');
        $('#select3').removeClass('none');
    }
});

