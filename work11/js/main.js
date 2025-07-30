window.addEventListener('load', function () {
    var text = window.ScenarioData.text;//シナリオデータ
    const startBtn = document.getElementById('startBtn');//スタートボタン
    var mess_box = document.getElementById('textbox');
    const namebox = document.getElementById('namebox');
    var mess_text = document.getElementById('text');
    const nameInputScreen = document.getElementById('nameInputScreen');//名前入力画面取得
    const nameConfirmBtn = document.getElementById('nameConfirmBtn');//確認ボタン
    const playerNameInput = document.getElementById('playerName');//テキスト入力
    var mswin_flg = true;
    var stop_flg = false;
    var end_flg = false;
    var scene_cnt = 0;//シナリオ番号
    var line_cnt = 0;//シナリオポインタ
    const interval = 60;//文字送りの速さ
    var select_num1 = 0;
    var select_num2 = 0;
    var select_num3 = 0;
    var select1 = document.getElementById('select1');
    var select2 = document.getElementById('select2');
    var select3 = document.getElementById('select3');
    var select_text1 = document.getElementById('selectText1');
    var select_text2 = document.getElementById('selectText2');
    var select_text3 = document.getElementById('selectText3');
    var split_chars = [];

    let charIndex = 0;
    let currentMessage = '';
    let waitingForClick = false;
    let textTimer;
    let skip_flg = false;//skipタグ使用中かどうか
    let mainLoopPending = false;   // mainが予約中かどうか
    let skipNextLine = false;      // skipによるジャンプ後のmain呼び出し制御用

    // ＜ゲーム内変数＞
    let playerName = '';//主人公名前保存用

    textbox.classList.add('none');//テキストボックス非表示

    //スタートボタン押したとき
    startBtn.addEventListener('click', function () {
        $('#menu').fadeOut(1000, function () {
            nameInputScreen.classList.remove('none');//名前入力画面表示
            playerNameInput.focus();
        });
    });

    nameConfirmBtn.addEventListener('click', function () {
        console.log("nameconfirmbtn_call");
        const inputName = playerNameInput.value.trim();
        if (inputName.length === 0) {
            alert('名前を入力してください');
            playerNameInput.focus();
            return;
        }
        playerName = inputName;//名前保存
        /// charaName.textContent = playerName;//キャラ名表示
        console.log("主人公名前：", playerName);
        nameInputScreen.classList.add('none');//入力画面非表示
        messbox.classList.remove('none');
        textbox.classList.remove('none');
        line_cnt = 0;
        scene_cnt = 0;
        mess_text.innerHTML = '';
        split_chars = parseLine(text[scene_cnt][line_cnt]);
        main();       // ゲーム開始
    });

    //main処理
    function main() {
        console.log("main_call");

        if (mainLoopPending) return;
        mainLoopPending = true;

        // 全てのタグを先に処理
        while (split_chars[0] && split_chars[0].startsWith('<') && split_chars[0].endsWith('>')) {
            const tag = split_chars.shift();
            const tag_str = tag.slice(1, -1); // < > を除去
            processTag(tag_str);
        }

        //タグのみ又はsplit_charsが空なら次の行へ進む
        if (!split_chars.length) {
            line_cnt++;
            if (line_cnt >= text[scene_cnt].length) {
                line_cnt = 0;
            }
            split_chars = parseLine(text[scene_cnt][line_cnt]);
            mainLoopPending = false; // 再入可能にしておく
            setTimeout(main, 0);     // 次のmainを非同期実行
            return;
        }

        //セリフ処理
        //文字列を全部まとめる（split_charsは1文字ずつ）
        let fullText = '';
        while (split_chars.length > 0 && !split_chars[0].startsWith('<')) {
            fullText += split_chars.shift();
        }

        // 名前とセリフに分割
        const colonPos = fullText.indexOf(':');
        let name = '';
        let message = fullText;
        if (colonPos !== -1) {
            name = fullText.slice(0, colonPos).trim();
            message = fullText.slice(colonPos + 1).trim();
        }

        // 名前表示
        if (name) {
            if (name === '主人公') {
                namebox.textContent = `【${playerName.toUpperCase()}】`;
            } else {
                namebox.textContent = `【${name.toUpperCase()}】`;
            }
            namebox.style.fontWeight = 'bold';
            namebox.style.fontSize = '1.6rem';
        } else {
            namebox.textContent = '';
        }

        // セリフ表示初期化
        mess_text.innerHTML = '';
        currentMessage = message;
        charIndex = 0;
        waitingForClick = false;

        //skipタグフラグ確認
        if (skip_flg) {
            skip_flg = false;
            setTimeout(() => {
                textAdvance();
                mainLoopPending = false;
            }, 0);
        } else {
            // 文字送り開始
            textAdvance();
            mainLoopPending = false;
        }
    }

    //タグと文字列を分離
    function parseLine(line) {
        const parts = [];
        const regex = /<[^>]+>|[^<]+/g;
        let match;
        while ((match = regex.exec(line)) !== null) {
            parts.push(match[0]);
        }

        let result = [];
        for (const part of parts) {
            if (part.startsWith('<') && part.endsWith('>')) {
                result.push(part); // タグはそのまま
            } else {
                result.push(...part.split('')); // テキストは1文字ずつ
            }
        }
        return result;
    }

    //タグ処理
    function processTag(tag) {
        console.log("tag_call");
        const tagget_str = tag.split(/\s/);
        console.log('タグ検出:', tagget_str);
        switch (tagget_str[0]) {
            case 'stop':
                stop_flg = true;
                break;
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
                        line_cnt = 0;
                        $('.selectBox').removeClass('show');
                        selectNoneRemove();

                        split_chars = parseLine(text[scene_cnt][line_cnt]);
                        mess_text.innerHTML = '';
                        skip_flg = true; // スキップ直後として扱う
                        main();
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
                        line_cnt = 0;
                        $('.selectBox').removeClass('show');
                        selectNoneRemove();

                        split_chars = parseLine(text[scene_cnt][line_cnt]);
                        mess_text.innerHTML = '';
                        skip_flg = true; // スキップ直後として扱う
                        main();
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
                        line_cnt = 0;
                        $('.selectBox').removeClass('show');
                        selectNoneRemove();

                        split_chars = parseLine(text[scene_cnt][line_cnt]);
                        mess_text.innerHTML = '';
                        skip_flg = true; // スキップ直後として扱う
                        main();
                    });
                }
                break;
            case 'break':
                mess_text.innerHTML += '<br>';
                break;
            case 'skip':
                scene_cnt = Number(tagget_str[1]);
                line_cnt = 0;
                split_chars = parseLine(text[scene_cnt][line_cnt]);
                skip_flg = true;
                break;
            case 'bg':
                document.getElementById('bgimg').src = 'img/bg' + tagget_str[1] + '.jpg';
                break;
            case 'chara':
                document.getElementById('chara' + tagget_str[1]).src = 'img/chara' + tagget_str[2] + '.png';
                break;
            case 'item':
                document.getElementById('item').src = 'img/item' + tagget_str[1] + '.png';
                break;
            case 'fadeIn_chara':
                $('#charaposition' + tagget_str[1]).addClass('fadein');
                setTimeout(() => {
                    document.getElementById('chara' + tagget_str[1]).src = 'img/chara' + tagget_str[2] + '.png';
                }, 50);
                setTimeout(() => {
                    $('#charaposition' + tagget_str[1]).removeClass('fadein');
                }, 500);
                break;
            case 'fadeIn_bg':
                function fadeIn_bg_remove() {
                    $('#bgimg').removeClass('fadein');
                }
                document.getElementById('bgimg').src = 'img/bg' + tagget_str[1] + '.jpg';
                $('#bgimg').addClass('fadein');
                setTimeout(fadeIn_bg_remove, 500);
                break;
            case 'fadeIn_item':
                function fadeIn_item_remove() {
                    $('.itembox').removeClass('fadein');
                }
                $('.itembox').addClass('fadein');
                setTimeout(fadeIn_item_remove, 500);
                break;
            case 'fadeOut_chara':
                function fadeOut_chara_remove() {
                    $('#charaposition' + tagget_str[1]).removeClass('fadeout');
                    document.getElementById('chara' + tagget_str[1]).src = 'img/chara' + tagget_str[2] + '.png';
                }
                $('#charaposition' + tagget_str[1]).addClass('fadeout');
                setTimeout(fadeOut_chara_remove, 500);
                break;
            case 'fadeOut_bg':
                function fadeOut_bg_remove() {
                    $('#bgimg').removeClass('fadeout');
                    document.getElementById('bgimg').src = 'img/bg' + tagget_str[1] + '.jpg';
                }
                $('#bgimg').addClass('fadeout');
                setTimeout(fadeOut_bg_remove, 500);
                break;
            case 'fadeOut_item':
                function fadeOut_item_remove() {
                    $('.itembox').removeClass('fadeout');
                    document.getElementById('item').src = 'img/item0.png';
                }
                $('.itembox').addClass('fadeout');
                setTimeout(fadeOut_item_remove, 500);
                break;
            case 'fadeOutIn_bg':
                function fadeOutIn_bg_change() {
                    document.getElementById('bgimg').src = 'img/bg' + tagget_str[1] + '.jpg';
                }
                function fadeOutIn_bg_remove() {
                    $('#bgimg').removeClass('fadeoutin');
                    $('#messbox').removeClass('fadeoutin');
                    $('#textbox').removeClass('none');
                    $('#textbox').trigger('click');
                }
                $('#bgimg').addClass('fadeoutin');
                $('#messbox').addClass('fadeoutin');
                $('#textbox').addClass('none');
                setTimeout(fadeOutIn_bg_change, 1500);
                setTimeout(fadeOutIn_bg_remove, 3000);
                break;
            case 'showTextBox':
                $('#messbox').removeClass('none');  // メッセージボックス表示
                $('#textbox').removeClass('none');  // テキストボックス表示
                break;
        }
    }



    // 文字送り用メイン関数（1文字ずつ表示）
    function textAdvance() {
        if (charIndex < currentMessage.length) {
            mess_text.innerHTML += currentMessage.charAt(charIndex);
            charIndex++;
            textTimer = setTimeout(textAdvance, interval);
        } else {
            // 文字送り終了、クリック待ち状態に
            waitingForClick = true;
            mess_text.innerHTML += '<span class="blink-text"><br>▼</span>';
        }
    }

    //メッセージボックスクリックイベント
    mess_box.addEventListener('click', function () {
        if (end_flg) return;
        if (mswin_flg) {
            if (!waitingForClick) {
                //文字送り中クリック→全文表示
                clearTimeout(textTimer);
                mess_text.innerHTML = currentMessage + '<span class="blink-text"><br>▼</span>';
                waitingForClick = true;
            } else {
                //文字送り終了後次の行へ
                line_cnt++;
                if (line_cnt >= text[scene_cnt].length) {
                    line_cnt = 0;
                }
                // 行をパースしてタグ＋文字を分離
                split_chars = parseLine(text[scene_cnt][line_cnt]);
                mess_text.innerHTML = '';
                main();
            }
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