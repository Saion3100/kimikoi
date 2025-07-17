window.addEventListener('load', function () {
    //console.log("読み込まれた text 配列：", window.ScenarioData.text);
    const text = window.ScenarioData.text;
    const menu = document.getElementById('menu');
    const startBtn = document.getElementById('startBtn');
    const textbox = document.getElementById('textbox');
    var mess_box = this.document.getElementById('textbox');
    var mess_text = this.document.getElementById('text');
    const nameInputScreen = document.getElementById('nameInputScreen');
    const nameConfirmBtn = document.getElementById('nameConfirmBtn');
    const playerNameInput = document.getElementById('playerName');
    const charaName = document.getElementById('charaname');
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

    // ＜ゲーム内変数＞
    let playerName = '';//主人公名前保存用

    textbox.classList.add('none');
    startBtn.addEventListener('click', function () {
        $('#menu').fadeOut(1000, function () {
            nameInputScreen.classList.remove('none');
            playerNameInput.focus();
        });
    });

    nameConfirmBtn.addEventListener('click', function () {
        const inputName = playerNameInput.value.trim();
        if (inputName.length === 0) {
            alert('名前を入力してください');
            playerNameInput.focus();
            return;
        }
        playerName = inputName;//名前保存
        charaName.textContent = playerName;//表示

        nameInputScreen.classList.add('none');//入力画面非表示
        $('#messbox').removeClass('none');  // メッセージボックス表示
        $('#textbox').removeClass('none');  // テキストボックス表示
        line_cnt = 0;        // 念のためリセット
        scene_cnt = 0;       // 念のためリセット
        textClick();         // 文字送り開始

        setTimeout(() => {
            mess_box.click();
        }, 500);

    });


    function main() {
        console.log("main_call");
        console.log(split_chars);
        if (split_chars.length === 0) {
            console.log("error_call");
            mess_text.innerHTML += '<span class="blink-text"></span>';
            return;
        }

        var tmp = split_chars.shift();

        //タグ処理
        if (tmp == '<') {
            console.log("tag_call");
            let tagget_str = '';
            tmp = split_chars.shift();
            while (tmp != '>' && tmp !== undefined) {
                tagget_str += tmp;
                tmp = split_chars.shift();
            }

            console.log('タグ検出:', tagget_str);
            tagget_str = tagget_str.split(/\s/);
            console.log('分割タグ:', tagget_str);
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
                            scene_cnt = Number(select_num1);
                            line_cnt = 0;
                            $('.selectBox').removeClass('show');
                            selectNoneRemove();
                            setTimeout(() => textClick(), 0);
                        });
                    }
                    break;
                case 'select2':
                    if (tagget_str[1] === "none") {
                        $('#select2').addClass('none');
                    } else {
                        select_num2 = tagget_str[1];
                        select2.addEventListener('click', function () {
                            scene_cnt = Number(select_num2);
                            line_cnt = 0;
                            $('.selectBox').removeClass('show');
                            selectNoneRemove();
                            setTimeout(() => textClick(), 0);
                        });
                    }
                    break;
                case 'select3':
                    if (tagget_str[1] === "none") {
                        $('#select3').addClass('none');
                    } else {
                        select_num3 = tagget_str[1];
                        select3.addEventListener('click', function () {
                            scene_cnt = Number(select_num3);
                            line_cnt = 0;
                            $('.selectBox').removeClass('show');
                            selectNoneRemove();
                            setTimeout(() => textClick(), 0);
                        });
                    }
                    break;
                case 'break':
                    //改行
                    mess_text.innerHTML += '<br>';
                    setTimeout(main, lINTERVA);
                    return;
                case 'skip':
                    scene_cnt = tagget_str[1];
                    line_cnt = 0;
                    textClick();
                    return;
                case 'stop':
                    //エンディングに飛ばしたい。
                    break;
                case 'bg':
                    //スチル生成
                    document.getElementById('bgimg').src = 'img/bg' + tagget_str[1] + '.jpg';
                    break;
                case 'chara':
                    //キャラ生成
                    const charaId = 'chara' + tagget_str[1];
                    const charaPath = 'img/chara' + tagget_str[2] + '.png';
                    console.log(`キャラ表示: #${charaId} に ${charaPath} を設定`);
                    const charaImg = document.getElementById(charaId);
                    if (charaImg) {
                        charaImg.src = charaPath;
                        charaImg.style.display = 'block';
                    } else {
                        console.error(`キャラ画像の <img> 要素が見つかりません: #${charaId}`);
                    }
                    break;

                case 'fadeIn_chara':
                    function fadeIn_chara_remove() {
                        $('#charaposition' + tagget_str[1]).removeClass('fadein');
                    }
                    document.getElementById('chara' + tagget_str[1]).src = 'img/chara' + tagget_str[2] + '.png';
                    $('#charaposition' + tagget_str[1]).addClass('fadein');
                    setTimeout(fadeIn_chara_remove, 500);
                    break;
                case 'fadeOut_chara':
                    function fadeOut_chara_remove() {
                        $('#charaposition' + tagget_str[1]).removeClass('fadeout');
                        document.getElementById('chara' + tagget_str[1]).src = 'img/chara' + tagget_str[2] + '.png';
                    }
                    $('#charaposition' + tagget_str[1]).addClass('fadeout');
                    setTimeout(fadeOut_chara_remove, 500);
                    break;
                case 'fadeOutIn_bg':
                    function fadeOutIn_bg_change() {
                        document.getElementById('bgimg').src = 'img/bg' + tagget_str[1] + '.jpg';
                    }
                    function fadeOutIn_bg_remove() {
                        $('#bgimg').removeClass('fadeoutin');
                        $('#messbox').removeClass('fadeoutin');
                        $('#textbox').removeClass('none');
                        $('#textbox').removeClass('fadeoutin');
                        $('#textbox').trigger('click');
                    }
                    $('#bgimg').addClass('fadeoutin');
                    $('#messbox').addClass('fadeoutin');
                    $('#textbox').addClass('none');
                    setTimeout(fadeOutIn_bg_change, 1500);
                    setTimeout(fadeOutIn_bg_remove, 3000);
                    break;
                case 'fadeIn_bg':
                    function fadeIn_bg_remove() {
                        $('#bgimg').removeClass('fadein');
                        $('#messbox').removeClass('fadein');
                    }
                    document.getElementById('bgimg').src = 'img/bg' + tagget_str[1] + '.jpg';
                    $('#bgimg').addClass('fadein');
                    $('#messbox').removeClass('fadein');
                    setTimeout(fadeIn_bg_remove, 3000);
                    break;
            }
            setTimeout(main, lINTERVA);
            return;
        }

        //通常文字出力
        mess_text.innerHTML += tmp;
        setTimeout(main, lINTERVA);
    }

    //文字送りのメソッド
    mess_box.addEventListener('click', function () {
        if (end_flg) return;
        if (mswin_flg) {
            textClick();
        }
    });

    function textClick() {
        console.log("call");

        if (!text[scene_cnt] || !text[scene_cnt][line_cnt]) return;

        //const currentLine = text[scene_cnt][line_cnt];
        let currentLine = text[scene_cnt][line_cnt];

        console.log("現在の行:", currentLine);
        console.log("split_chars の先頭文字:", currentLine[0]);

        // 1. 行の先頭にタグが連続している部分を取り出す
        let tagPart = '';
        while (currentLine.startsWith('<')) {
            let endIndex = currentLine.indexOf('>') + 1;
            if (endIndex === 0) break; // 閉じタグなしは不正
            tagPart += currentLine.slice(0, endIndex);
            currentLine = currentLine.slice(endIndex);
        }

        // 2. タグ部分を配列化して一気に処理する
        if (tagPart) {
            // タグだけ取り出し分割
            const tags = tagPart.match(/<[^>]+>/g);
            for (const tag of tags) {
                split_chars = [...tag];
                main(); // タグ処理
            }
        }

        // 3. 残りがセリフ部分
        const namebox = document.getElementById('namebox');
        if (currentLine.includes(':')) {
            const [rawSpeaker, dialogue] = currentLine.split(':');
            const speaker = rawSpeaker.trim();

            if (speaker === '主人公') {
                namebox.innerHTML = `<strong style="font-size:1.6rem;">${playerName}</strong>`;
            } else {
                namebox.innerHTML = `<strong style="font-size:1.6rem;">${speaker}</strong>`;
            }
            split_chars = [...dialogue];
        } else {
            namebox.innerHTML = '';
            split_chars = [...currentLine];
        }
        mess_text.innerHTML = ''; // 表示リセット
        line_cnt++;               // 行数を先に進める
        main();                   // 表示処理を始める
        setTimeout(processTagOnlyLine, 0); // タグだけの行も処理する
    }

    function processTagOnlyLine() {
        // もしセリフが存在しないか空なら return
        while (
            split_chars.length > 0 &&
            split_chars[0] === '<'
        ) {
            main();
        }
    }



    function selectNoneRemove() {
        $('#select1').removeClass('none');
        $('#select2').removeClass('none');
        $('#select3').removeClass('none');
    }
});
